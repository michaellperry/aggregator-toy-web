# Comparisons

aggregator-toy occupies a specific niche in the data processing ecosystem. This section compares it with related libraries to help you understand when to use each.

## Quick Comparison

| Library | Focus | Incremental | Typed | Use Case |
|---------|-------|-------------|-------|----------|
| **aggregator-toy** | Live aggregation pipelines | ✅ Yes | ✅ Yes | Dashboards, leaderboards |
| **RxJS** | General reactive streams | Manual | ✅ Yes | Complex async flows |
| **Crossfilter** | Multi-dimensional filtering | ✅ Yes | ❌ No | Data exploration |
| **DynamicData** | .NET reactive collections | ✅ Yes | ✅ Yes | .NET applications |
| **Arquero** | Columnar data transforms | ❌ No | Partial | Batch analytics |

## When to Use aggregator-toy

Choose aggregator-toy when you need:

- **Real-time updates** - Data streams in continuously
- **Grouped aggregations** - Sum, count, min/max by category
- **UI-ready state** - Nested structure maps to components
- **TypeScript support** - Full type inference

## When to Consider Alternatives

- **Complex async flows** → RxJS
- **Cross-filtering dashboards** → Crossfilter
- **Batch analytics** → Arquero
- **.NET ecosystem** → DynamicData

## Detailed Comparisons

- [vs RxJS](/comparisons/rxjs) - General reactive programming
- [vs Crossfilter](/comparisons/crossfilter) - Browser-based filtering
- [vs DynamicData](/comparisons/dynamic-data) - .NET reactive collections
- [vs Arquero](/comparisons/arquero) - Columnar data processing
