import { describe, it, expect } from "vitest";
import { slugify, readingTime, wordCount } from "../utils";

describe("slugify", () => {
  it("lowercases and hyphenates", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });
  it("removes special chars", () => {
    expect(slugify("What's Next?")).toBe("whats-next");
  });
});

describe("readingTime", () => {
  it("returns at least 1 min", () => {
    expect(readingTime(0)).toBe(1);
  });
  it("rounds up 200 words to 1 min", () => {
    expect(readingTime(200)).toBe(1);
  });
  it("rounds 250 words to 2 min", () => {
    expect(readingTime(250)).toBe(2);
  });
});

describe("wordCount", () => {
  it("counts words", () => {
    expect(wordCount("one two three")).toBe(3);
  });
  it("ignores extra spaces", () => {
    expect(wordCount("  one   two  ")).toBe(2);
  });
});
