import { bind } from "@/engine/util/bind";
import { Pnt2, Pnt2Like } from "@/engine/math/pnt2";

export class InputManager {
  private readonly mousePosition: Pnt2Like;
  private readonly pressedKeys: Map<string, boolean>;

  constructor() {
    this.mousePosition = Pnt2.zero();
    this.pressedKeys = new Map();

    window.addEventListener("mousemove", this.handleMouseMove);
    window.addEventListener("mousedown", this.handleMouseDown);
    window.addEventListener("mouseup", this.handleMouseUp);
    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);
  }

  public getMousePosition(): Readonly<Pnt2Like> {
    return this.mousePosition;
  }

  public isKeyPressed(key: string): boolean {
    return this.pressedKeys.get(key) ?? false;
  }

  public dispose(): void {
    window.removeEventListener("mousemove", this.handleMouseMove);
    window.removeEventListener("mousedown", this.handleMouseDown);
    window.removeEventListener("mouseup", this.handleMouseUp);
    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("keyup", this.handleKeyUp);
  }

  @bind
  private handleMouseMove(event: MouseEvent): void {
    this.mousePosition.x = event.x;
    this.mousePosition.y = event.y;
  }

  @bind
  private handleMouseDown(event: MouseEvent): void {
    if (event.buttons === 1) {
      this.pressedKeys.set("M1", true);
    } else {
      this.pressedKeys.set("M2", true);
    }
  }

  @bind
  private handleMouseUp(event: MouseEvent): void {
    if (event.buttons === 1) {
      this.pressedKeys.set("M1", false);
    } else {
      this.pressedKeys.set("M2", false);
    }
  }

  @bind
  private handleKeyDown(event: KeyboardEvent): void {
    this.pressedKeys.set(event.key, true);
  }

  @bind
  private handleKeyUp(event: KeyboardEvent): void {
    this.pressedKeys.set(event.key, false);
  }
}
