import { RectLike } from "@/engine/math/rect";

export type UIElement = {
  anchor?: "topLeft" | "topRight" | "bottomLeft" | "bottomRight";
  flow?: "horizontal" | "vertical";
  wrapping?: boolean;
  children: UIElement[];

  getBounds(): RectLike;
};
