import { Rect, RectLike } from "@/engine/math/rect";
import { Pnt2Like } from "@/engine/math/pnt2";

export type QuadTreeConfig = {
  capacity: number;
  maximumDepth: number;
};

export type QuadTreeFunctions<T> = {
  contains(rect: Readonly<RectLike>, elem: T): boolean;
};

const DEFAULT_CONFIG: Readonly<QuadTreeConfig> = {
  capacity: 4,
  maximumDepth: -1,
};

export class QuadTree<T> {
  private elements: Readonly<T>[] = [];
  private children:
    | [
        QuadTree<T>, // NE
        QuadTree<T>, // NW
        QuadTree<T>, // SW
        QuadTree<T>, // SE
      ]
    | null = null;

  constructor(
    public readonly bounds: Readonly<RectLike>,
    public readonly config: Readonly<QuadTreeConfig> = DEFAULT_CONFIG,
    private readonly functions: Readonly<QuadTreeFunctions<T>>,
  ) {}

  public static forPoints<T extends Pnt2Like = Pnt2Like>(
    bounds: Readonly<RectLike>,
    config: Readonly<QuadTreeConfig> = DEFAULT_CONFIG,
  ): QuadTree<T> {
    return new QuadTree<T>(bounds, config, {
      contains: Rect.containsPoint,
    });
  }

  public static forRects<T extends RectLike = RectLike>(
    bounds: Readonly<RectLike>,
    config: Readonly<QuadTreeConfig> = DEFAULT_CONFIG,
  ): QuadTree<T> {
    return new QuadTree<T>(bounds, config, {
      contains: Rect.overlapsRect,
    });
  }

  public getElements(): Readonly<T>[] {
    if (this.children) {
      return this.children.flatMap((q) => q.getElements());
    }

    return this.elements;
  }

  public getChildren(): QuadTree<T>[] {
    return this.children ?? [];
  }

  public getNodes(): QuadTree<T>[] {
    const nodes: QuadTree<T>[] = [this];

    for (const child of this.getChildren()) {
      nodes.push(...child.getNodes());
    }

    return nodes;
  }

  public getLeafNodes(): QuadTree<T>[] {
    const nodes: QuadTree<T>[] = [];

    if (this.isLeafNode()) {
      nodes.push(this);
    }

    for (const child of this.getChildren()) {
      nodes.push(...child.getLeafNodes());
    }

    return nodes;
  }

  public isLeafNode(): boolean {
    return this.children === null;
  }

  public contains(elem: Readonly<T>): boolean {
    if (!this.functions.contains(this.bounds, elem)) {
      return false;
    }

    if (this.children) {
      return this.children.some((q) => q.contains(elem));
    }

    return this.elements.includes(elem);
  }

  public remove(elem: Readonly<T>): boolean {
    if (!this.functions.contains(this.bounds, elem)) {
      return false;
    }

    if (this.children) {
      const removed = this.children.reduce(
        (prev, q) => prev || q.remove(elem),
        false,
      );

      if (removed && this.children.every((q) => q.isEmpty())) {
        this.children = null;
      }

      return removed;
    }

    const index = this.elements.indexOf(elem);

    if (index > -1) {
      this.elements.splice(index, 1);
      return true;
    }

    return false;
  }

  public insert(elem: Readonly<T>): boolean {
    if (!this.functions.contains(this.bounds, elem)) {
      return false;
    }

    if (this.children) {
      return this.children.reduce((prev, q) => q.insert(elem) || prev, false);
    }

    if (
      this.elements.length < this.config.capacity ||
      this.config.maximumDepth === 0
    ) {
      this.elements.push(elem);
      return true;
    } else if (
      this.config.maximumDepth === -1 ||
      this.config.maximumDepth > 0
    ) {
      this.divide();
    }

    return false;
  }

  public query(bounds: Readonly<RectLike>): T[] {
    if (!Rect.overlapsRect(this.bounds, bounds)) {
      return [];
    }

    if (this.children) {
      return this.children.flatMap((q) => q.query(bounds));
    }

    return this.elements.filter((elem) =>
      this.functions.contains(bounds, elem),
    );
  }

  public clear(): void {
    this.elements = [];
    this.children = null;
  }

  private isEmpty(): boolean {
    return this.children === null && this.elements.length === 0;
  }

  private divide(): void {
    const maximumDepth =
      this.config.maximumDepth === -1 ? -1 : this.config.maximumDepth - 1;
    const config = { ...this.config, maximumDepth };

    const x = this.bounds.x;
    const y = this.bounds.y;
    const width = this.bounds.width / 2;
    const height = this.bounds.height / 2;

    this.children = [
      new QuadTree({ x: x + width, y, width, height }, config, this.functions),
      new QuadTree({ x, y, width, height }, config, this.functions),
      new QuadTree({ x, y: y + height, width, height }, config, this.functions),
      new QuadTree(
        { x: x + width, y: y + height, width, height },
        config,
        this.functions,
      ),
    ];

    for (const element of this.elements.splice(0)) {
      for (const child of this.children) {
        child.insert(element);
      }
    }
  }
}
