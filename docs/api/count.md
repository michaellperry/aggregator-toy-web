# count

Counts items in a nested array.

## Signature

```typescript
count<ArrayName extends string, TPropName extends string>(
  arrayName: ArrayName,
  outputProperty: TPropName
): PipelineBuilder</* type with outputProperty: number */>
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `arrayName` | `string` | Name of the array to count |
| `outputProperty` | `string` | Name of the new count property |

## Returns

A new `PipelineBuilder` with the count property added to the parent type.

## Example

```typescript
const builder = createPipeline<Sale>()
  .groupBy(["category"], "items")
  .count("items", "itemCount");
```

**Result:**
```typescript
{
  key: "hash_Electronics",
  value: {
    category: "Electronics",
    itemCount: 3,  // number of items in the array
    items: [...]
  }
}
```

## Incremental Updates

- **Add:** `count = count + 1`
- **Remove:** `count = count - 1`

Both operations are O(1).

## With Scoping

```typescript
.groupBy(["region"], "regions")
.in("regions").groupBy(["city"], "cities")
.in("regions", "cities").count("items", "venueCount")
.in("regions").count("cities", "cityCount")
```

## See Also

- [sum](/api/sum) - Sum numeric values
- [average](/api/average) - Compute average
