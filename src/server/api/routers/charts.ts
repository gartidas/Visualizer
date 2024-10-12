import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const chartsRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getCharts: publicProcedure.query(async () => {
    const data = await fetch(
      "https://api.ukhsa-dashboard.data.gov.uk/themes/infectious_disease/sub_themes/respiratory/topics/COVID-19/geography_types/Nation/geographies/England/metrics/COVID-19_testing_PCRcountByDay?format=json"
    );

    return (await data.json()) as IChartsData;
  }),
});

interface IChartItem {
  theme: string;
  sub_theme: string;
  topic: string;
  geography_type: string;
  geography: string;
  geography_code: string;
  metric: string;
  metric_group: string;
  stratum: string;
  sex: string;
  age: string;
  year: number;
  month: number;
  epiweek: number;
  date: string;
  metric_value: number;
  in_reporting_delay_period: boolean;
}

interface IChartsData {
  count: number;
  next: string | null;
  previous: string | null;
  results: IChartItem[];
}
