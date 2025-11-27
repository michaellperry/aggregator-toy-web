# sum

Sums a numeric property over items in a nested array.

## Signature

```typescript
sum<ArrayName extends string, TPropName extends string>(
  arrayName: ArrayName,
  propertyName: keyof ArrayItem & string,
  outputProperty: TPropName
): PipelineBuilder</* type with outputProperty: number */>
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `arrayName` | `string` | Name of the array to aggregate |
| `propertyName` | `string` | Name of the numeric property to sum |
| `outputProperty` | `string` | Name of the new sum property |

## Returns

A new `PipelineBuilder` with the sum property added to the parent type.

## Example

```typescript
const builder = createPipeline<Sale>()
  .groupBy(["category"], "items")
  .sum("items", "price", "totalRevenue");
```

**Result:**
```typescript
{
  key: "hash_Electronics",
  value: {
    category: "Electronics",
    totalRevenue: 1700,  // sum of all prices in items
    items: [...]
  }
}
```

## Handling Edge Cases

- **Null/undefined values:** Treated as 0
- **Empty array:** Returns 0
- **Non-numeric values:** Converted via `Number()`

## Incremental Updates

- **Add:** `total = total + newItem.property`
- **Remove:** `total = total - removedItem.property`

Both operations are O(1).

## With Scoping

Use `in()` to sum at nested levels:

```typescript
.groupBy(["region"], "regions")
.in("regions").groupBy(["city"], "cities")
.in("regions", "cities").sum("items", "revenue", "cityRevenue")
.in("regions").sum("cities", "cityRevenue", "regionRevenue")
```

## See Also

- [count](/api/count) - Count items
- [average](/api/average) - Compute average
- [commutativeAggregate](/api/commutative-aggregate) - Custom aggregates
