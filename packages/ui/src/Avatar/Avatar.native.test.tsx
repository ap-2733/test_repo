import { render, screen, fireEvent } from "@testing-library/react-native";
import { Avatar } from "./Avatar";

function queryImages() {
  return screen.root!.queryAll((node) => node.type === "Image", {
    includeSelf: true,
  });
}

describe("Avatar (native)", () => {
  it("renders an image when a uri is provided", async () => {
    await render(
      <Avatar uri="https://example.com/avatar.png" name="Ada Lovelace" />,
    );

    const images = queryImages();
    expect(images).toHaveLength(1);
    expect(images[0].props.source).toEqual({
      uri: "https://example.com/avatar.png",
    });
  });

  it("renders initials instead of an image when no uri is provided", async () => {
    await render(<Avatar name="Ada Lovelace" />);

    expect(queryImages()).toHaveLength(0);
    expect(screen.getByText("AL")).toBeTruthy();
  });

  it("falls back to initials if the image fails to load", async () => {
    await render(
      <Avatar uri="https://example.com/broken.png" name="Ada Lovelace" />,
    );

    await fireEvent(queryImages()[0], "onError");

    expect(queryImages()).toHaveLength(0);
    expect(screen.getByText("AL")).toBeTruthy();
  });

  it("renders empty initials when there is neither uri nor name", async () => {
    await render(<Avatar />);

    expect(queryImages()).toHaveLength(0);
    expect(screen.queryByText(/./)).toBeNull();
  });
});
