import { Tool, ToolContext } from "./tool";

export class ToolManager {
    private current: Tool | null = null;
    private tools = new Map<string, Tool>();
    private prevForTempSwitch: string | null = null;

    constructor(private ctx: ToolContext) {}

    register(tool: Tool) {
        this.tools.set(tool.id, tool);
    }

    setTool(id: string) {
        const next = this.tools.get(id);
        if (!next) return;
        if (this.current?.onDeactivate) this.current.onDeactivate(this.ctx);
        this.current = next;
        this.current.onActivate?.(this.ctx);
        if (this.current.cursor) (this.ctx.canvas.el as any).style.cursor = this.current.cursor;
    }

    tempSwitchTo(id: string) {
        const curId = this.current?.id ?? null;
        if (curId === id) return;
        this.prevForTempSwitch = curId;
        this.setTool(id);
    }

    restoreAfterTempSwitch() {
        if (this.prevForTempSwitch) this.setTool(this.prevForTempSwitch);
        this.prevForTempSwitch = null;
    }

    // 事件入口：直接挂到 canvas.el / window
    handlePointerDown = (e: PointerEvent) => this.current?.onPointerDown?.(e, this.ctx);
    handlePointerMove = (e: PointerEvent) => this.current?.onPointerMove?.(e, this.ctx);
    handlePointerUp   = (e: PointerEvent) => this.current?.onPointerUp?.(e, this.ctx);
    handleWheel       = (e: WheelEvent)   => this.current?.onWheel?.(e, this.ctx);
    handleKeyDown     = (e: KeyboardEvent) => this.current?.onKeyDown?.(e, this.ctx);
    handleKeyUp       = (e: KeyboardEvent) => this.current?.onKeyUp?.(e, this.ctx);
}
