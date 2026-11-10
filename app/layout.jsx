import "./globals.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export const metadata = {
  title: "Iclabs — People behind the systems",
  description:
    "Portfolio sistem dan tim Iclabs. Satu ekosistem untuk laboratorium yang terhubung.",
  icons: {
    icon: `${basePath}/images/iclabs-logo.png`,
    shortcut: `${basePath}/images/iclabs-logo.png`,
    apple: `${basePath}/images/iclabs-logo.png`,
  },
};

export default function Layout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
