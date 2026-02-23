.PHONY: help build test test-unit test-integration coverage sonar clean docker-up docker-down sonar-up

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# ── Build ──
build: ## Build all services (skip tests)
	./gradlew build -x test

clean: ## Clean build artifacts
	./gradlew clean

# ── Testing ──
test: ## Run all tests (unit + integration)
	./gradlew test

test-unit: ## Run unit tests only (exclude integration)
	./gradlew test --tests '*Test' --exclude-task '*IntegrationTest*'

test-integration: ## Run integration tests (requires Docker for Testcontainers)
	./gradlew test --tests '*IntegrationTest'

coverage: ## Run tests and generate JaCoCo coverage reports
	./gradlew test jacocoTestReport
	@echo "\n📊 Coverage reports:"
	@for svc in api-gateway user-auth-service product-service pandit-service order-service rag-ai-service payment-service notification-service; do \
		echo "  $$svc: build/$$svc/reports/jacoco/test/html/index.html"; \
	done

coverage-merged: ## Generate merged coverage report across all services
	./gradlew test jacocoMergedReport
	@echo "\n📊 Merged report: build/reports/jacoco/jacocoMergedReport/html/index.html"

# ── SonarQube ──
sonar-up: ## Start SonarQube server (http://localhost:9000)
	docker-compose -f docker-compose.sonar.yml up -d
	@echo "⏳ SonarQube starting at http://localhost:9000 (default login: admin/admin)"

sonar: ## Run SonarQube analysis (set SONAR_TOKEN env var first)
	./gradlew test jacocoTestReport sonar

# ── Docker ──
docker-up: ## Start full stack with Docker Compose
	docker-compose up -d --build

docker-down: ## Stop all containers
	docker-compose down

docker-logs: ## Tail all container logs
	docker-compose logs -f

docker-ps: ## Show container status
	docker-compose ps

# ── Frontend ──
frontend-dev: ## Run frontend in dev mode
	cd frontend && npm install && npm run dev

frontend-build: ## Build frontend for production
	cd frontend && npm install && npm run build

# ── Init ──
init: ## First-time setup: generate Gradle wrapper + copy env file
	gradle wrapper --gradle-version 8.12
	cp -n .env.example .env || true
	@echo "✅ Run 'make docker-up' to start the full stack"
