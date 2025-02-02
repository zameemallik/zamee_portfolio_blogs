import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { MantineProvider, ColorSchemeScript, Container } from "@mantine/core";
import { HeaderComponents } from "./components/Header/Header";
import { Notifications } from "@mantine/notifications";

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
          <Notifications
            position="top-right"
            containerWidth={200}
            zIndex={2077}
          />
          <Container style={{ marginTop: "80px" }}>{children}</Container>
        </MantineProvider>
      </body>
    </html>
  );
}
