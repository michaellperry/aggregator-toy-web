# pickByMin / pickByMax

Select the item with the smallest or largest property value within a group.

## Signature

```typescript
pickByMin<ArrayName extends string, TPropName extends string>(
  arrayName: ArrayName,
  propertyName: keyof ArrayItem & string,
  outputProperty: TPropName
): PipelineBuilder</* type with outputProperty: ArrayItem | undefined */>

pickByMax<ArrayName extends string, TPropName extends string>(
  arrayName: ArrayName,
  propertyName: keyof ArrayItem & string,
  outputProperty: TPropName
): PipelineBuilder</* type with outputProperty: ArrayItem | undefined */>
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `arrayName` | `string` | Name of the array to search |
| `propertyName` | `string` | Name of the property to compare |
| `outputProperty` | `string` | Name of the property to hold the selected item |

## Returns

A new `PipelineBuilder` with the selected item property added. Returns `undefined` for empty arrays.

## Example: Latest Vote

Select the most recent vote by timestamp:

```typescript
const builder = createPipeline<Vote>()
  .groupBy(["voterId", "candidateId"], "votes")
  .in("votes").pickByMax("items", "timestamp", "latestVote");
```

**Result:**
```typescript
{
  key: "hash_Alice_X",
  value: {
    voterId: "Alice",
    candidateId: "X",
    latestVote: {
      voterId: "Alice",
      candidateId: "X",
      points: 8,
      timestamp: 1699999999  // the highest timestamp
    },
    items: [...]
  }
}
```

## Example: Cheapest Product

Select the cheapest product in each category:

```typescript
const builder = createPipeline<Product>()
  .groupBy(["category"], "products")
  .pickByMin("products", "price", "cheapestProduct");
```

## Use Cases

- **Latest by timestamp** - `pickByMax("items", "timestamp", "latest")`
- **Highest priority** - `pickByMin("items", "priority", "topPriority")` (if lower = higher priority)
- **Best rated** - `pickByMax("items", "rating", "topRated")`
- **Cheapest** - `pickByMin("items", "price", "cheapest")`

## Update Behavior

**Add:**
- Compare new item to current pick
- Update if new item wins
- O(1) operation

**Remove:**
- If removed item was the pick → rescan all items
- O(n) operation in worst case

## Comparison Types

Supports both numeric and string comparisons:

```typescript
// Numeric comparison
.pickByMax("items", "score", "highestScore")

// String comparison (lexicographic)
.pickByMin("items", "name", "firstAlphabetically")
```

## See Also

- [min / max](/api/min-max) - Get just the value, not the entire item
