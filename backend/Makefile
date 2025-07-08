.PHONY: help test test-verbose coverage lint format typecheck clean

# Couleurs
GREEN=\033[0;32m
NC=\033[0m

help:
	@echo ""
	@echo "$(GREEN)Available commands :$(NC)"
	@echo "  make test         - Launch tests with coverage and colors"
	@echo "  make test-verbose - Launch tests in verbose mode"
	@echo "  make coverage     - Generate the HTML coverage report"
	@echo "  make lint         - Linter the code (flake8)"
	@echo "  make format       - Format the code (black)"
	@echo "  make typecheck    - Check the types (mypy)"
	@echo "  make clean        - Clean the temporary files"
	@echo ""

test:
	pytest --color=yes --cov=core --cov-report=term-missing tests/

test-verbose:
	pytest -v --color=yes --cov=core --cov-report=term-missing tests/

coverage:
	pytest --cov=core --cov-report=html tests/
	@echo "$(GREEN)Open htmlcov/index.html in your browser to see the coverage report.$(NC)"

lint:
	flake8 core/

format:
	black core/

typecheck:
	mypy core/

clean:
	find . -type f -name '*.pyc' -delete
	rm -rf .pytest_cache htmlcov .mypy_cache
