---
layout: home

hero:
  name: aggregator-toy
  text: Live aggregations for in-memory data
  tagline: Build pipelines that group, aggregate, and transform live data feeds with incremental updates and immutable state, tuned for dashboards, leaderboards, and streaming UIs.
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: See Comparisons
      link: /comparisons/
    - theme: alt
      text: View on GitHub
      link: https://github.com/michaellperry/aggregator-toy

features:
  - icon: ⚡
    title: Incremental Updates
    details: Each step updates only the affected aggregates and forwards changes downstream. No global recompute needed.
  - icon: 🔗
    title: Composable Pipelines
    details: Compose steps into a pipeline. Each step listens for changes and maintains its own local state.
  - icon: 🌳
    title: Immutable State Tree
    details: The result is a nested, immutable state tree that is always ready to render in React, Svelte, or any UI framework.
---

<script setup>
import { VPTeamMembers } from 'vitepress/theme'
</script>

## Quick Example: Vote Leaderboard

Imagine a stream of votes. Each record has a voter, a candidate, and a number of points. Voters can change their mind; only their latest vote should count. You want a leaderboard of `candidateId → totalPoints` that updates as new votes arrive, without recomputing from scratch.

```typescript
import { createPipeline } from "aggregator-toy";

interface Vote {
  voterId: string;
  candidateId: string;
  points: number;
  timestamp: number;
}

const builder = createPipeline<Vote>()
  // Each (voterId, candidateId) gets its own group
  .groupBy(["voterId", "candidateId"], "votes")
  // Keep only the latest vote by timestamp
  .in("votes").pickByMax("items", "timestamp", "latestVote")
  // Regroup by candidate
  .groupBy(["candidateId"], "byCandidate")
  // Sum the points from the latest vote for each voter
  .in("byCandidate").sum("items", "points", "totalPoints");

// Build with state management
const typeDescriptor = builder.getTypeDescriptor();
let state = [];
const pipeline = builder.build(s => { state = s(state); }, typeDescriptor);

// Feed votes
pipeline.add("1", { voterId: "A", candidateId: "X", points: 3, timestamp: 1 });
pipeline.add("2", { voterId: "B", candidateId: "X", points: 5, timestamp: 1 });
pipeline.add("3", { voterId: "A", candidateId: "X", points: 8, timestamp: 2 });
pipeline.add("4", { voterId: "A", candidateId: "Y", points: 4, timestamp: 3 });

// state.byCandidate now contains:
// [
//   { key: "X", value: { candidateId: "X", totalPoints: 13 } },
//   { key: "Y", value: { candidateId: "Y", totalPoints: 4 } }
// ]
```

The pipeline keeps per-group state and only touches the groups affected by each new vote. There is no global recompute, and the state tree is always ready for your UI to render.
