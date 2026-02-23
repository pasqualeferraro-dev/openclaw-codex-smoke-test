import { fireEvent, render, screen, within } from "@testing-library/react";
import ProjectsExperience from "../components/projects/ProjectsExperience";
import { projects } from "../data/projects";

describe("projects page interactions", () => {
  it("filters the projects grid by selected category", () => {
    render(<ProjectsExperience projects={projects} />);

    const grid = screen.getByTestId("projects-grid");
    expect(within(grid).getAllByTestId("project-card")).toHaveLength(projects.length);

    fireEvent.click(screen.getByRole("button", { name: "Filter projects: AI" }));

    const filteredCards = within(grid).getAllByTestId("project-card");
    expect(filteredCards).toHaveLength(
      projects.filter((project) => project.category === "AI").length,
    );
    expect(screen.getByRole("button", { name: "Filter projects: AI" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(within(grid).getByText("Signal Labs")).toBeInTheDocument();
    expect(within(grid).queryByText("Atlas Commerce")).not.toBeInTheDocument();
  });

  it("opens and closes the modal via button, escape key, and backdrop", () => {
    render(<ProjectsExperience projects={projects} />);

    const grid = screen.getByTestId("projects-grid");
    const openButton = within(grid).getByRole("button", {
      name: "Open case study for Signal Labs",
    });

    fireEvent.click(openButton);
    expect(screen.getByRole("dialog", { name: "Signal Labs" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Close case study" }));
    expect(screen.queryByRole("dialog", { name: "Signal Labs" })).not.toBeInTheDocument();

    fireEvent.click(openButton);
    expect(screen.getByRole("dialog", { name: "Signal Labs" })).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog", { name: "Signal Labs" })).not.toBeInTheDocument();

    fireEvent.click(openButton);
    expect(screen.getByRole("dialog", { name: "Signal Labs" })).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("project-modal-backdrop"));
    expect(screen.queryByRole("dialog", { name: "Signal Labs" })).not.toBeInTheDocument();
  });
});
