# dropProperty

Removes a property from each item.

## Signature

```typescript
dropProperty<K extends keyof CurrentItem>(
  propertyName: K
): PipelineBuilder</* type with K removed */>
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `propertyName` | `string` | Name of the property to remove |

## Returns

A new `PipelineBuilder` with the property removed from items.

## Example

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;  // sensitive
}

const builder = createPipeline<User>()
  .dropProperty("passwordHash");
```

**Result:**
```typescript
{
  id: "u1",
  name: "John",
  email: "john@example.com"
  // passwordHash is removed
}
```

## Use Cases

- **Removing sensitive data** - Passwords, tokens
- **Cleaning up temporary fields** - Intermediate computations
- **Reducing state size** - Drop fields not needed for display

## Scoped Usage

Drop properties at nested levels:

```typescript
const builder = createPipeline<Order>()
  .groupBy(["category"], "categories")
  .in("categories").dropProperty("internalId");
```

## See Also

- [defineProperty](/api/define-property) - Add computed properties
