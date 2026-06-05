import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ||
      "https://all-in-one-resume-builder-job-assist-applier.vercel.app"
  ),
  title: "All in One Resume Builder and Job Assist Applier",
  description:
    "Free open-source resume builder, ATS readiness helper, cover letter generator, Chrome job saver, and application tracker.",
  openGraph: {
    title: "All in One Resume Builder and Job Assist Applier",
    description:
      "Build resumes, save jobs, tailor applications, export documents, and track job-search progress.",
    images: ["/product-snapshot.png"]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
