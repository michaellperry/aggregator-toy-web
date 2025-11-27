# groupBy

Creates a new keyed array property on the current scope. Each item from the upstream step is assigned to a group based on the selected key(s).

## Signature

```typescript
groupBy<K extends keyof T, ArrayName extends string>(
  keyProperties: K[],
  arrayName: ArrayName
): PipelineBuilder</* transformed type */>
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `keyProperties` | `K[]` | Array of property names to group by |
| `arrayName` | `string` | Name of the array property to create |

## Returns

A new `PipelineBuilder` with the grouped type structure.

## How It Works

For each distinct key combination, a group object is created containing:
- The key properties as direct properties
- An `items` array holding the non-key properties of items in that group

## Example

```typescript
interface Sale {
  category: string;
  region: string;
  product: string;
  price: number;
}

const builder = createPipeline<Sale>()
  .groupBy(["category"], "byCategory");
```

**Input items:**
```typescript
{ category: "Electronics", region: "North", product: "Phone", price: 500 }
{ category: "Electronics", region: "South", product: "Laptop", price: 1200 }
{ category: "Clothing", region: "North", product: "Shirt", price: 50 }
```

**Output structure:**
```typescript
[
  {
    key: "hash_Electronics",
    value: {
      category: "Electronics",
      items: [
        { key: "k1", value: { region: "North", product: "Phone", price: 500 } },
        { key: "k2", value: { region: "South", product: "Laptop", price: 1200 } }
      ]
    }
  },
  {
    key: "hash_Clothing",
    value: {
      category: "Clothing",
      items: [
        { key: "k3", value: { region: "North", product: "Shirt", price: 50 } }
      ]
    }
  }
]
```

## Multiple Keys

Group by multiple properties:

```typescript
.groupBy(["category", "region"], "byLocation")
```

This creates groups for each unique (category, region) combination.

## Incremental Updates

When an item is added:
1. The key is computed from the key properties
2. If a group exists, the item is added to its `items` array
3. If no group exists, a new group is created

When an item is removed:
1. The item is removed from its group's `items` array
2. If the group becomes empty, it is removed

## See Also

- [in](/api/in) - Scope operations to grouped arrays
- [sum](/api/sum) - Aggregate grouped items
