// 他の CSS ファイルは、対応するパッケージのコンポーネントを使用する場合にのみ必要
// 例:
// import '@mantine/dates/styles.css';
// import '@mantine/dropzone/styles.css';
// import '@mantine/code-highlight/styles.css';
// ...

import { createTheme, MantineProvider } from "@mantine/core";
import { AppProps } from "../../node_modules/next/app";

const theme = createTheme({
  // ここに Mantine テーマの上書きを記述
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider theme={theme}>
      <Component {...pageProps} />
    </MantineProvider>
  );
}

export default MyApp;
