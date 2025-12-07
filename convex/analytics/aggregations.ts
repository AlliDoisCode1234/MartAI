import { query } from '../_generated/server';
// import { components } from '../_generated/api';
// import { Aggregate } from '@convex-dev/aggregate';

// export const totalGenerations = new Aggregate(components.aggregate, {
//   name: 'totalGenerations',
// });

// export const costPerProject = new Aggregate(components.aggregate, {
//   name: 'costPerProject',
//   bounds: { max: 100 }, // Track top projects by cost
// });

// Temporary mocks to unblock build
export const totalGenerations = {
  count: async (ctx: any) => 0,
  insert: async (ctx: any, args: any) => {},
};
export const costPerProject = {
  insert: async (ctx: any, args: any) => {},
};

export const getDashboardMetrics = query({
  args: {},
  handler: async (ctx) => {
    const generations = await totalGenerations.count(ctx);
    // For cost, we might want a sum over all keys or specific keys.
    // 'costPerProject' is sorted by sum, so walking it gives us top costs.
    // If we want total cost, we might need a separate simple aggregation or just sum the top ones?
    // Aggregate 'sort: sum' allows efficient bounds, but global sum?
    // "The sum of all values in the aggregate is not directly available... "
    // We can iterate. Or we can just add a global 'totalCost' aggregate.

    // For now, let's just show total generations.
    return {
      totalGenerations: generations,
    };
  },
});
