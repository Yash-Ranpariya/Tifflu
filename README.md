# Tifflu - Premium Tiffin Service

This project consists of a Spring Boot backend and a Vanilla JavaScript frontend.

## Prerequisites

- **Java Development Kit (JDK)**: Version 17 or higher.
- **Maven**: For building the backend.
- **Node.js**: For running the frontend server.

## 1. Backend (Spring Boot)

Located in `backend/`.

### Running with Command Line
Open a terminal in the `backend` directory and run:

```bash
mvn spring-boot:run
```

The server will start on `http://localhost:9090`.

### Running with Spring Tools (VS Code / STS)
If you have the **Spring Boot Tools** extension installed:
1. Open the **Spring Boot Dashboard** in the side panel.
2. Under "Apps", find `tifflu-backend`.
3. Click the "Start" (Play) button.
4. Or, open `src/main/java/com/tifflu/App.java` and click "Run" above the `main` method.

## 2. Frontend (Vanilla JS)

Located in `frontend/`.

### Setup
Open a terminal in the `frontend` directory and install dependencies (if not done):

```bash
npm install
```

### Running
Start the development server:

```bash
npx serve .
```

The frontend will be available at `http://localhost:3000`.

## Project Structure

- `backend/`: Java Spring Boot application (API, Database).
- `frontend/`: HTML/CSS/JS application (UI).
