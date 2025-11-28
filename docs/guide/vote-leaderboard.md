# Vote Leaderboard

This guide walks through building a real-time vote leaderboard where voters can change their mind, and only their latest vote counts.

## The Problem

You have a stream of votes with:
- `voterId` - Who is voting
- `candidateId` - Who they're voting for
- `points` - How many points they're giving
- `timestamp` - When they voted

**Requirements:**
- Voters can vote multiple times for the same candidate
- Only their latest vote (by timestamp) should count
- Show a leaderboard of candidates ranked by total points

## Step 1: Define the Data Type

```typescript
interface Vote {
  voterId: string;
  candidateId: string;
  points: number;
  timestamp: number;
}
```

## Step 2: Build the Pipeline

```typescript
import { createPipeline } from "aggregator-toy";

const builder = createPipeline<Vote>()
  // Group by voter+candidate to track each voter's votes per candidate
  .groupBy(["voterId", "candidateId"], "votes")
  
  // Within each group, keep only the latest vote
  .in("votes").pickByMax("items", "timestamp", "latestVote")
  
  // Now regroup by candidate to aggregate across voters
  .groupBy(["candidateId"], "byCandidate")
  
  // Sum the points from each voter's latest vote
  .in("byCandidate").sum("items", "points", "totalPoints");
```

## Step 3: Set Up State Management

```typescript
const typeDescriptor = builder.getTypeDescriptor();
let state = [];

const pipeline = builder.build(
  transform => { state = transform(state); },
  typeDescriptor
);
```

## Step 4: Feed Votes

```typescript
// Alice votes for Candidate X with 3 points
pipeline.add("1", { voterId: "Alice", candidateId: "X", points: 3, timestamp: 1 });

// Bob votes for Candidate X with 5 points
pipeline.add("2", { voterId: "Bob", candidateId: "X", points: 5, timestamp: 1 });

// Alice changes her vote to 8 points (timestamp 2 > 1, so this becomes her latest)
pipeline.add("3", { voterId: "Alice", candidateId: "X", points: 8, timestamp: 2 });

// Alice also votes for Candidate Y
pipeline.add("4", { voterId: "Alice", candidateId: "Y", points: 4, timestamp: 3 });
```

## Step 5: Read the Leaderboard

```typescript
console.log(state.byCandidate);
// [
//   { key: "X", value: { candidateId: "X", totalPoints: 13 } },
//   { key: "Y", value: { candidateId: "Y", totalPoints: 4 } }
// ]
```

**Why 13 for X?**
- Alice's latest vote: 8 points (timestamp 2)
- Bob's latest vote: 5 points (timestamp 1)
- Total: 13

## How It Works

### Stage 1: Group by Voter+Candidate

After the first groupBy, we have:

```
votes: [
  { key: "Alice|X", value: { items: [vote1, vote3] } },
  { key: "Bob|X", value: { items: [vote2] } },
  { key: "Alice|Y", value: { items: [vote4] } }
]
```

### Stage 2: Pick Latest Vote

After pickByMax on timestamp:

```
votes: [
  { key: "Alice|X", value: { latestVote: vote3 (8 points) } },
  { key: "Bob|X", value: { latestVote: vote2 (5 points) } },
  { key: "Alice|Y", value: { latestVote: vote4 (4 points) } }
]
```

### Stage 3: Regroup by Candidate

After the second groupBy:

```
byCandidate: [
  { key: "X", value: { items: [Alice|X group, Bob|X group] } },
  { key: "Y", value: { items: [Alice|Y group] } }
]
```

### Stage 4: Sum Points

After sum:

```
byCandidate: [
  { key: "X", value: { totalPoints: 13 } },
  { key: "Y", value: { totalPoints: 4 } }
]
```

## Connecting to React

```tsx
function VoteLeaderboard() {
  const { state, pipeline } = useVotePipeline();
  
  // Sort by points descending
  const ranked = [...state.byCandidate].sort(
    (a, b) => b.value.totalPoints - a.value.totalPoints
  );

  return (
    <div>
      <h2>Leaderboard</h2>
      <ol>
        {ranked.map((candidate, index) => (
          <li key={candidate.key}>
            #{index + 1} {candidate.value.candidateId}: {candidate.value.totalPoints} points
          </li>
        ))}
      </ol>
    </div>
  );
}
```

## Live Updates

Connect to a WebSocket or event stream:

```typescript
socket.on("vote", (vote: Vote) => {
  pipeline.add(vote.id, vote);
});

socket.on("vote-retracted", (voteId: string) => {
  pipeline.remove(voteId);
});
```

The leaderboard updates automatically as votes stream in!
