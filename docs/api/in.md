# in (scoping)

Creates a scoped builder that applies operations at the specified path depth.

## Signature

```typescript
in<PathSegments extends string[]>(
  ...pathSegments: PathSegments
): PipelineBuilder</* scoped type */>
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `pathSegments` | `...string[]` | One or more path segments to navigate into |

## Returns

A new `PipelineBuilder` scoped to the specified path.

## Example

Apply operations inside a grouped array:

```typescript
const builder = createPipeline<Sale>()
  .groupBy(["category"], "items")
  .in("items").sum("products", "price", "totalPrice");
```

## Deep Nesting

Navigate multiple levels:

```typescript
const builder = createPipeline<Venue>()
  .groupBy(["region"], "regions")
  .in("regions").groupBy(["city"], "cities")
  .in("regions", "cities").count("venues", "venueCount");
```

Or chain `.in()` calls:

```typescript
const builder = createPipeline<Venue>()
  .groupBy(["region"], "regions")
  .in("regions").groupBy(["city"], "cities")
  .in("regions").in("cities").count("venues", "venueCount");
```

## How It Works

1. The `in()` method sets a scope path
2. Subsequent operations apply at that path
3. The type system tracks the current scope

## Full Example

```typescript
interface Order {
  region: string;
  city: string;
  product: string;
  quantity: number;
  price: number;
}

const builder = createPipeline<Order>()
  // Level 1: Group by region
  .groupBy(["region"], "byRegion")
  
  // Level 2: Within each region, group by city
  .in("byRegion").groupBy(["city"], "cities")
  
  // Aggregates at city level
  .in("byRegion", "cities").sum("items", "price", "cityRevenue")
  .in("byRegion", "cities").count("items", "orderCount")
  
  // Aggregates at region level
  .in("byRegion").sum("cities", "cityRevenue", "regionRevenue")
  .in("byRegion").count("cities", "cityCount");
```

**Result structure:**
```typescript
{
  byRegion: [
    {
      key: "hash_West",
      value: {
        region: "West",
        regionRevenue: 50000,
        cityCount: 3,
        cities: [
          {
            key: "hash_Seattle",
            value: {
              city: "Seattle",
              cityRevenue: 20000,
              orderCount: 150,
              items: [...]
            }
          }
          // more cities...
        ]
      }
    }
    // more regions...
  ]
}
```

## See Also

- [groupBy](/api/group-by) - Create nested arrays
- [Multi-level Grouping](/guide/multi-level-grouping) - Guide
