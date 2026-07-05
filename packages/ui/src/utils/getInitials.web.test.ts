import { getInitials } from "./getInitials";

describe("getInitials", () => {
  it("returns an empty string when no name is given", () => {
    expect(getInitials()).toBe("");
    expect(getInitials("")).toBe("");
  });

  it("uses the first two letters of a single-word name", () => {
    expect(getInitials("Madonna")).toBe("MA");
  });

  it("uses first + last initials for multi-word names", () => {
    expect(getInitials("Ada Lovelace")).toBe("AL");
  });

  it("uses first + last initials for names with more than two words", () => {
    expect(getInitials("Mary Ann Evans")).toBe("ME");
  });

  it("always returns uppercase letters", () => {
    expect(getInitials("ada lovelace")).toBe("AL");
  });

  it("ignores surrounding and repeated whitespace", () => {
    expect(getInitials("  Ada   Lovelace  ")).toBe("AL");
  });
});