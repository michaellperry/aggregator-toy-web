# State Shape

Understanding the state shape is key to working effectively with aggregator-toy.

## KeyedArray

The fundamental data structure is the `KeyedArray`:

```typescript
type KeyedArray<T> = { key: string; value: T }[];
```

Each item in the array has:
- `key` - A unique identifier (typically a hash of the grouping keys)
- `value` - The actual data object

## Why KeyedArray?

This structure provides:

1. **Efficient lookups** - Find items by key without scanning
2. **Stable identity** - Keys don't change when values update
3. **Framework compatibility** - Works with React keys, Vue track-by, etc.
4. **Immutable updates** - Easy to replace specific items

## Nested Structure

After multiple `groupBy` operations, you get a nested tree:

```typescript
// After: .groupBy(["state"], "states").in("states").groupBy(["city"], "cities")

[
  {
    key: "hash_TX",
    value: {
      state: "TX",
      cities: [
        { key: "hash_Dallas", value: { city: "Dallas", items: [...] } },
        { key: "hash_Houston", value: { city: "Houston", items: [...] } }
      ]
    }
  },
  {
    key: "hash_CA",
    value: {
      state: "CA",
      cities: [
        { key: "hash_LA", value: { city: "Los Angeles", items: [...] } }
      ]
    }
  }
]
```

## Aggregate Properties

Aggregates add properties to parent objects:

```typescript
// After: .sum("items", "price", "totalRevenue")

{
  key: "hash_Electronics",
  value: {
    category: "Electronics",
    totalRevenue: 1700,  // Added by sum step
    items: [...]
  }
}
```

## Immutability

The state tree is immutable at the top level:
- Adding an item creates new arrays along the affected path
- Unaffected branches keep their references
- This enables efficient React reconciliation

```typescript
// Before update
const oldState = state;

// After adding an item to Electronics
const newState = state;

// Only affected paths changed
oldState !== newState;  // true - new top array
oldState[0] !== newState[0];  // true - Electronics changed
oldState[1] === newState[1];  // true - Clothing unchanged
```
