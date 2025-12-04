# syntax=docker/dockerfile:1
FROM golang:1.22-alpine AS builder
WORKDIR /app

# Cache modules
COPY go.mod go.sum ./
RUN go mod download

# Build
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o server

FROM gcr.io/distroless/static-debian12
WORKDIR /app
COPY --from=builder /app/server /app/server
COPY static /app/static
ENV PORT=8080
EXPOSE 8080
CMD ["/app/server"]
