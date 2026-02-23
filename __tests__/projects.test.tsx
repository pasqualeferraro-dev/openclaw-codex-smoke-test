import { fireEvent, render, screen, within } from "@testing-library/react";
import ProjectsExperience from "../components/projects/ProjectsExperience";
import { projects } from "../data/projects";

const mockReplace = jest.fn();
const mockPathname = jest.fn(() => "/projects");
const mockSearchParams = jest.fn(() => new URLSearchParams());

jest.mock("next/navigation", () => ({
  usePathname: () => mockPathname(),
  useRouter: () => ({ replace: mockReplace }),
  useSearchParams: () => mockSearchParams(),
}));

describe("projects page interactions", () => {
  beforeEach(() => {
    mockReplace.mockClear();
    mockPathname.mockReturnValue("/projects");
    mockSearchParams.mockReturnValue(new URLSearchParams());
  });

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
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("opens a case-study modal from the project query param on mount", () => {
    mockSearchParams.mockReturnValue(new URLSearchParams("project=signal-labs"));

    render(<ProjectsExperience projects={projects} />);

    expect(screen.getByRole("dialog", { name: "Signal Labs" })).toBeInTheDocument();
  });

  it("removes modal query params from the URL when the modal closes", () => {
    mockSearchParams.mockReturnValue(new URLSearchParams("modal=signal-labs&foo=bar"));

    render(<ProjectsExperience projects={projects} />);
    expect(screen.getByRole("dialog", { name: "Signal Labs" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Close case study" }));

    expect(mockReplace).toHaveBeenCalledWith("/projects?foo=bar", { scroll: false });
  });
});
