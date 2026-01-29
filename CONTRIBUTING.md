# Contributing to 2FA Generator

First off, thank you for considering contributing to 2FA Generator! 🎉

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Style Guidelines](#style-guidelines)

## 📜 Code of Conduct

This project and everyone participating in it is governed by our commitment to providing a welcoming and inclusive environment. Please be respectful and constructive in all interactions.

## 🤔 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues. When creating a bug report, include:

- **Clear title** describing the issue
- **Steps to reproduce** the behavior
- **Expected behavior** vs actual behavior
- **Screenshots** if applicable
- **Environment** (browser, OS, etc.)

### Suggesting Features

Feature requests are welcome! Please:

- Check if the feature already exists or is planned
- Provide a clear use case
- Consider security implications (we don't store secrets!)

### Code Contributions

1. Look for issues labeled `good first issue` or `help wanted`
2. Comment on the issue to express interest
3. Wait for assignment before starting work

## 🛠️ Development Setup

### Prerequisites

- Node.js 20+
- Yarn

### Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/2fa-generator.git
cd 2fa-generator

# Install dependencies
yarn install

# Start dev server
yarn dev
```

### Available Scripts

```bash
yarn dev        # Start development server on port 5001
yarn build      # Build for production
yarn test       # Run tests in watch mode
yarn test:run   # Run tests once
yarn lint       # Run ESLint
yarn deploy     # Deploy to Cloudflare Pages
```

## 🔄 Pull Request Process

1. **Fork** the repository
2. **Create a branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes** following our style guidelines
4. **Test your changes**:
   ```bash
   yarn test:run
   yarn build
   ```
5. **Commit** with a clear message:
   ```bash
   git commit -m "feat: add amazing feature"
   ```
6. **Push** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Open a Pull Request** against `main`

### Commit Message Format

We use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation only
- `style:` Code style (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

## 📐 Style Guidelines

### Code Style

- Use TypeScript for all new code
- Follow existing code patterns
- Keep files under 200 lines when possible
- Use meaningful variable/function names

### Component Guidelines

- Use functional components with hooks
- Keep components focused and reusable
- Use Tailwind CSS for styling
- Follow the neon terminal theme aesthetic

### Security Guidelines

⚠️ **Critical**: This is a security-focused tool. Please ensure:

- No secrets are ever logged to console
- No secrets are sent to any server
- No secrets are stored in localStorage/sessionStorage
- No external analytics or tracking

## 🎨 UI/UX Guidelines

When contributing UI changes:

- Maintain the neon terminal aesthetic
- Use existing color variables (`neon-cyan`, `neon-green`, `neon-magenta`)
- Ensure responsive design
- Test on both desktop and mobile

## 📝 Documentation

- Update README.md if adding features
- Add JSDoc comments for public functions
- Update type definitions as needed

## ❓ Questions?

Feel free to open an issue with the `question` label.

---

Thank you for contributing! 💚
