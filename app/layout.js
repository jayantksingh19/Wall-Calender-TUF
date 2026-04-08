import "./globals.css";

export const metadata = {
  title: "Wall Calendar – Interactive React Component",
  description: "A polished, interactive wall calendar with date range selection, notes, holiday markers, and month-flip animations. Built with Next.js.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
