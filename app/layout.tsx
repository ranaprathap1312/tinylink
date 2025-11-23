// app/layout.tsx
import "./globals.css";

export const metadata = {
  title: "TinyLink",
  description: "Shorten URLs • Track Clicks",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}