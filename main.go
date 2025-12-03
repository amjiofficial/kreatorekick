package main

import (
    "log"
    "net/http"
    "os"
)

func main() {
    // Serve static files directly from the ./static directory.
    http.Handle("/", http.FileServer(http.Dir("./static")))

    // Cloud Run injects PORT; default to 8080 for local use.
    port := os.Getenv("PORT")
    if port == "" {
        port = "8080"
    }

    log.Printf("KreativeKick landing page listening on :%s", port)
    if err := http.ListenAndServe(":"+port, nil); err != nil {
        log.Fatal(err)
    }
}
