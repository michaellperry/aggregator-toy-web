# aggregator-toy vs Arquero

[Arquero](https://uwdata.github.io/arquero/) is a JavaScript library for query processing and transformation of column-oriented data tables. It provides SQL-like verbs for data manipulation.

## Key Differences

| Aspect | aggregator-toy | Arquero |
|--------|----------------|---------|
| **Data model** | Rows (objects) | Columns (tables) |
| **Primary focus** | Live updates | Batch transformations |
| **Incremental** | ✅ Yes | ❌ No (recompute) |
| **API style** | Pipeline DSL | SQL-like verbs |
| **Use case** | Streaming dashboards | Analytics queries |

## The Vote Leaderboard in Arquero

```javascript
import * as aq from 'arquero';

// Create table from votes
const votes = aq.table({
  id: ['1', '2', '3', '4'],
  voterId: ['A', 'B', 'A', 'A'],
  candidateId: ['X', 'X', 'X', 'Y'],
  points: [3, 5, 8, 4],
  timestamp: [1, 1, 2, 3]
});

// Process: group by voter+candidate, keep latest, then sum by candidate
const leaderboard = votes
  .groupby('voterId', 'candidateId')
  .orderby(aq.desc('timestamp'))
  .filter((d, $) => aq.op.row_number() === 1)
  .groupby('candidateId')
  .rollup({ totalPoints: d => aq.op.sum(d.points) });

leaderboard.print();
// candidateId │ totalPoints
// X           │ 13
// Y           │ 4
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

## Adding New Data

**Arquero:**
```javascript
// Must rebuild the entire table and rerun the query
const newVotes = votes.concat(aq.table({
  id: ['5'],
  voterId: ['C'],
  candidateId: ['X'],
  points: [7],
  timestamp: [4]
}));

const newLeaderboard = newVotes
  .groupby('voterId', 'candidateId')
  // ... same query again
```

**aggregator-toy:**
```typescript
// Just add the new item - only affected groups update
pipeline.add('5', { voterId: 'C', candidateId: 'X', points: 7, timestamp: 4 });
// state is automatically updated
```

## When to Use Arquero

- **Batch analytics** - One-time transformations of datasets
- **SQL-like queries** - Familiar syntax for data professionals
- **Columnar operations** - Efficient for wide tables
- **Data science workflows** - Exploratory analysis
- **Complex joins** - Multi-table operations

## When to Use aggregator-toy

- **Live data feeds** - Updates arrive continuously
- **Real-time dashboards** - State must stay current
- **Efficient updates** - Only touched groups recompute
- **UI integration** - State shape maps to components

## The Fundamental Difference

**Arquero** thinks in terms of tables and queries. You have a table, you run a query, you get a result. When data changes, you run the query again.

**aggregator-toy** thinks in terms of pipelines and state. You define how data flows through transformations. When data changes, only the affected parts update.

```
Arquero:
  Table + Query → Result
  New Data → Rebuild Table + Rerun Query → New Result

aggregator-toy:
  Data → Pipeline → State
  New Data → Update Affected Groups → Updated State
```

## Performance Comparison

| Scenario | Arquero | aggregator-toy |
|----------|---------|----------------|
| Initial load of 10K items | Fast | Fast |
| Add 1 item to 10K | Recompute all | O(1) - O(log n) |
| Remove 1 item from 10K | Recompute all | O(1) - O(n)* |

\* O(n) only for min/max when the removed item was the min/max

## Summary

Arquero is fantastic for "take this table and transform it" workflows. aggregator-toy is for "take this live feed and keep a state tree updated as records arrive and leave."

If you're doing batch analytics or exploratory data analysis, Arquero (or similar tools like Danfo.js, Pandas) is the right choice. If you're building a live dashboard or leaderboard that needs to update efficiently as data streams in, aggregator-toy is designed for exactly that.
