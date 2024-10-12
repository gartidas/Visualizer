import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { charts } from "~/server/db/schema";

import { type IChartsData } from "~/server/model";

export const chartsRouter = createTRPCRouter({
  getDiseaseDataByPageNumber: publicProcedure
    .input(z.object({ pageNumber: z.number().nullable() }).nullable())
    .query(async ({ input }) => {
      // NOTE: any other param other than pageNumber returns empty array
      const data = await fetch(
        `https://api.ukhsa-dashboard.data.gov.uk/themes/infectious_disease/sub_themes/respiratory/topics/COVID-19/geography_types/Nation/geographies/England/metrics/COVID-19_testing_PCRcountByDay?format=json${
          input?.pageNumber ? `&page=${input.pageNumber}` : ""
        }`
      );

      return (await data.json()) as IChartsData;
    }),
});
