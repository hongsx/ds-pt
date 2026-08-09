# Stage 1: build
FROM maven:3.6.3-jdk-8 AS build
WORKDIR /workspace
COPY pom.xml mvnw .
COPY src ./src
RUN mvn -B -DskipTests package

# Stage 2: run
FROM openjdk:8-jre-slim
WORKDIR /app
COPY --from=build /workspace/target/backend-java-0.0.1-SNAPSHOT.jar ./app.jar
EXPOSE 3001
ENTRYPOINT ["java","-jar","/app/app.jar"]
