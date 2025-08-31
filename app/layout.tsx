import type { Metadata } from "next";
import { Toaster } from "sonner";
import { AuthProvider } from "@/lib/context/auth-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "Polling App",
  description: "Create and vote on polls with your community",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="font-sans antialiased"
        suppressHydrationWarning
      >
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
