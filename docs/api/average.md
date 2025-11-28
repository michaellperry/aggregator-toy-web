# average

Computes the average of a numeric property over items in a nested array.

## Signature

```typescript
average<ArrayName extends string, TPropName extends string>(
  arrayName: ArrayName,
  propertyName: keyof ArrayItem & string,
  outputProperty: TPropName
): PipelineBuilder</* type with outputProperty: number | undefined */>
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `arrayName` | `string` | Name of the array to average |
| `propertyName` | `string` | Name of the numeric property |
| `outputProperty` | `string` | Name of the new average property |

## Returns

A new `PipelineBuilder` with the average property added. Returns `undefined` for empty arrays.

## Example

```typescript
const builder = createPipeline<Review>()
  .groupBy(["productId"], "reviews")
  .average("reviews", "rating", "avgRating");
```

**Result:**
```typescript
{
  key: "hash_product123",
  value: {
    productId: "product123",
    avgRating: 4.2,  // average of all ratings
    reviews: [...]
  }
}
```

## How It Works

Internally tracks both sum and count:

```
average = sum / count
```

## Incremental Updates

- **Add:** 
  - `sum = sum + newValue`
  - `count = count + 1`
  - `average = sum / count`

- **Remove:**
  - `sum = sum - removedValue`
  - `count = count - 1`
  - `average = sum / count` (or `undefined` if count = 0)

Both operations are O(1).

## Handling Edge Cases

- **Empty array:** Returns `undefined`
- **Null/undefined values:** Excluded from calculation
- **Single item:** Average equals that item's value

## See Also

- [sum](/api/sum) - Sum values
- [count](/api/count) - Count items
