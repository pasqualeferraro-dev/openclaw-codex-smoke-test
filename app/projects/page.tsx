import type { Metadata } from "next";
import { Suspense } from "react";
import Navbar from "../../components/Navbar";
import ThemeProvider from "../../components/ThemeProvider";
import ProjectsExperience from "../../components/projects/ProjectsExperience";
import { projects } from "../../data/projects";

export const metadata: Metadata = {
  title: "Projects | Pasquale Ferraro",
  description: "Featured product and engineering projects with case studies.",
};

export default function ProjectsPage() {
  return (
    <ThemeProvider>
      <div className="min-h-dvh">
        <Navbar />
        <Suspense fallback={null}>
          <ProjectsExperience projects={projects} />
        </Suspense>
      </div>
    </ThemeProvider>
  );
}
