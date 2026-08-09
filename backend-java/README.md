# backend-java

This is a Spring Boot (Java 8) backend using MyBatis-Plus for the products API. It is intended to run against the existing MySQL service in docker-compose.

Quick start (local with Maven):

1. Build:

   mvn package -DskipTests

2. Run (ensure a MySQL database is available and environment variables set):

   DB_HOST=localhost DB_PORT=3306 DB_NAME=ds_pt DB_USER=root DB_PASS=password java -jar target/backend-java-0.0.1-SNAPSHOT.jar

Docker:

- A Dockerfile is included; you can add this service to docker-compose and link it to the existing mysql service.

Notes:
- Application listens on port 3001 by default to match the frontend proxy.
- Flyway migration SQL is included under src/main/resources/db/migration to create the products table if needed.
