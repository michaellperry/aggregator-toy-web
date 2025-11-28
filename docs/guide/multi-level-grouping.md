# Multi-level Grouping

This guide demonstrates how to build deeply nested aggregations, like grouping venues by region → city → venue.

## The Scenario

You have venue data with location hierarchy and want to compute aggregates at each level.

## Data Type

```typescript
interface Venue {
  venueId: string;
  region: string;
  city: string;
  venueName: string;
  capacity: number;
}
```

## Building the Hierarchy

```typescript
import { createPipeline } from "aggregator-toy";

const builder = createPipeline<Venue>()
  // Level 1: Group by region
  .groupBy(["region"], "byRegion")
  
  // Level 2: Within each region, group by city
  .in("byRegion").groupBy(["city"], "cities")
  
  // Aggregates at city level
  .in("byRegion", "cities").count("items", "venueCount")
  .in("byRegion", "cities").sum("items", "capacity", "totalCapacity")
  .in("byRegion", "cities").max("items", "capacity", "largestVenue")
  
  // Aggregates at region level
  .in("byRegion").count("cities", "cityCount")
  .in("byRegion").sum("cities", "totalCapacity", "regionCapacity");
```

## Feeding Data

```typescript
const typeDescriptor = builder.getTypeDescriptor();
let state = [];
const pipeline = builder.build(
  transform => { state = transform(state); },
  typeDescriptor
);

pipeline.add("v1", { 
  venueId: "v1", region: "Southwest", city: "Dallas", 
  venueName: "Arena", capacity: 20000 
});
pipeline.add("v2", { 
  venueId: "v2", region: "Southwest", city: "Dallas", 
  venueName: "Stadium", capacity: 50000 
});
pipeline.add("v3", { 
  venueId: "v3", region: "Southwest", city: "Houston", 
  venueName: "Center", capacity: 18000 
});
pipeline.add("v4", { 
  venueId: "v4", region: "West", city: "Los Angeles", 
  venueName: "Coliseum", capacity: 78000 
});
```

## Result Structure

```typescript
// state.byRegion
[
  {
    key: "Southwest",
    value: {
      region: "Southwest",
      cityCount: 2,
      regionCapacity: 88000,
      cities: [
        {
          key: "Dallas",
          value: {
            city: "Dallas",
            venueCount: 2,
            totalCapacity: 70000,
            largestVenue: 50000,
            items: [/* venue objects */]
          }
        },
        {
          key: "Houston",
          value: {
            city: "Houston",
            venueCount: 1,
            totalCapacity: 18000,
            largestVenue: 18000,
            items: [/* venue objects */]
          }
        }
      ]
    }
  },
  {
    key: "West",
    value: {
      region: "West",
      cityCount: 1,
      regionCapacity: 78000,
      cities: [
        {
          key: "Los Angeles",
          value: {
            city: "Los Angeles",
            venueCount: 1,
            totalCapacity: 78000,
            largestVenue: 78000,
            items: [/* venue objects */]
          }
        }
      ]
    }
  }
]
```

## Rendering the Hierarchy

```tsx
function VenueHierarchy({ state }) {
  return (
    <div>
      {state.byRegion.map(region => (
        <div key={region.key} className="region">
          <h2>{region.value.region}</h2>
          <p>
            {region.value.cityCount} cities, 
            {region.value.regionCapacity.toLocaleString()} total capacity
          </p>
          
          {region.value.cities.map(city => (
            <div key={city.key} className="city">
              <h3>{city.value.city}</h3>
              <p>
                {city.value.venueCount} venues, 
                {city.value.totalCapacity.toLocaleString()} capacity
              </p>
              
              <ul>
                {city.value.items.map(venue => (
                  <li key={venue.key}>
                    {venue.value.venueName} ({venue.value.capacity.toLocaleString()})
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
```

## Adding More Levels

You can nest as deeply as needed:

```typescript
// Country → Region → City → District → Venue
const builder = createPipeline<DetailedVenue>()
  .groupBy(["country"], "byCountry")
  .in("byCountry").groupBy(["region"], "regions")
  .in("byCountry", "regions").groupBy(["city"], "cities")
  .in("byCountry", "regions", "cities").groupBy(["district"], "districts")
  // Aggregates bubble up
  .in("byCountry", "regions", "cities", "districts").count("items", "venueCount");
```

## Performance Considerations

- Each level adds some overhead
- 3-4 levels is typical for most use cases
- Consider if you really need all levels, or if some can be computed on render
