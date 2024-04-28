import React from "react";
import { UserProvider } from "./(store)/authContext";

import { alata, josefin } from "./fonts";
import "./globals.css";

export const metadata = {
  title: "SHARK | Staff Management",
  description: "A next generation application for staff management",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <UserProvider>
          <body className={`${alata.variable} ${josefin.variable}`}>{children}</body>
      </UserProvider>
    </html>
  );
}
