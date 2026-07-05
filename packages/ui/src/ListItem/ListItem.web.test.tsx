import { act, fireEvent, render, screen } from "@testing-library/react";
import { ListItem } from "./ListItem";

function drag(foreground: HTMLElement, startX: number, endX: number) {
  fireEvent.pointerDown(foreground, { clientX: startX });
  fireEvent.pointerMove(window, { clientX: endX });
  fireEvent.pointerUp(window, { clientX: endX });
}

describe("ListItem (web)", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders the name and avatar", () => {
    render(
      <ListItem
        id={1}
        name="Ada Lovelace"
        avatarUri="https://example.com/avatar.png"
        onDelete={jest.fn()}
      />,
    );

    expect(screen.getByText("Ada Lovelace")).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute(
      "src",
      "https://example.com/avatar.png",
    );
  });

  it("springs back and does not delete on a short drag", () => {
    const onDelete = jest.fn();
    render(<ListItem id={1} name="Ada Lovelace" onDelete={onDelete} />);

    const foreground = screen.getByText("Ada Lovelace").parentElement!;

    drag(foreground, 0, 40);

    expect(foreground.style.transform).toBe("translateX(0px)");

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(onDelete).not.toHaveBeenCalled();
  });

  it("deletes the item after a drag past the swipe threshold", () => {
    const onDelete = jest.fn();
    render(<ListItem id={42} name="Ada Lovelace" onDelete={onDelete} />);

    const foreground = screen.getByText("Ada Lovelace").parentElement!;

    drag(foreground, 0, 200);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(onDelete).toHaveBeenCalledWith(42);
  });

  it("deletes on a large leftward drag too", () => {
    const onDelete = jest.fn();
    render(<ListItem id={7} name="Ada Lovelace" onDelete={onDelete} />);

    const foreground = screen.getByText("Ada Lovelace").parentElement!;

    drag(foreground, 0, -200);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(onDelete).toHaveBeenCalledWith(7);
  });
});