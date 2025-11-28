# aggregator-toy-web

Documentation website for [aggregator-toy](https://github.com/michaellperry/aggregator-toy), a TypeScript library for building composable, commutative aggregators with incremental updates.

## Live Site

Visit the documentation at: https://michaellperry.github.io/aggregator-toy-web/

## Development

This website is built with [VitePress](https://vitepress.dev/).

### Prerequisites

- Node.js 18+
- npm

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run docs:dev

# Build for production
npm run docs:build

# Preview production build
npm run docs:preview
```

### Project Structure

```
├── docs/
│   ├── .vitepress/
│   │   └── config.mts      # VitePress configuration
│   ├── api/                # API reference documentation
│   ├── comparisons/        # Comparison with other libraries
│   ├── guide/              # Guides and tutorials
│   └── index.md            # Home page
├── .github/
│   └── workflows/
│       └── static.yml      # GitHub Pages deployment
└── package.json
```

## Deployment

Deployment is handled automatically via GitHub Actions when changes are pushed to the `main` branch.

## Documentation Structure

- **Home** - Overview and quick example
- **Docs** - Introduction, core concepts, pipelines, state shape, performance
- **Guides** - Getting started, vote leaderboard, rolling metrics, multi-level grouping
- **API Reference** - Complete API documentation
- **Comparisons** - vs RxJS, Crossfilter, DynamicData, Arquero

## Related

- [aggregator-toy](https://github.com/michaellperry/aggregator-toy) - The main library repository

## License

MIT
