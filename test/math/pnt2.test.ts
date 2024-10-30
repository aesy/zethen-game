import { describe, expect, it } from "vitest";
import { Pnt2 } from "@/engine/math/pnt2";

describe("Points", () => {
  describe("#add", () => {
    it("should add each component", () => {
      const point = new Pnt2(3, 5);
      expect(point.add({ x: 1, y: -2 })).toEqual({ x: 4, y: 3 });
    });
  });

  describe("#subtract", () => {
    it("should subtract each component", () => {
      const point = new Pnt2(3, 5);
      expect(point.subtract({ x: 1, y: -2 })).toEqual({ x: 2, y: 7 });
    });
  });

  describe("#distanceTo", () => {
    const point = new Pnt2(3, 5);
    expect(point.distanceTo({ x: 5, y: 5 })).toEqual(2);
    expect(point.distanceTo({ x: 3, y: 2 })).toEqual(3);
    expect(point.distanceTo({ x: 2, y: 4 })).toEqual(Math.sqrt(2));
  });

  describe("#distanceSquared", () => {
    const point = new Pnt2(3, 5);
    expect(point.distanceToSquared({ x: 5, y: 5 })).toEqual(4);
    expect(point.distanceToSquared({ x: 3, y: 2 })).toEqual(9);
  });

  describe("#equals", () => {
    const point = new Pnt2(3, 5);
    expect(point.equals({ x: 3, y: 5 })).toEqual(true);
    expect(point.equals({ x: 3.0001, y: 5.0001 }, 0.001)).toEqual(true);
    expect(point.equals(Pnt2.ORIGIN)).toEqual(false);
  });

  describe("#isZero", () => {
    const point = new Pnt2(3, 5);
    expect(point.isZero()).toEqual(false);
    expect(Pnt2.ORIGIN.isZero()).toEqual(true);
    expect(Pnt2.from({ x: 0.0001, y: 0.0001 }).isZero(0.001)).toEqual(true);
  });
});
