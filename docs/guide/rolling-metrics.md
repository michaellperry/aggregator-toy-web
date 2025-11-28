# Rolling Metrics Over Time

This guide shows how to compute rolling metrics over time-based data using aggregator-toy.

## The Scenario

You have a stream of events with timestamps, and you want to compute metrics over time windows (last hour, last day, etc.).

## Data Type

```typescript
interface Event {
  eventId: string;
  type: string;
  timestamp: number;
  value: number;
}
```

## Basic Time Grouping

Group events by time period:

```typescript
import { createPipeline } from "aggregator-toy";

const builder = createPipeline<Event>()
  // Add a computed property for the hour bucket
  .defineProperty("hourBucket", event => 
    Math.floor(event.timestamp / 3600000) * 3600000
  )
  // Group by hour
  .groupBy(["hourBucket"], "byHour")
  // Sum values per hour
  .in("byHour").sum("items", "value", "hourlyTotal")
  // Count events per hour
  .in("byHour").count("items", "eventCount");
```

## Multi-Level Time Grouping

Group by day, then by hour within each day:

```typescript
const builder = createPipeline<Event>()
  // Add day and hour buckets
  .defineProperty("dayBucket", event => 
    Math.floor(event.timestamp / 86400000) * 86400000
  )
  .defineProperty("hourBucket", event => 
    Math.floor(event.timestamp / 3600000) * 3600000
  )
  // Group by day
  .groupBy(["dayBucket"], "byDay")
  // Within each day, group by hour
  .in("byDay").groupBy(["hourBucket"], "byHour")
  // Aggregate at hour level
  .in("byDay", "byHour").sum("items", "value", "hourlyTotal")
  // Aggregate at day level
  .in("byDay").sum("byHour", "hourlyTotal", "dailyTotal");
```

## Rolling Window with Cleanup

For a true rolling window, you need to remove old events:

```typescript
const WINDOW_SIZE = 3600000; // 1 hour in ms

// Store event timestamps for cleanup
const eventTimestamps = new Map<string, number>();

function addEvent(event: Event) {
  eventTimestamps.set(event.eventId, event.timestamp);
  pipeline.add(event.eventId, event);
  
  // Clean up old events
  const cutoff = Date.now() - WINDOW_SIZE;
  for (const [id, timestamp] of eventTimestamps) {
    if (timestamp < cutoff) {
      pipeline.remove(id);
      eventTimestamps.delete(id);
    }
  }
}
```

## Metrics by Event Type

Combine time grouping with event type:

```typescript
const builder = createPipeline<Event>()
  .defineProperty("hourBucket", event => 
    Math.floor(event.timestamp / 3600000) * 3600000
  )
  // Group by type, then by hour
  .groupBy(["type"], "byType")
  .in("byType").groupBy(["hourBucket"], "byHour")
  // Metrics per type per hour
  .in("byType", "byHour").sum("items", "value", "total")
  .in("byType", "byHour").count("items", "count")
  .in("byType", "byHour").average("items", "value", "average");
```

## Result Structure

```typescript
// state.byType
[
  {
    key: "clicks",
    value: {
      type: "clicks",
      byHour: [
        { key: "hour_1", value: { total: 150, count: 45, average: 3.33 } },
        { key: "hour_2", value: { total: 200, count: 60, average: 3.33 } }
      ]
    }
  },
  {
    key: "purchases",
    value: {
      type: "purchases",
      byHour: [
        { key: "hour_1", value: { total: 5000, count: 10, average: 500 } }
      ]
    }
  }
]
```

## Rendering a Time Chart

```tsx
function HourlyChart({ data }) {
  const hours = data.byHour.map(h => ({
    hour: new Date(h.value.hourBucket).toLocaleTimeString(),
    total: h.value.total,
    count: h.value.count
  }));

  return (
    <div>
      {hours.map(h => (
        <div key={h.hour}>
          <span>{h.hour}</span>
          <span>Total: {h.total}</span>
          <span>Count: {h.count}</span>
        </div>
      ))}
    </div>
  );
}
```
