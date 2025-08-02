# EV Charge calculator

A simple EV/Hybrid charge cost calculator

## Development

```bash
npm install
npm run dev
```

## Release Process

This project uses [git-cliff](https://git-cliff.org/) for automated changelog generation and semantic versioning.

### Workflow:

1. **Development**: Work on the `main` branch using conventional commits
2. **Release**: Merge to `production` branch to trigger automated release
3. **Docker**: Docker images are built and pushed only on releases

### Conventional Commits:

Use conventional commit messages for automatic changelog generation:

- `feat:` - New features (bumps minor version)
- `fix:` - Bug fixes (bumps patch version)
- `feat!:` or `fix!:` - Breaking changes (bumps major version)
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Test changes
- `chore:` - Maintenance tasks

### Manual Release:

```bash
# Generate changelog preview
npm run changelog

# Create release (generates changelog, creates tag)
npm run release
```
