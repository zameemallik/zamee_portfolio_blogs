import "@mantine/core/styles.css";
import { MantineProvider, ColorSchemeScript, Container } from "@mantine/core";
import { HeaderComponents } from "./components/Header/Header";

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
        <MantineProvider defaultColorScheme="light">
          <HeaderComponents />
          <Container style={{ marginTop: "80px" }}>{children}</Container>
        </MantineProvider>
      </body>
    </html>
  );
}
