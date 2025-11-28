# Getting Started

## Installation

```bash
npm install aggregator-toy
# or
pnpm add aggregator-toy
# or
yarn add aggregator-toy
```

## Your First Pipeline

Let's build a simple pipeline that groups sales by category and sums the prices.

### 1. Define Your Data Type

```typescript
interface Sale {
  category: string;
  product: string;
  price: number;
}
```

### 2. Create the Pipeline

```typescript
import { createPipeline } from "aggregator-toy";

const builder = createPipeline<Sale>()
  .groupBy(["category"], "items")
  .sum("items", "price", "totalRevenue");
```

### 3. Connect State Management

```typescript
// Get the type descriptor
const typeDescriptor = builder.getTypeDescriptor();

// Create state storage
let state = [];

// Build the pipeline with a state updater
const pipeline = builder.build(
  transform => { state = transform(state); },
  typeDescriptor
);
```

### 4. Add Data

```typescript
pipeline.add("sale1", { category: "Electronics", product: "Phone", price: 500 });
pipeline.add("sale2", { category: "Electronics", product: "Laptop", price: 1200 });
pipeline.add("sale3", { category: "Clothing", product: "Shirt", price: 50 });

console.log(state);
// [
//   { key: "hash1", value: { category: "Electronics", totalRevenue: 1700, items: [...] } },
//   { key: "hash2", value: { category: "Clothing", totalRevenue: 50, items: [...] } }
// ]
```

### 5. Remove Data

```typescript
pipeline.remove("sale1");

console.log(state);
// [
//   { key: "hash1", value: { category: "Electronics", totalRevenue: 1200, items: [...] } },
//   { key: "hash2", value: { category: "Clothing", totalRevenue: 50, items: [...] } }
// ]
```

## Using with React

```tsx
import { useState, useEffect } from "react";
import { createPipeline } from "aggregator-toy";

function usePipeline() {
  const [state, setState] = useState([]);
  const [pipeline] = useState(() => {
    const builder = createPipeline<Sale>()
      .groupBy(["category"], "items")
      .sum("items", "price", "totalRevenue");
    
    const typeDescriptor = builder.getTypeDescriptor();
    return builder.build(
      transform => setState(s => transform(s)),
      typeDescriptor
    );
  });

  return { state, pipeline };
}

function Dashboard() {
  const { state, pipeline } = usePipeline();

  return (
    <ul>
      {state.map(category => (
        <li key={category.key}>
          {category.value.category}: ${category.value.totalRevenue}
        </li>
      ))}
    </ul>
  );
}
```

## Next Steps

- [Core Concepts](/guide/core-concepts) - Understand how pipelines work
- [Vote Leaderboard](/guide/vote-leaderboard) - A more complex example
- [API Reference](/api/) - Complete API documentation
