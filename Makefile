.PHONY: setup install-deps start-frontend start-backend start dev

setup: install-deps

install-deps:
	cd server && npm install
	cd app && npm install

start-frontend:
	cd app && npm run dev

start-backend:
	cd server && npm run dev

start:
	@echo "Starting both frontend and backend services..."
	@if command -v npx >/dev/null 2>&1; then \
		npx concurrently "make start-frontend" "make start-backend"; \
	else \
		echo "Please install concurrently: npm install -g concurrently"; \
		echo "Then run: make start"; \
		exit 1; \
	fi

dev: setup start
