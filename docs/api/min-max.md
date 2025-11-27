# min / max

Track the minimum or maximum value of a property within an array.

## Signature

```typescript
min<ArrayName extends string, TPropName extends string>(
  arrayName: ArrayName,
  propertyName: keyof ArrayItem & string,
  outputProperty: TPropName
): PipelineBuilder</* type with outputProperty: number | undefined */>

max<ArrayName extends string, TPropName extends string>(
  arrayName: ArrayName,
  propertyName: keyof ArrayItem & string,
  outputProperty: TPropName
): PipelineBuilder</* type with outputProperty: number | undefined */>
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `arrayName` | `string` | Name of the array to search |
| `propertyName` | `string` | Name of the property to compare |
| `outputProperty` | `string` | Name of the new min/max property |

## Returns

A new `PipelineBuilder` with the min/max property added. Returns `undefined` for empty arrays.

## Example

```typescript
const builder = createPipeline<Product>()
  .groupBy(["category"], "items")
  .min("items", "price", "lowestPrice")
  .max("items", "price", "highestPrice");
```

**Result:**
```typescript
{
  key: "hash_Electronics",
  value: {
    category: "Electronics",
    lowestPrice: 299,
    highestPrice: 1499,
    items: [...]
  }
}
```

## Update Behavior

**Add:**
- If new value < current min → update min
- If new value > current max → update max
- O(1) operation

**Remove:**
- If removed value was the min/max → rescan all items
- O(n) operation in worst case

::: tip
If you only add items (never remove), min/max operations are always O(1).
:::

## Handling Edge Cases

- **Empty array:** Returns `undefined`
- **Null/undefined values:** Ignored in comparison
- **Single item:** That item's value is both min and max

## See Also

- [pickByMin / pickByMax](/api/pick-by) - Get the entire item, not just the value
- [average](/api/average) - Compute average
