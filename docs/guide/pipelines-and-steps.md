# Pipelines and Steps

This page describes the main steps available in aggregator-toy.

## groupBy

Groups records by one or more keys and emits arrays of `{ key, value }`.

```typescript
.groupBy(["category", "region"], "items")
```

**Input:** Flat records with the specified key properties  
**Output:** Nested structure with items grouped by unique key combinations

## sum

Adds a numeric aggregate to each parent based on an array of children.

```typescript
.sum("items", "price", "totalPrice")
```

**Input:** Array of items with a numeric property  
**Output:** Parent enriched with sum property

## count

Counts items in an array.

```typescript
.count("items", "itemCount")
```

**Input:** Array of items  
**Output:** Parent enriched with count property

## min / max

Track the minimum or maximum value of a property within an array. These steps handle removals by recomputing from the stored items when needed.

```typescript
.min("items", "price", "lowestPrice")
.max("items", "price", "highestPrice")
```

**Input:** Array of items with comparable property  
**Output:** Parent enriched with min/max property

## average

Tracks sum and count internally and exposes a single property.

```typescript
.average("items", "price", "avgPrice")
```

**Input:** Array of items with numeric property  
**Output:** Parent enriched with average property

## pickByMin / pickByMax

Select the item with the smallest or largest property within a group and expose it as a property. This powers "latest vote by timestamp", "highest-priority job", or "lowest price in category" scenarios.

```typescript
.pickByMax("items", "timestamp", "latestItem")
.pickByMin("items", "priority", "highestPriority")
```

**Input:** Array of items with comparable property  
**Output:** Parent enriched with selected item reference

## commutativeAggregate

Create custom aggregates with add and subtract operators.

```typescript
.commutativeAggregate(
  "items",
  "customMetric",
  (acc, item) => (acc ?? 0) + item.value * item.weight,
  (acc, item) => acc - item.value * item.weight
)
```

**Input:** Array of items  
**Output:** Parent enriched with custom aggregate property

## in (scoping)

Creates a scoped builder that applies operations at the specified path depth.

```typescript
.in("cities").sum("venues", "capacity", "totalCapacity")
```

## defineProperty

Defines a computed property on each item.

```typescript
.defineProperty("fullName", item => `${item.firstName} ${item.lastName}`)
```

## dropProperty

Removes a property from each item.

```typescript
.dropProperty("temporaryField")
```
