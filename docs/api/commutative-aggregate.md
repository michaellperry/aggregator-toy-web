# commutativeAggregate

Create a custom aggregate with add and subtract operators for incremental updates.

## Signature

```typescript
commutativeAggregate<ArrayName extends string, PropName extends string, TAggregate>(
  arrayName: ArrayName,
  propertyName: PropName,
  add: (acc: TAggregate | undefined, item: ArrayItem) => TAggregate,
  subtract: (acc: TAggregate, item: ArrayItem) => TAggregate
): PipelineBuilder</* type with propertyName: TAggregate */>
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `arrayName` | `string` | Name of the array to aggregate |
| `propertyName` | `string` | Name of the new aggregate property |
| `add` | `function` | Called when an item is added |
| `subtract` | `function` | Called when an item is removed |

## Returns

A new `PipelineBuilder` with the custom aggregate property added.

## The Add Operator

Called when an item is added to the array:

```typescript
(currentAggregate: TAggregate | undefined, item: ArrayItem) => TAggregate
```

- `currentAggregate` is `undefined` for the first item
- Return the new aggregate value

## The Subtract Operator

Called when an item is removed from the array:

```typescript
(currentAggregate: TAggregate, item: ArrayItem) => TAggregate
```

- `currentAggregate` is never `undefined` (item must exist to be removed)
- Return the new aggregate value

## Example: Weighted Sum

```typescript
const builder = createPipeline<Order>()
  .groupBy(["customerId"], "orders")
  .commutativeAggregate(
    "orders",
    "weightedTotal",
    (acc, order) => (acc ?? 0) + order.quantity * order.unitPrice,
    (acc, order) => acc - order.quantity * order.unitPrice
  );
```

## Example: Set of Unique Values

```typescript
const builder = createPipeline<Event>()
  .groupBy(["category"], "events")
  .commutativeAggregate(
    "events",
    "uniqueUsers",
    (acc, event) => {
      const set = new Set(acc ?? []);
      set.add(event.userId);
      return Array.from(set);
    },
    (acc, event) => {
      // Note: This is a simplified example
      // True set subtraction requires tracking counts
      return acc.filter(id => id !== event.userId);
    }
  );
```

## Example: Complex Object

```typescript
interface Stats {
  total: number;
  count: number;
  min: number;
  max: number;
}

const builder = createPipeline<Sale>()
  .groupBy(["region"], "sales")
  .commutativeAggregate<"sales", "stats", Stats>(
    "sales",
    "stats",
    (acc, sale) => ({
      total: (acc?.total ?? 0) + sale.amount,
      count: (acc?.count ?? 0) + 1,
      min: Math.min(acc?.min ?? Infinity, sale.amount),
      max: Math.max(acc?.max ?? -Infinity, sale.amount)
    }),
    (acc, sale) => ({
      total: acc.total - sale.amount,
      count: acc.count - 1,
      // Note: min/max can't be efficiently subtracted
      // You'd need to rescan for accurate values
      min: acc.min,
      max: acc.max
    })
  );
```

## When to Use

Use `commutativeAggregate` when:
- Built-in aggregates don't fit your needs
- You need custom combination logic
- You're computing derived values from multiple properties

## Limitations

- The subtract operator must be the inverse of add
- Some operations (like min/max) can't be efficiently subtracted
- For non-commutative operations, consider alternative approaches

## See Also

- [sum](/api/sum) - Built-in sum aggregate
- [count](/api/count) - Built-in count aggregate
