import { describe, expect, it } from "vitest";
import { Point2, Point } from "@/engine/math/point";

describe("Points", () => {
  const point: Point2 = { x: 3, y: 5 };

  describe("#add", () => {
    it("should add each component", () => {
      expect(Point.add(point, { x: 1, y: -2 })).toEqual({ x: 4, y: 3 });
    });
  });

  describe("#subtract", () => {
    it("should subtract each component", () => {
      expect(Point.subtract(point, { x: 1, y: -2 })).toEqual({ x: 2, y: 7 });
    });
  });

  describe("#distance", () => {
    expect(Point.distance(point, { x: 5, y: 5 })).toEqual(2);
    expect(Point.distance(point, { x: 3, y: 2 })).toEqual(3);
    expect(Point.distance(point, { x: 2, y: 4 })).toEqual(Math.sqrt(2));
  });

  describe("#distanceSquared", () => {
    expect(Point.distanceSquared(point, { x: 5, y: 5 })).toEqual(4);
    expect(Point.distanceSquared(point, { x: 3, y: 2 })).toEqual(9);
  });

  describe("#equals", () => {
    expect(Point.equals(point, { x: 3, y: 5 })).toEqual(true);
    expect(Point.equals(point, { x: 3.0001, y: 5.0001 }, 0.001)).toEqual(true);
    expect(Point.equals(point, Point.ORIGIN)).toEqual(false);
  });

  describe("#isZero", () => {
    expect(Point.isZero(point)).toEqual(false);
    expect(Point.isZero(Point.ORIGIN)).toEqual(true);
    expect(Point.isZero({ x: 0.0001, y: 0.0001 }, 0.001)).toEqual(true);
  });
});
