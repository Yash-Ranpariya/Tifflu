# Deploying Tifflu

## 1. Prerequisites
- **Java JDK 17+** (You have Java 24 installed, which works).
- **Maven**: Ensure Maven is installed and added to your system PATH.
    - If `mvn -version` fails in a new terminal, you need to add the `bin` folder of your Maven installation to the `Path` environment variable.

## 2. Setting Up the Database
Ensure your MySQL server is running and the database `tifflu_db_v2` exists. It will be created automatically if you run the backend successfully.

## 3. Building the Backend
1. Open a terminal in `c:\tiffin\tifflu\backend`.
2. Run:
   ```powershell
   mvn clean package
   ```
   This will create a JAR file in `target/` directory (e.g., `backend-0.0.1-SNAPSHOT.jar`).

## 4. Running the Backend (Production/Deployment)
To run the built JAR file:
```powershell
java -jar target/backend-0.0.1-SNAPSHOT.jar
```
The server will start on port `9090`.

## 5. Frontend Deployment
For a simple deployment, you can serve the frontend files using a static server (like Python or Nginx).

### Using Python (Local Testing/Simple Hosting)
1. Open a terminal in `c:\tiffin\tifflu\frontend`.
2. Run:
   ```powershell
   python -m http.server 8000
   ```
3. Access the app at `http://localhost:8000`.

### Using a Production Web Server (Nginx/Apache)
Copy the contents of `c:\tiffin\tifflu\frontend` to your web server's root directory (e.g., `/var/www/html` on Linux).

## 6. Cloud Deployment
To deploy to the cloud (e.g., AWS, Render, Heroku):
1. **Backend**: Upload the JAR file or connect your Git repository. Ensure the cloud provider has Java installed. set `SPRING_DATASOURCE_URL` environment variable to your cloud database URL.
2. **Frontend**: Deploy the static files to a service like Vercel or Netlify. Update `api.js` (or wherever API URL is defined) to point to your cloud backend URL instead of `localhost:9090`.
