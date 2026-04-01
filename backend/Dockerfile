# ==================================
# STAGE 1: Build
# ==================================
FROM maven:3.9-eclipse-temurin-17-alpine AS builder

WORKDIR /app

# Copia arquivos de dependências primeiro (cache de layer)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copia código-fonte e compila
COPY src ./src
RUN mvn clean package -DskipTests -B

# ==================================
# STAGE 2: Run
# ==================================
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Instala wget para healthcheck
RUN apk add --no-cache wget

# Copia apenas o JAR compilado do stage anterior
COPY --from=builder /app/target/gestor-apostas-1.0.0.jar app.jar

# Cria usuário não-root para segurança
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Porta do Spring Boot
EXPOSE 8080

# Variáveis de ambiente (podem ser sobrescritas no docker-compose)
ENV JAVA_OPTS="-Xms256m -Xmx512m"

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/actuator/health || exit 1

# Comando de inicialização
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
