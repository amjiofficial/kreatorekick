package main

import (
	"database/sql"
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	_ "modernc.org/sqlite"
)

type personalRecord struct {
	ID         int64     `json:"id"`
	Name       string    `json:"name"`
	FatherName string    `json:"fatherName"`
	CreatedAt  time.Time `json:"createdAt"`
}

type app struct {
	db *sql.DB
}

func main() {
	db, err := connectDB("./kreativekick.db")
	if err != nil {
		log.Fatalf("failed to connect to database: %v", err)
	}
	defer db.Close()

	if err := ensureTable(db); err != nil {
		log.Fatalf("failed to prepare table: %v", err)
	}

	a := &app{db: db}

	mux := http.NewServeMux()
	mux.Handle("/", http.FileServer(http.Dir("./static")))
	mux.HandleFunc("/api/personal", a.handlePersonal)
	mux.HandleFunc("/api/personal/", a.handlePersonalWithID)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("KreativeKick (SQLite) listening on :%s", port)
	if err := http.ListenAndServe(":"+port, mux); err != nil {
		log.Fatal(err)
	}
}

func connectDB(dbPath string) (*sql.DB, error) {
	if err := os.MkdirAll(filepath.Dir(dbPath), 0o755); err != nil {
		return nil, err
	}
	db, err := sql.Open("sqlite", dbPath)
	if err != nil {
		return nil, err
	}
	// So concurrent writes queue instead of erroring.
	if _, err := db.Exec("PRAGMA busy_timeout = 5000;"); err != nil {
		return nil, err
	}
	return db, nil
}

func ensureTable(db *sql.DB) error {
	const query = `
CREATE TABLE IF NOT EXISTS personal_info (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    father_name TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);`
	_, err := db.Exec(query)
	return err
}

func (a *app) handlePersonal(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		a.listRecords(w, r)
	case http.MethodPost:
		a.createRecord(w, r)
	default:
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
	}
}

func (a *app) handlePersonalWithID(w http.ResponseWriter, r *http.Request) {
	id, err := parseID(r.URL.Path, "/api/personal/")
	if err != nil {
		http.Error(w, "invalid id", http.StatusBadRequest)
		return
	}

	switch r.Method {
	case http.MethodPut:
		a.updateRecord(w, r, id)
	case http.MethodDelete:
		a.deleteRecord(w, r, id)
	default:
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
	}
}

func (a *app) listRecords(w http.ResponseWriter, r *http.Request) {
	const query = `SELECT id, name, father_name, created_at FROM personal_info ORDER BY id DESC`
	rows, err := a.db.QueryContext(r.Context(), query)
	if err != nil {
		log.Printf("list query failed: %v", err)
		http.Error(w, "failed to fetch records", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var records []personalRecord
	for rows.Next() {
		var rec personalRecord
		if err := rows.Scan(&rec.ID, &rec.Name, &rec.FatherName, &rec.CreatedAt); err != nil {
			log.Printf("scan failed: %v", err)
			http.Error(w, "failed to read records", http.StatusInternalServerError)
			return
		}
		records = append(records, rec)
	}

	writeJSON(w, records, http.StatusOK)
}

func (a *app) createRecord(w http.ResponseWriter, r *http.Request) {
	var payload personalRecord
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, "invalid json", http.StatusBadRequest)
		return
	}
	if strings.TrimSpace(payload.Name) == "" || strings.TrimSpace(payload.FatherName) == "" {
		http.Error(w, "name and fatherName are required", http.StatusBadRequest)
		return
	}

	const query = `INSERT INTO personal_info (name, father_name) VALUES (?, ?)`
	res, err := a.db.ExecContext(r.Context(), query, payload.Name, payload.FatherName)
	if err != nil {
		log.Printf("insert failed: %v", err)
		http.Error(w, "failed to save record", http.StatusInternalServerError)
		return
	}

	payload.ID, _ = res.LastInsertId()

	if err := a.db.QueryRowContext(r.Context(), `SELECT created_at FROM personal_info WHERE id = ?`, payload.ID).Scan(&payload.CreatedAt); err != nil {
		log.Printf("fetch created_at failed: %v", err)
	}

	writeJSON(w, payload, http.StatusCreated)
}

func (a *app) updateRecord(w http.ResponseWriter, r *http.Request, id int64) {
	var payload personalRecord
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, "invalid json", http.StatusBadRequest)
		return
	}
	if strings.TrimSpace(payload.Name) == "" || strings.TrimSpace(payload.FatherName) == "" {
		http.Error(w, "name and fatherName are required", http.StatusBadRequest)
		return
	}

	const query = `UPDATE personal_info SET name = ?, father_name = ? WHERE id = ?`
	res, err := a.db.ExecContext(r.Context(), query, payload.Name, payload.FatherName, id)
	if err != nil {
		log.Printf("update failed: %v", err)
		http.Error(w, "failed to update record", http.StatusInternalServerError)
		return
	}
	if rows, _ := res.RowsAffected(); rows == 0 {
		http.Error(w, "record not found", http.StatusNotFound)
		return
	}

	if err := a.db.QueryRowContext(r.Context(), `SELECT created_at FROM personal_info WHERE id = ?`, id).Scan(&payload.CreatedAt); err != nil {
		log.Printf("fetch created_at failed: %v", err)
	}
	payload.ID = id
	writeJSON(w, payload, http.StatusOK)
}

func (a *app) deleteRecord(w http.ResponseWriter, r *http.Request, id int64) {
	const query = `DELETE FROM personal_info WHERE id = ?`
	res, err := a.db.ExecContext(r.Context(), query, id)
	if err != nil {
		log.Printf("delete failed: %v", err)
		http.Error(w, "failed to delete record", http.StatusInternalServerError)
		return
	}
	if rows, _ := res.RowsAffected(); rows == 0 {
		http.Error(w, "record not found", http.StatusNotFound)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

func writeJSON(w http.ResponseWriter, data any, status int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	if err := json.NewEncoder(w).Encode(data); err != nil {
		log.Printf("write json failed: %v", err)
	}
}

func parseID(path, prefix string) (int64, error) {
	trimmed := strings.TrimPrefix(path, prefix)
	if trimmed == path || trimmed == "" {
		return 0, errors.New("missing id")
	}
	return strconv.ParseInt(trimmed, 10, 64)
}
