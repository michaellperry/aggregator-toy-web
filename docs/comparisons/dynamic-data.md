# aggregator-toy vs DynamicData

[DynamicData](https://github.com/reactivemarbles/DynamicData) is a .NET library for reactive collections. It's probably the closest conceptual cousin to aggregator-toy in the .NET ecosystem.

## Key Similarities

Both libraries share core ideas:

- **Incremental updates** - Only affected items are reprocessed
- **Per-group state** - Aggregates maintained per group
- **Composable operators** - Chain operations together
- **Reactive model** - Changes propagate through the pipeline

## Key Differences

| Aspect | aggregator-toy | DynamicData |
|--------|----------------|-------------|
| **Ecosystem** | JavaScript/TypeScript | .NET |
| **Scope** | Focused on aggregations | Broad collection toolbox |
| **State shape** | Nested KeyedArrays | Various cache types |
| **API style** | Pipeline DSL | Fluent observables |

## DynamicData Example

```csharp
using DynamicData;
using DynamicData.Aggregation;

var sourceCache = new SourceCache<Vote, string>(v => v.Id);

var subscription = sourceCache.Connect()
    .Group(v => v.CandidateId)
    .Transform(group => new
    {
        CandidateId = group.Key,
        TotalPoints = group.Cache.Items.Sum(v => v.Points)
    })
    .Bind(out var candidates)
    .Subscribe();

// Add votes
sourceCache.AddOrUpdate(new Vote { Id = "1", CandidateId = "X", Points = 3 });
sourceCache.AddOrUpdate(new Vote { Id = "2", CandidateId = "X", Points = 5 });

// candidates is now a bound collection with live updates
```

## aggregator-toy Equivalent

```typescript
import { createPipeline } from "aggregator-toy";

const builder = createPipeline<Vote>()
  .groupBy(["candidateId"], "byCandidate")
  .sum("byCandidate", "points", "totalPoints");

let state = [];
const pipeline = builder.build(s => { state = s(state); }, builder.getTypeDescriptor());

pipeline.add("1", { candidateId: "X", points: 3 });
pipeline.add("2", { candidateId: "X", points: 5 });
```

## Handling "Latest Vote" in DynamicData

```csharp
var subscription = sourceCache.Connect()
    .Group(v => (v.VoterId, v.CandidateId))
    .Transform(group => 
        group.Cache.Items.OrderByDescending(v => v.Timestamp).First())
    .Group(v => v.CandidateId)
    .Transform(group => new
    {
        CandidateId = group.Key,
        TotalPoints = group.Cache.Items.Sum(v => v.Points)
    })
    .Bind(out var leaderboard)
    .Subscribe();
```

## aggregator-toy Equivalent

```typescript
const builder = createPipeline<Vote>()
  .groupBy(["voterId", "candidateId"], "votes")
  .in("votes").pickByMax("items", "timestamp", "latestVote")
  .groupBy(["candidateId"], "byCandidate")
  .in("byCandidate").sum("items", "points", "totalPoints");
```

## When to Use DynamicData

- **.NET projects** - Native ecosystem integration
- **WPF/Blazor UIs** - Direct binding to UI controls
- **Broad collection operations** - Filtering, sorting, paging
- **Complex reactive flows** - Full Rx.NET integration

## When to Use aggregator-toy

- **JavaScript/TypeScript projects** - Native ecosystem
- **React/Vue/Svelte UIs** - KeyedArray maps to component lists
- **Focused on aggregations** - Less to learn for this use case
- **Specific state shape** - Nested structure optimized for UIs

## Philosophical Difference

**DynamicData** is a broad toolbox for reactive collections. It can do many things: filtering, sorting, paging, grouping, aggregation.

**aggregator-toy** is a focused DSL for building aggregation pipelines. It has a specific state shape (nested KeyedArrays) that maps directly to UI components.

If you're in the .NET ecosystem, DynamicData is the natural choice. If you're in JavaScript/TypeScript and primarily need grouped aggregations, aggregator-toy offers a simpler, more focused API.
