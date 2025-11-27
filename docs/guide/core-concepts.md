# Core Concepts

## Pipelines

A pipeline starts with a single record type:

```typescript
const pipeline = createPipeline<Vote>();
```

Each method call adds a step. Steps are executed in order, and each step can emit its own events (add/remove/modify) that later steps react to.

## Group-by

`groupBy` creates arrays keyed by some property or computed key:

```typescript
.groupBy(["candidateId"], "byCandidate")
```

This produces something like:

```typescript
state.byCandidate === [
  { key: "X", value: { candidateId: "X", items: [...] } },
  { key: "Y", value: { candidateId: "Y", items: [...] } }
];
```

Groups update incrementally. Adding a record only touches the group it belongs to.

## Scoped Operations

`.in("byCandidate")` narrows the focus to a particular array. Inside that scope, you can add other steps (aggregates, pickBy, etc.) that work on the items in each group. When you exit the scope, later steps see the enriched group value.

```typescript
.groupBy(["category"], "items")
.in("items").sum("products", "price", "totalPrice")
// Now each category has a totalPrice property
```

## Aggregates

Commutative aggregates like `sum` and `count` use small functions that know how to add and subtract a single item's contribution. The library stores per-parent aggregate state in maps keyed by the path. Adding an item updates the aggregate once. Removing it subtracts its contribution.

This is how the library trades memory for time: each parent keeps its own aggregate value and item snapshot so future updates stay O(1) for that parent.

### Built-in Aggregates

| Method | Description |
|--------|-------------|
| `sum` | Sum a numeric property |
| `count` | Count items in an array |
| `min` | Track minimum value |
| `max` | Track maximum value |
| `average` | Compute running average |
| `pickByMin` | Select item with smallest value |
| `pickByMax` | Select item with largest value |

## State Shape

The state is always a tree of "keyed arrays" and objects. It is immutable at the top level: each update returns new arrays and shallow copies of objects. This works well with React, Svelte, or any UI framework that relies on reference changes.

```typescript
type KeyedArray<T> = { key: string; value: T }[];
```

## Event Flow

Each step in the pipeline:

1. Listens for `onAdded`, `onRemoved`, and `onModified` events from the previous step
2. Updates its internal state
3. Emits its own events for downstream steps

This creates an efficient change propagation system where only affected paths are updated.
