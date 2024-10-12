import { eq } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import { diseaseCharts } from "~/server/db/schema";

import { type IChartsData } from "~/server/model";

export const chartsRouter = createTRPCRouter({
  getDiseaseMetrics: publicProcedure.query(async () => {
    const diseaseCharts = await db.query.diseaseCharts.findMany();

    const diseaseChartsData = await Promise.all<IChartsData>(
      diseaseCharts.map((diseaseChart) =>
        fetch(diseaseChart.url).then((response) => response.json())
      )
    );

    return diseaseChartsData
      .map((diseaseChartsDataEntry, index) => {
        return { ...diseaseChartsDataEntry, ...diseaseCharts[index] };
      })
      .sort((a, b) => a.id! - b.id!);
  }),
  toggleFavoriteChart: publicProcedure
    .input(z.object({ chartId: z.number(), isFavorite: z.boolean() }))
    .mutation(async ({ input }) => {
      console.log(input);
      const [diseaseChart] = await db
        .update(diseaseCharts)
        .set({ isFavorite: input.isFavorite })
        .where(eq(diseaseCharts.id, input.chartId))
        .returning();

      return { diseaseChart };
    }),
});
