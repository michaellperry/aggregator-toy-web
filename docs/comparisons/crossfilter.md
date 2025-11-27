# aggregator-toy vs Crossfilter

[Crossfilter](https://crossfilter.github.io/crossfilter/) is a JavaScript library for exploring large multivariate datasets in the browser. It was designed for interactive data visualization and cross-filtering.

## Key Differences

| Aspect | aggregator-toy | Crossfilter |
|--------|----------------|-------------|
| **Primary focus** | Streaming aggregations | Multi-dimensional filtering |
| **TypeScript** | Full support | Limited |
| **State shape** | Nested KeyedArrays | Flat groups/dimensions |
| **Use case** | Live data feeds | Data exploration |
| **Removals** | Full support | Full support |

## The Vote Leaderboard in Crossfilter

```javascript
const crossfilter = require('crossfilter2');

// Create crossfilter with votes
const cf = crossfilter([]);

// Create dimensions
const voterCandidateDim = cf.dimension(d => `${d.voterId}|${d.candidateId}`);
const candidateDim = cf.dimension(d => d.candidateId);

// This is where it gets tricky...
// Crossfilter doesn't have built-in "pick latest by timestamp"
// You need custom reduce functions

const candidateGroup = candidateDim.group().reduce(
  // add
  (p, v) => {
    const key = `${v.voterId}|${v.candidateId}`;
    if (!p.latestByVoter[key] || v.timestamp > p.latestByVoter[key].timestamp) {
      if (p.latestByVoter[key]) {
        p.total -= p.latestByVoter[key].points;
      }
      p.latestByVoter[key] = v;
      p.total += v.points;
    }
    return p;
  },
  // remove
  (p, v) => {
    const key = `${v.voterId}|${v.candidateId}`;
    // Complex: need to track all votes to find new latest
    // Simplified version (may not be correct on removal):
    if (p.latestByVoter[key]?.id === v.id) {
      p.total -= v.points;
      delete p.latestByVoter[key];
    }
    return p;
  },
  // initial
  () => ({ total: 0, latestByVoter: {} })
);

// Add votes
cf.add([
  { id: '1', voterId: 'A', candidateId: 'X', points: 3, timestamp: 1 },
  { id: '2', voterId: 'B', candidateId: 'X', points: 5, timestamp: 1 },
  { id: '3', voterId: 'A', candidateId: 'X', points: 8, timestamp: 2 }
]);

// Get results
console.log(candidateGroup.all());
```

## The Same in aggregator-toy

```typescript
import { createPipeline } from "aggregator-toy";

const builder = createPipeline<Vote>()
  .groupBy(["voterId", "candidateId"], "votes")
  .in("votes").pickByMax("items", "timestamp", "latestVote")
  .groupBy(["candidateId"], "byCandidate")
  .in("byCandidate").sum("items", "points", "totalPoints");
```

## When to Use Crossfilter

- **Cross-filtering dashboards** - Click a chart to filter others
- **Multi-dimensional exploration** - Filter by date, category, value simultaneously
- **dc.js integration** - Built for the dc.js charting library
- **Large static datasets** - Optimized for exploring existing data

## When to Use aggregator-toy

- **Live streaming data** - Updates arrive continuously
- **TypeScript projects** - Full type inference
- **Simpler aggregation logic** - Built-in steps vs custom reducers
- **Nested output structure** - Maps naturally to UI components
- **"Pick by" operations** - Latest vote, highest priority, etc.

## Complexity Comparison

The "latest vote wins" logic shows the key difference:

**Crossfilter:** Requires custom reduce functions that track state across adds/removes. The "remove" function is especially tricky when you need to find a new "latest" after removing the current one.

**aggregator-toy:** Built-in `pickByMax("items", "timestamp", "latestVote")` handles this automatically, including correct behavior on removals.

## Summary

Crossfilter excels at interactive data exploration with cross-filtering. aggregator-toy excels at building live aggregation pipelines where the aggregation logic (especially things like "pick latest by timestamp") is expressed declaratively.
