import { fireEvent, render, screen, within } from "@testing-library/react";
import SkillsExperience from "../components/skills/SkillsExperience";
import { skills } from "../data/skills";

describe("skills page interactions", () => {
  it("filters skills by domain and search query", () => {
    render(<SkillsExperience skills={skills} />);

    const groups = screen.getByTestId("skills-groups");
    expect(within(groups).getAllByTestId("skill-card")).toHaveLength(skills.length);

    fireEvent.click(screen.getByRole("button", { name: "Filter skills: AI/Automation" }));

    expect(within(groups).getAllByTestId("skill-card")).toHaveLength(
      skills.filter((skill) => skill.domain === "AI/Automation").length,
    );
    expect(screen.getByRole("button", { name: "Filter skills: AI/Automation" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(within(groups).getByText("LLM Workflow Orchestration")).toBeInTheDocument();
    expect(within(groups).queryByText("Node.js API Design")).not.toBeInTheDocument();

    fireEvent.change(screen.getByRole("searchbox", { name: "Search skills" }), {
      target: { value: "retrieval" },
    });

    expect(within(groups).getAllByTestId("skill-card")).toHaveLength(1);
    expect(within(groups).getByText("Retrieval and Evaluation Pipelines")).toBeInTheDocument();
  });

  it("opens and closes skill details", () => {
    render(<SkillsExperience skills={skills} />);

    const showButton = screen.getByRole("button", {
      name: "Show details for Next.js App Router Architecture",
    });

    expect(showButton).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(showButton);

    const hideButton = screen.getByRole("button", {
      name: "Hide details for Next.js App Router Architecture",
    });
    expect(hideButton).toHaveAttribute("aria-expanded", "true");
    expect(
      screen.getByRole("region", { name: "Next.js App Router Architecture details" }),
    ).toBeInTheDocument();

    fireEvent.click(hideButton);

    expect(
      screen.queryByRole("region", { name: "Next.js App Router Architecture details" }),
    ).not.toBeInTheDocument();
  });
});
