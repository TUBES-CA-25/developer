import "./globals.css";
export const metadata = {
  title: "Iclabs — People behind the systems",
  description:
    "Portfolio sistem dan tim Iclabs. Satu ekosistem untuk laboratorium yang terhubung.",
};
export default function Layout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
