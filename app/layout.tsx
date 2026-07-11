import "./globals.css";

export const metadata = {
  title: "Gestor de Torneos",
  description: "Plataforma de torneos VGC",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
