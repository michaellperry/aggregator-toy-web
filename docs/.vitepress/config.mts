import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'aggregator-toy',
  description: 'Live aggregations for in-memory data',
  base: '/aggregator-toy-web/',
  
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/aggregator-toy-web/favicon.svg' }]
  ],

  themeConfig: {
    logo: '/logo.svg',
    
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Docs', link: '/guide/introduction' },
      { text: 'Guides', link: '/guide/getting-started' },
      { text: 'API Reference', link: '/api/' },
      { text: 'Comparisons', link: '/comparisons/' }
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Introduction',
          items: [
            { text: 'What is aggregator-toy?', link: '/guide/introduction' },
            { text: 'Core Concepts', link: '/guide/core-concepts' },
            { text: 'Pipelines and Steps', link: '/guide/pipelines-and-steps' },
            { text: 'State Shape', link: '/guide/state-shape' },
            { text: 'Performance & Scaling', link: '/guide/performance' }
          ]
        },
        {
          text: 'Guides',
          items: [
            { text: 'Getting Started', link: '/guide/getting-started' },
            { text: 'Vote Leaderboard', link: '/guide/vote-leaderboard' },
            { text: 'Rolling Metrics Over Time', link: '/guide/rolling-metrics' },
            { text: 'Multi-level Grouping', link: '/guide/multi-level-grouping' }
          ]
        }
      ],
      '/api/': [
        {
          text: 'API Reference',
          items: [
            { text: 'Overview', link: '/api/' },
            { text: 'createPipeline', link: '/api/create-pipeline' },
            { text: 'groupBy', link: '/api/group-by' },
            { text: 'sum', link: '/api/sum' },
            { text: 'count', link: '/api/count' },
            { text: 'min / max', link: '/api/min-max' },
            { text: 'average', link: '/api/average' },
            { text: 'pickByMin / pickByMax', link: '/api/pick-by' },
            { text: 'commutativeAggregate', link: '/api/commutative-aggregate' },
            { text: 'in (scoping)', link: '/api/in' },
            { text: 'defineProperty', link: '/api/define-property' },
            { text: 'dropProperty', link: '/api/drop-property' }
          ]
        }
      ],
      '/comparisons/': [
        {
          text: 'Comparisons',
          items: [
            { text: 'Overview', link: '/comparisons/' },
            { text: 'vs RxJS', link: '/comparisons/rxjs' },
            { text: 'vs Crossfilter', link: '/comparisons/crossfilter' },
            { text: 'vs DynamicData', link: '/comparisons/dynamic-data' },
            { text: 'vs Arquero', link: '/comparisons/arquero' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/michaellperry/aggregator-toy' }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024 Michael L Perry'
    },

    search: {
      provider: 'local'
    }
  }
})
