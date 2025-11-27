# aggregator-toy vs RxJS

[RxJS](https://rxjs.dev/) is a library for reactive programming using Observables. It provides a powerful set of operators for composing asynchronous and event-based programs.

## Key Differences

| Aspect | aggregator-toy | RxJS |
|--------|----------------|------|
| **Primary focus** | Grouped aggregations | General reactive streams |
| **State management** | Built-in state tree | Manual via scan/reduce |
| **Grouping** | First-class `.groupBy()` | `groupBy()` operator |
| **Incremental updates** | Automatic | Manual implementation |
| **Learning curve** | Lower for aggregations | Higher, more concepts |

## The Vote Leaderboard in RxJS

```typescript
import { Subject, scan, map, groupBy, mergeMap } from 'rxjs';

interface Vote {
  id: string;
  voterId: string;
  candidateId: string;
  points: number;
  timestamp: number;
}

const votes$ = new Subject<{ type: 'add' | 'remove'; vote: Vote }>();

const leaderboard$ = votes$.pipe(
  scan((state, action) => {
    if (action.type === 'add') {
      return new Map(state).set(action.vote.id, action.vote);
    } else {
      const newState = new Map(state);
      newState.delete(action.vote.id);
      return newState;
    }
  }, new Map<string, Vote>()),
  map(votes => {
    // Group by voter+candidate, keep latest
    const byVoterCandidate = new Map<string, Vote>();
    for (const vote of votes.values()) {
      const key = `${vote.voterId}|${vote.candidateId}`;
      const existing = byVoterCandidate.get(key);
      if (!existing || vote.timestamp > existing.timestamp) {
        byVoterCandidate.set(key, vote);
      }
    }
    
    // Group by candidate, sum points
    const byCandidate = new Map<string, number>();
    for (const vote of byVoterCandidate.values()) {
      const current = byCandidate.get(vote.candidateId) ?? 0;
      byCandidate.set(vote.candidateId, current + vote.points);
    }
    
    return Array.from(byCandidate.entries()).map(([id, points]) => ({
      candidateId: id,
      totalPoints: points
    }));
  })
);

// Subscribe to updates
leaderboard$.subscribe(console.log);

// Feed votes
votes$.next({ type: 'add', vote: { id: '1', voterId: 'A', candidateId: 'X', points: 3, timestamp: 1 }});
```

## The Same in aggregator-toy

```typescript
import { createPipeline } from "aggregator-toy";

const builder = createPipeline<Vote>()
  .groupBy(["voterId", "candidateId"], "votes")
  .in("votes").pickByMax("items", "timestamp", "latestVote")
  .groupBy(["candidateId"], "byCandidate")
  .in("byCandidate").sum("items", "points", "totalPoints");

let state = [];
const pipeline = builder.build(s => { state = s(state); }, builder.getTypeDescriptor());

pipeline.add("1", { voterId: "A", candidateId: "X", points: 3, timestamp: 1 });
```

## When to Use RxJS

- **Complex async flows** - Combining multiple data sources, handling errors, retries
- **Event-based programming** - DOM events, WebSocket messages
- **Cancellation and backpressure** - Managing async operations
- **You're already using RxJS** - Consistency with existing codebase

## When to Use aggregator-toy

- **Grouped aggregations** - The primary use case
- **Real-time leaderboards/dashboards** - Optimized for this pattern
- **Simpler mental model** - Declare the pipeline, get the state
- **Less boilerplate** - Grouping and aggregation built-in

## Using Together

You can use both libraries together:

```typescript
import { fromEvent } from 'rxjs';
import { createPipeline } from 'aggregator-toy';

// Create the aggregation pipeline
const builder = createPipeline<Vote>()
  .groupBy(["candidateId"], "byCandidate")
  .sum("byCandidate", "points", "totalPoints");

let state = [];
const pipeline = builder.build(s => { state = s(state); }, builder.getTypeDescriptor());

// Feed from an RxJS observable
websocket$.subscribe(vote => {
  pipeline.add(vote.id, vote);
});
```

RxJS handles the stream; aggregator-toy handles the aggregation.
