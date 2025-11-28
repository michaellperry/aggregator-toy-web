# createPipeline

Creates a new pipeline builder for the specified input type.

## Signature

```typescript
function createPipeline<T extends {}>(): PipelineBuilder<T, T, []>
```

## Type Parameters

| Parameter | Description |
|-----------|-------------|
| `T` | The input record type |

## Returns

A `PipelineBuilder` instance that can be used to add steps and build the final pipeline.

## Example

```typescript
import { createPipeline } from "aggregator-toy";

interface Sale {
  category: string;
  product: string;
  price: number;
}

const builder = createPipeline<Sale>();
```

## Building the Pipeline

After adding steps, call `build()` to create the pipeline:

```typescript
const builder = createPipeline<Sale>()
  .groupBy(["category"], "items")
  .sum("items", "price", "total");

const typeDescriptor = builder.getTypeDescriptor();
let state = [];

const pipeline = builder.build(
  transform => { state = transform(state); },
  typeDescriptor
);

// Now you can add/remove items
pipeline.add("sale1", { category: "Electronics", product: "Phone", price: 500 });
pipeline.remove("sale1");
```

## See Also

- [Getting Started](/guide/getting-started)
- [groupBy](/api/group-by)
