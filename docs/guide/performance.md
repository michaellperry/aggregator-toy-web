# Performance & Scaling

aggregator-toy is designed to trade memory for speed, making it efficient for real-time updates.

## Time Complexity

| Operation | Complexity | Notes |
|-----------|------------|-------|
| Add item | O(d) | d = depth of nesting |
| Remove item | O(d) | For commutative aggregates |
| Remove with min/max | O(n) | Must scan to find new min/max |
| Lookup by key | O(1) | Hash-based grouping |

## Space Complexity

The library stores:

1. **Per-group aggregate values** - Map keyed by parent path hash
2. **Item snapshots** - For computing removals correctly
3. **Handler registrations** - For event propagation

Total space: O(n × d) where n = items, d = depth

## Memory vs Speed Tradeoff

aggregator-toy prioritizes update speed over memory:

```
Traditional approach:
  Add item → Recompute all aggregates → O(n)

aggregator-toy:
  Add item → Update affected groups → O(d)
```

This makes it ideal for:
- Frequent updates (streaming data)
- Large datasets with many groups
- Real-time dashboards

## When to Use

**Good fit:**
- Live dashboards with frequent updates
- Leaderboards with streaming votes
- Moderate dataset sizes (thousands to tens of thousands)
- UI-driven applications

**Consider alternatives for:**
- Batch analytics on huge datasets
- One-time transformations
- Memory-constrained environments
- Complex joins across datasets

## Optimization Tips

### 1. Choose Keys Wisely

Use properties that create balanced groups:

```typescript
// Good: Balanced groups
.groupBy(["region"], "byRegion")

// Potentially unbalanced: One huge group
.groupBy(["isPremium"], "byStatus")  // 99% false, 1% true
```

### 2. Limit Nesting Depth

Each level adds overhead:

```typescript
// Efficient: 2 levels
.groupBy(["state"], "states")
.in("states").groupBy(["city"], "cities")

// Consider if really needed: 4+ levels
.groupBy(["country"], "...")
.groupBy(["state"], "...")
.groupBy(["city"], "...")
.groupBy(["district"], "...")
```

### 3. Use Appropriate Aggregates

- `sum`, `count` - O(1) updates
- `min`, `max` - O(1) add, O(n) remove
- `pickByMin`, `pickByMax` - O(1) add, O(n) remove

If you only add items (never remove), all operations are O(1).
