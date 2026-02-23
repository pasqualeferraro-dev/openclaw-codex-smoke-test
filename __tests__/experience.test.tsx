import { fireEvent, render, screen } from "@testing-library/react";
import HomePage from "../app/page";

const mockPathname = jest.fn(() => "/");

jest.mock("next/navigation", () => ({
  usePathname: () => mockPathname(),
}));

beforeAll(() => {
  class MockIntersectionObserver {
    observe() {}

    unobserve() {}

    disconnect() {}

    takeRecords() {
      return [];
    }
  }

  Object.defineProperty(window, "IntersectionObserver", {
    writable: true,
    configurable: true,
    value: MockIntersectionObserver,
  });
});

describe("experience timeline", () => {
  beforeEach(() => {
    mockPathname.mockReturnValue("/");
  });

  it("renders the section and toggles timeline item details", () => {
    render(<HomePage />);

    expect(screen.getByRole("heading", { name: "Experience" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Staff Product Engineer" })).toBeInTheDocument();

    const expandButtons = screen.getAllByRole("button", { name: "More details" });
    fireEvent.click(expandButtons[0]);

    expect(screen.getByRole("button", { name: "Hide details" })).toBeInTheDocument();
    expect(
      screen.getByRole("region", {
        name: /More details about Staff Product Engineer at Northstar Health/i,
      }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Hide details" }));

    expect(
      screen.queryByRole("region", {
        name: /More details about Staff Product Engineer at Northstar Health/i,
      }),
    ).not.toBeInTheDocument();
  });
});
