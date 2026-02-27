import type { Metadata } from "next";
import Navbar from "../../../components/Navbar";
import ThemeProvider from "../../../components/ThemeProvider";
import StudioEditor from "../../../components/blog/StudioEditor";

export const metadata: Metadata = {
  title: "Blog Studio | Pasquale Ferraro",
  description: "Internal editor for creating and previewing blog content.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function BlogStudioPage() {
  return (
    <ThemeProvider>
      <div className="min-h-dvh">
        <Navbar />
        <StudioEditor />
      </div>
    </ThemeProvider>
  );
}
