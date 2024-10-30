import { describe, expect, it } from "vitest";
import { Rgba } from "@/engine/math/rgba";

describe("Rgba", () => {
  describe("#toRgbCssString", () => {
    it("should return a valid CSS rgba value", () => {
      expect(new Rgba(1, 2, 3, 4).toRgbCssString()).toEqual(
        "rgb(1 2 3 / 400%)",
      );
    });
  });
});
