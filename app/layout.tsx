import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "TalentMind AI — Enterprise Talent Intelligence Platform",
  description:
    "TalentMind AI is the enterprise-grade talent intelligence platform powered by RAG pipelines, LangGraph multi-agent workflows, and vector-semantic search — helping HR teams hire smarter, assess deeper, and upskill faster.",
  keywords: [
    "AI recruiting",
    "talent intelligence",
    "HR AI platform",
    "RAG hiring",
    "LangGraph agents",
    "candidate assessment AI",
    "workforce analytics",
    "generative AI HR",
  ],
  authors: [{ name: "TalentMind Inc." }],
  openGraph: {
    title: "TalentMind AI — Enterprise Talent Intelligence Platform",
    description:
      "Hire smarter with AI-powered talent matching, semantic search, and multi-agent candidate intelligence.",
    type: "website",
    siteName: "TalentMind",
  },
  twitter: {
    card: "summary_large_image",
    title: "TalentMind AI",
    description: "Enterprise Talent Intelligence powered by GenAI & Agentic AI",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${plusJakarta.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#f8f7ff]">{children}</body>
    </html>
  );
}
