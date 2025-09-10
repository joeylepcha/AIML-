# Contributing to AI Microservices Assignment

Thank you for considering contributing to this assignment project! This document contains guidelines to help you contribute effectively.

## Getting Started

1. Fork the repository
2. Clone your fork locally
3. Create a new branch for your feature or bug fix
4. Make your changes
5. Test your changes
6. Commit your changes with a clear, descriptive commit message
7. Push your changes to your fork
8. Create a pull request

## Development Setup

1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   pip install -r requirements-dev.txt
   ```

3. Install pre-commit hooks:
   ```bash
   pre-commit install
   ```

## Code Style

This project follows the PEP 8 style guide for Python code. We use Black for code formatting and Flake8 for linting.

- Use Black to format your code:
  ```bash
  black .
  ```

- Check for linting issues:
  ```bash
  flake8 .
  ```

## Testing

Before submitting a pull request, make sure your changes pass all tests:

```bash
python test_services.py
```

If you add new functionality, please add corresponding tests.

## Reporting Issues

If you find a bug or have a feature request, please create an issue on GitHub with:

1. A clear, descriptive title
2. A detailed description of the problem or feature
3. Steps to reproduce (for bugs)
4. Expected and actual behavior (for bugs)
5. Any relevant code snippets or error messages

## Pull Request Guidelines

- Keep pull requests focused on a single feature or bug fix
- Write clear, descriptive commit messages
- Include tests for new functionality
- Update documentation as needed
- Ensure all tests pass before submitting

## Code of Conduct

Please note that this project is released with a Contributor Code of Conduct. By participating in this project you agree to abide by its terms.

## Questions?

If you have any questions about contributing, feel free to create an issue asking for clarification.