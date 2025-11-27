# aggregator-toy-web

Documentation website for [aggregator-toy](https://github.com/michaellperry/aggregator-toy), a TypeScript library for building composable, commutative aggregators.

## About

This repository contains the static website documentation for the aggregator-toy library. The website is automatically deployed to GitHub Pages.

## Live Site

Visit the documentation at: https://michaellperry.github.io/aggregator-toy-web/

## Development

The website is a simple static HTML site located in the `docs/` directory. To make changes:

1. Edit the files in the `docs/` directory
2. Commit and push to the `main` branch
3. GitHub Actions will automatically deploy to GitHub Pages

## Deployment

Deployment is handled automatically via GitHub Actions when changes are pushed to the `main` branch. The workflow:

1. Checks out the repository
2. Configures GitHub Pages
3. Uploads the `docs/` directory as an artifact
4. Deploys to GitHub Pages

## Repository Structure

```
├── .github/
│   └── workflows/
│       └── static.yml    # GitHub Actions deployment workflow
├── docs/
│   └── index.html        # Main documentation page
└── README.md             # This file
```

## Related

- [aggregator-toy](https://github.com/michaellperry/aggregator-toy) - The main library repository
- [Design Documents](https://github.com/michaellperry/aggregator-toy/tree/main/docs) - Detailed design documentation

## License

MIT
