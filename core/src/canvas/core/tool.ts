import { Canvas } from "../models/canvas";

export interface ToolContext {
    canvas: Canvas;
    // 允许工具临时切换（如按 Space 切到平移，再松开切回）
    setTool: (id: string) => void;
}

export interface Tool {
    id: string;
    cursor?: string;
    onActivate?(ctx: ToolContext): void;
    onDeactivate?(ctx: ToolContext): void;
    onPointerDown?(e: PointerEvent, ctx: ToolContext): void;
    onPointerMove?(e: PointerEvent, ctx: ToolContext): void;
    onPointerUp?(e: PointerEvent, ctx: ToolContext): void;
    onWheel?(e: WheelEvent, ctx: ToolContext): void;
    onKeyDown?(e: KeyboardEvent, ctx: ToolContext): void;
    onKeyUp?(e: KeyboardEvent, ctx: ToolContext): void;
}
