import { stringToColor } from "./stringToColor";

describe("stringToColor", () => {
  it("returns an hsl() color string", () => {
    expect(stringToColor("Ada Lovelace")).toMatch(
      /^hsl\(\d{1,3}, \d{1,2}%, \d{1,2}%\)$/,
    );
  });

  it("is deterministic for the same input", () => {
    expect(stringToColor("Ada Lovelace")).toBe(stringToColor("Ada Lovelace"));
  });

  it("produces different colors for different inputs", () => {
    expect(stringToColor("Ada Lovelace")).not.toBe(
      stringToColor("Grace Hopper"),
    );
  });

  it("keeps saturation within the documented 35-65% range", () => {
    const match = stringToColor("some input")!.match(
      /^hsl\((\d+), (\d+)%, (\d+)%\)$/,
    )!;
    const saturation = Number(match[2]);
    expect(saturation).toBeGreaterThanOrEqual(35);
    expect(saturation).toBeLessThanOrEqual(65);
  });

  it("keeps lightness within the documented 20-35% range", () => {
    const match = stringToColor("some input")!.match(
      /^hsl\((\d+), (\d+)%, (\d+)%\)$/,
    )!;
    const lightness = Number(match[3]);
    expect(lightness).toBeGreaterThanOrEqual(20);
    expect(lightness).toBeLessThanOrEqual(35);
  });

  it("handles an empty string without throwing", () => {
    expect(() => stringToColor("")).not.toThrow();
    expect(stringToColor("")).toMatch(/^hsl\(/);
  });
});