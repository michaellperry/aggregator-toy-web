# What is aggregator-toy?

aggregator-toy is a small library for building incremental aggregation pipelines over live, in-memory data.

It is designed for situations where:

- You receive a stream of records over time.
- You want derived views: groups, sums, averages, min/max, "pick the latest", etc.
- You care about keeping updates fast as more data arrives.
- You are happy to trade memory for speed.

## The Core Idea

The core idea is simple: you compose steps into a pipeline. Each step listens for changes in the pipeline state (items being added, removed, or modified) and maintains its own local state. Instead of recalculating everything, each step updates only the affected aggregates and forwards those updates downstream.

The result is a nested, immutable state tree that is always ready to render.

## When to Use aggregator-toy

aggregator-toy excels in scenarios like:

- **Dashboards** - Real-time metrics that update as data streams in
- **Leaderboards** - Rankings that change as votes, scores, or points arrive
- **Live Analytics** - Aggregations over sliding windows or grouped data
- **Streaming UIs** - Any interface that needs to reflect live data changes

## How It Works

```typescript
import { createPipeline } from "aggregator-toy";

// 1. Define your input type
interface Sale {
  category: string;
  product: string;
  price: number;
}

// 2. Build a pipeline
const builder = createPipeline<Sale>()
  .groupBy(["category"], "items")
  .sum("items", "price", "totalRevenue");

// 3. Connect state management
const typeDescriptor = builder.getTypeDescriptor();
let state = [];
const pipeline = builder.build(s => { state = s(state); }, typeDescriptor);

// 4. Feed data
pipeline.add("sale1", { category: "Electronics", product: "Phone", price: 500 });
pipeline.add("sale2", { category: "Electronics", product: "Laptop", price: 1200 });

// state now has grouped, aggregated data ready for your UI
```

## Next Steps

- [Core Concepts](/guide/core-concepts) - Understand the building blocks
- [Getting Started](/guide/getting-started) - Install and run your first pipeline
- [Vote Leaderboard](/guide/vote-leaderboard) - A complete worked example
