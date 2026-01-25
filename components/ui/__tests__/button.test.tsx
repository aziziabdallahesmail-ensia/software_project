import React from "react";
import { render, screen } from "@testing-library/react";
import { Button } from "../button";

describe("Button component", () => {
  // check that the button renders with the text we give it
  it("should render with children text", () => {
    render(<Button>click me</Button>);
    expect(screen.getByRole("button")).toHaveTextContent("click me");
  });

  // make sure the disabled prop actually disables the button
  it("should be disabled when disabled prop is true", () => {
    render(<Button disabled>disabled button</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  // test that variant classes are applied correctly
  it("should apply destructive variant styles", () => {
    render(<Button variant="destructive">delete</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-destructive");
  });

  // check that size prop changes the button size
  it("should apply small size styles", () => {
    render(<Button size="sm">small button</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("h-8");
  });

  // test that custom classnames get merged in
  it("should merge custom className", () => {
    render(<Button className="my-custom-class">styled</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("my-custom-class");
  });
});
