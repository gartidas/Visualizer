import Head from "next/head";
import { Avatar, Button, Divider, Flex, Layout, Spin } from "antd";
import { api } from "~/utils/api";
import styles from "./index.module.css";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Content } from "antd/es/layout/layout";
import { Navbar } from "~/components/Navbar";
import { useBreakpointValue } from "~/utils/breakpoints";
import { HeartFilled, HeartOutlined, MessageOutlined } from "@ant-design/icons";
import Title from "antd/es/typography/Title";
import { SubMenu } from "~/components/SubMenu";

export default function Home() {
  const utils = api.useUtils();
  const chartWidth = useBreakpointValue({
    xs: 250,
    md: 500,
    xxxl: 700,
  });
  const chartHeight = useBreakpointValue({
    xs: 200,
    md: 400,
    xxxl: 600,
  });

  const { data, isLoading } = api.chart.getDiseaseMetrics.useQuery();
  const { mutateAsync: toggleFavoriteChart } =
    api.chart.toggleFavoriteChart.useMutation({
      onSuccess: ({ diseaseChart }) => {
        const previousData = utils.chart.getDiseaseMetrics.getData();

        const newData = previousData?.map((chartData) =>
          chartData.id === diseaseChart?.id
            ? { ...chartData, isFavorite: diseaseChart?.isFavorite }
            : chartData
        );
        utils.chart.getDiseaseMetrics.setData(undefined, () => newData);
      },
    });

  return (
    <>
      <Head>
        <title>Visualizer</title>
        <meta
          name="description"
          content="Charts page dedicated to COVID-19 data-sets (in England)"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Navbar />
        <Content>
          <div className={styles.main}>
            <SubMenu />

            {isLoading ? (
              <Spin fullscreen />
            ) : (
              <div className={styles.chartsContainer}>
                {data?.map((diseaseChart) => (
                  <div key={diseaseChart.id} className={styles.chartCard}>
                    <Flex justify="space-between" gap="middle">
                      <Title level={4} className={styles.title}>
                        {diseaseChart.title}
                      </Title>

                      <div
                        className={styles.favoriteButton}
                        onClick={() =>
                          toggleFavoriteChart({
                            chartId: diseaseChart.id!,
                            isFavorite: !diseaseChart.isFavorite,
                          })
                        }
                      >
                        {diseaseChart.isFavorite ? (
                          <HeartOutlined />
                        ) : (
                          <HeartFilled />
                        )}
                      </div>
                    </Flex>

                    <Divider />

                    {/* NOTE: g2.antv has documentation written in chinese (even though english is selected) and no support for TS */}
                    {/*       although this would not be an issue, I've decided to use another library to show how it could be done better / easier (can rework if needed) */}
                    <BarChart
                      width={chartWidth}
                      height={chartHeight}
                      data={diseaseChart.results}
                    >
                      <CartesianGrid strokeDasharray="3 3" />

                      <XAxis dataKey="date" />
                      <YAxis dataKey="metric_value" />

                      <Tooltip />
                      <Legend />

                      <Bar dataKey="metric_value" fill="#00b96b" />
                    </BarChart>

                    <Divider />

                    <Flex justify="space-between" gap="middle">
                      <Avatar
                        src="https://i.pinimg.com/736x/37/b4/d3/37b4d3d79ca08d28683fe0e593a774d5.jpg"
                        alt="Avatar"
                      />

                      <Button type="text" className={styles.commentButton}>
                        3 <MessageOutlined />
                      </Button>
                    </Flex>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Content>
      </Layout>
    </>
  );
}
