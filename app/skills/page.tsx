import type { Metadata } from "next";
import Navbar from "../../components/Navbar";
import ThemeProvider from "../../components/ThemeProvider";
import SkillsExperience from "../../components/skills/SkillsExperience";
import { skills } from "../../data/skills";

export const metadata: Metadata = {
  title: "Skills | Pasquale Ferraro",
  description:
    "Interactive skill map with practical proof, certifications, and related projects.",
};

export default function SkillsPage() {
  return (
    <ThemeProvider>
      <div className="min-h-dvh">
        <Navbar />
        <SkillsExperience skills={skills} />
      </div>
    </ThemeProvider>
  );
}
