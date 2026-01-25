import { ScrollViewStyleReset } from "expo-router/html";
import React from "react";

export default function Html({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <ScrollViewStyleReset />

        <style>{`
          html, body { height: 100%; }
          body { margin: 0; -webkit-text-size-adjust: 100%; }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}
