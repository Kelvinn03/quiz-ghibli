import type { Metadata } from "next";
import localFont from "next/font/local";
import Link from "next/link";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Ghibli Tracker",
  description: "Browse Studio Ghibli films and track your personal reviews.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
          <div className="container py-2">
            <Link href="/" className="navbar-brand fw-semibold text-success">
              Ghibli Tracker
            </Link>
            <div className="d-flex gap-3 ms-auto">
              <Link href="/" className="nav-link">
                Home
              </Link>
              <Link href="/films" className="nav-link">
                All Films
              </Link>
              <Link href="/my-reviews" className="nav-link">
                My Reviews
              </Link>
            </div>
          </div>
        </nav>
        <main className="py-5">
          <div className="container">{children}</div>
        </main>
      </body>
    </html>
  );
}
