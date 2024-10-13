import { Flex, Typography } from "antd";
import styles from "./index.module.css";
import { Header } from "antd/es/layout/layout";
const { Title } = Typography;

export const Navbar = () => {
  return (
    <Header className={styles.header}>
      <Flex align="center" className={styles.wrapper}>
        <Title level={3} className={styles.title}>
          Visualizer
        </Title>
      </Flex>
    </Header>
  );
};
