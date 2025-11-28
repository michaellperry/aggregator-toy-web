# API Reference

This section documents all public functions and types in aggregator-toy.

## Pipeline Creation

- [createPipeline](/api/create-pipeline) - Create a new pipeline builder

## Pipeline Methods

### Grouping
- [groupBy](/api/group-by) - Group items by key properties

### Aggregates
- [sum](/api/sum) - Sum a numeric property
- [count](/api/count) - Count items
- [min / max](/api/min-max) - Track minimum/maximum values
- [average](/api/average) - Compute running average
- [pickByMin / pickByMax](/api/pick-by) - Select item by min/max value
- [commutativeAggregate](/api/commutative-aggregate) - Custom aggregate

### Scoping
- [in](/api/in) - Scope operations to nested paths

### Property Management
- [defineProperty](/api/define-property) - Add computed properties
- [dropProperty](/api/drop-property) - Remove properties

## Types

### KeyedArray

```typescript
type KeyedArray<T> = { key: string; value: T }[];
```

The fundamental data structure for grouped data.

### Pipeline

```typescript
interface Pipeline<T> {
  add(key: string, item: T): void;
  remove(key: string): void;
}
```

The built pipeline interface for adding and removing items.

### TypeDescriptor

```typescript
interface TypeDescriptor {
  arrays: ArrayDescriptor[];
}

interface ArrayDescriptor {
  name: string;
  type: TypeDescriptor;
}
```

Describes the nested structure of the pipeline output.
