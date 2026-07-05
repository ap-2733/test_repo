jest.mock("react-native/Libraries/Interaction/PanResponder", () => ({
  __esModule: true,
  default: {
    create: (config: Record<string, unknown>) => ({
      panHandlers: config,
      getInteractionHandle: () => null,
    }),
  },
}));

import { act, fireEvent, render, screen } from "@testing-library/react-native";
import { ListItem } from "./ListItem";

function findSwipeHandler() {
  const [node] = screen.root!.queryAll(
    (n) => typeof n.props.onPanResponderRelease === "function",
    { includeSelf: true },
  );
  return node;
}

describe("ListItem (native)", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it("renders the name and avatar", async () => {
    await render(
      <ListItem
        id={1}
        name="Ada Lovelace"
        avatarUri="https://example.com/avatar.png"
        onDelete={jest.fn()}
      />,
    );

    expect(screen.getByText("Ada Lovelace")).toBeTruthy();
  });

  it("does not delete on a release below the swipe threshold", async () => {
    const onDelete = jest.fn();
    await render(<ListItem id={1} name="Ada Lovelace" onDelete={onDelete} />);

    await fireEvent(findSwipeHandler(), "onPanResponderRelease", {}, { dx: 40 });

    expect(onDelete).not.toHaveBeenCalled();
  });

  it("deletes the item after a release past the swipe threshold", async () => {
    const onDelete = jest.fn();
    await render(<ListItem id={42} name="Ada Lovelace" onDelete={onDelete} />);

    await fireEvent(
      findSwipeHandler(),
      "onPanResponderRelease",
      {},
      { dx: 200 },
    );

    await act(() => {
      jest.runAllTimers();
    });

    expect(onDelete).toHaveBeenCalledWith(42);
  });

  it("deletes on a large leftward release too", async () => {
    const onDelete = jest.fn();
    await render(<ListItem id={7} name="Ada Lovelace" onDelete={onDelete} />);

    await fireEvent(
      findSwipeHandler(),
      "onPanResponderRelease",
      {},
      { dx: -200 },
    );

    await act(() => {
      jest.runAllTimers();
    });

    expect(onDelete).toHaveBeenCalledWith(7);
  });
});
