import { render, screen, fireEvent } from "@testing-library/react";
import { Avatar } from "./Avatar";

describe("Avatar (web)", () => {
  it("renders an image when a uri is provided", () => {
    render(<Avatar uri="https://example.com/avatar.png" name="Ada Lovelace" />);

    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "https://example.com/avatar.png");
    expect(img).toHaveAttribute("alt", "Ada Lovelace");
  });

  it("uses a default alt text when no name is provided", () => {
    render(<Avatar uri="https://example.com/avatar.png" />);

    expect(screen.getByRole("img")).toHaveAttribute("alt", "Avatar");
  });

  it("renders initials instead of an image when no uri is provided", () => {
    render(<Avatar name="Ada Lovelace" />);

    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(screen.getByText("AL")).toBeInTheDocument();
  });

  it("falls back to initials if the image fails to load", () => {
    render(<Avatar uri="https://example.com/broken.png" name="Ada Lovelace" />);

    fireEvent.error(screen.getByRole("img"));

    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(screen.getByText("AL")).toBeInTheDocument();
  });

  it("renders an empty fallback when there is neither uri nor name", () => {
    const { container } = render(<Avatar />);

    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(container.querySelector("div")?.textContent).toBe("");
  });
});