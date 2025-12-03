package main

import (
    "embed"
    "io/fs"
    "log"
    "net/http"
    "os"
    "time"
)

//go:embed static/*
var embeddedFiles embed.FS

func main() {
    port := os.Getenv("PORT")
    if port == "" {
        port = "8080"
    }

    static, err := fs.Sub(embeddedFiles, "static")
    if err != nil {
        log.Fatalf("unable to load static assets: %v", err)
    }

    fileServer := http.FileServer(http.FS(static))
    mux := http.NewServeMux()
    mux.Handle("/healthz", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        w.WriteHeader(http.StatusOK)
        _, _ = w.Write([]byte("ok"))
    }))
    mux.Handle("/", logRequests(fileServer))

    server := &http.Server{
        Addr:         ":" + port,
        Handler:      mux,
        ReadTimeout:  5 * time.Second,
        WriteTimeout: 10 * time.Second,
        IdleTimeout:  30 * time.Second,
    }

    log.Printf("KreativeKick landing page listening on :%s", port)
    if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
        log.Fatalf("server error: %v", err)
    }
}

func logRequests(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        start := time.Now()
        next.ServeHTTP(w, r)
        log.Printf("%s %s %s", r.Method, r.URL.Path, time.Since(start))
    })
}
