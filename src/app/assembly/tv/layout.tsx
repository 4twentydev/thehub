import "@/app/globals.css";
import { Providers } from "@/app/providers";

export const metadata = {
  title: "Assembly Floor | Live Metrics"
};

export default function TvLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
