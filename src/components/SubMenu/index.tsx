import { Button, Typography } from "antd";
import styles from "./index.module.css";
import {
  AlignCenterOutlined,
  AlignLeftOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
const { Title } = Typography;

export const SubMenu = () => {
  return (
    <div className={styles.subMenu}>
      <Title level={4} className={styles.title}>
        COVID-19 Charts
      </Title>
      <div className={styles.actionButtons}>
        <Button type="text">
          Export to PDF <DownloadOutlined />
        </Button>
        <Button type="text">
          Notes <span className={styles.textCounter}>(3)</span>
          <AlignLeftOutlined />
        </Button>
        <Button type="text">
          Filter
          <span className={styles.circleCounter}>9+</span>
          <AlignCenterOutlined />
        </Button>
      </div>
    </div>
  );
};
