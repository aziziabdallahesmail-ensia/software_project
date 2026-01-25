import React from "react";
import { render, screen } from "@testing-library/react";
import { PageTitle } from "../page-title";

describe("PageTitle component", () => {
  // check that the title renders correctly
  it("should render the title", () => {
    render(<PageTitle title="my page title" />);
    expect(screen.getByRole("heading")).toHaveTextContent("my page title");
  });

  // test that back link shows up when provided
  it("should render back link when backLink prop is provided", () => {
    render(<PageTitle title="test" backLink="/home" />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/home");
  });

  // check that default back label is "back"
  it("should show default back label", () => {
    render(<PageTitle title="test" backLink="/home" />);
    expect(screen.getByText("Back")).toBeInTheDocument();
  });

  // test custom back label
  it("should show custom back label when provided", () => {
    render(<PageTitle title="test" backLink="/home" backLabel="retour" />);
    expect(screen.getByText("retour")).toBeInTheDocument();
  });

  // no back link means no link element
  it("should not render link when backLink is not provided", () => {
    render(<PageTitle title="standalone title" />);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
