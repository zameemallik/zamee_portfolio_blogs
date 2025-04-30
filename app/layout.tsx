import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { MantineProvider, ColorSchemeScript, Container } from "@mantine/core";
import { HeaderComponents } from "./components/Header/Header";
import { Notifications } from "@mantine/notifications";
import { TRPCProvider } from "./_trpc/provider";
import { AuthProvider } from "./providers/AuthProvider";

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
          href="https://fonts.googleapis.com/css?family=Tangerine&display=optional"
          rel="stylesheet"
        />
      </head>
      <body>
        <TRPCProvider>
          <MantineProvider defaultColorScheme="light">
            <AuthProvider>
              <HeaderComponents />
              <Notifications
                position="top-right"
                containerWidth={200}
                zIndex={2077}
              />
              <Container style={{ marginTop: "80px" }}>{children}</Container>
            </AuthProvider>
          </MantineProvider>
        </TRPCProvider>
      </body>
    </html>
  );
}
