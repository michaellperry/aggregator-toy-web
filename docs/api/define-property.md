# defineProperty

Defines a computed property on each item.

## Signature

```typescript
defineProperty<K extends string, U>(
  propertyName: K,
  compute: (item: CurrentItem) => U
): PipelineBuilder</* type with K: U added */>
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `propertyName` | `string` | Name of the new property |
| `compute` | `function` | Function to compute the property value |

## Returns

A new `PipelineBuilder` with the computed property added to items.

## Example

```typescript
interface Person {
  firstName: string;
  lastName: string;
  birthYear: number;
}

const builder = createPipeline<Person>()
  .defineProperty("fullName", p => `${p.firstName} ${p.lastName}`)
  .defineProperty("age", p => new Date().getFullYear() - p.birthYear);
```

**Result:**
```typescript
{
  firstName: "John",
  lastName: "Doe",
  birthYear: 1990,
  fullName: "John Doe",  // computed
  age: 34                // computed
}
```

## Use Cases

- **Concatenating fields** - Full names, addresses
- **Computing derived values** - Age from birth year, duration from timestamps
- **Formatting** - Currency strings, date formats
- **Categorization** - Bucket values into ranges

## With Grouping

Use before `groupBy` to create custom grouping keys:

```typescript
const builder = createPipeline<Event>()
  .defineProperty("hourBucket", e => Math.floor(e.timestamp / 3600000))
  .groupBy(["hourBucket"], "byHour");
```

## Scoped Usage

Add computed properties at nested levels:

```typescript
const builder = createPipeline<Order>()
  .groupBy(["category"], "categories")
  .in("categories").defineProperty(
    "itemTotal", 
    item => item.quantity * item.unitPrice
  );
```

## See Also

- [dropProperty](/api/drop-property) - Remove properties
