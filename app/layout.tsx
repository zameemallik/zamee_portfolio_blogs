import "@mantine/core/styles.css";
import {
  MantineProvider,
  ColorSchemeScript,
  AppShell,
  Container,
} from "@mantine/core";
import { HeaderComponents } from "./components/Header/Header";

// export const metadata = {
//   title: "My Mantine App",
//   description: "An application using Mantine with Next.js",
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <ColorSchemeScript />
        <link
          href="https://fonts.googleapis.com/css?family=Tangerine"
          rel="stylesheet"
        />
      </head>
      <body>
        <MantineProvider>
          <HeaderComponents />
          <Container style={{ marginTop: "80px" }}>{children}</Container>
        </MantineProvider>
      </body>
    </html>
  );
}
