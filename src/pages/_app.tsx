import { GeistSans } from "geist/font/sans";
import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";

import { ConfigProvider } from "antd";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ConfigProvider>
      <div className={GeistSans.className}>
        <Component {...pageProps} />
      </div>
    </ConfigProvider>
  );
};

export default api.withTRPC(MyApp);
