import { Tool, ToolContext } from "../core/tool";
import { MAX_SCALE, MIN_SCALE, SCALE_STEP } from "../constpool/grid";

function zoomAt(canvas: any, e: WheelEvent) {
    const lastScale = canvas.scale;
    if (e.deltaY > 0) canvas.scale = Math.max(MIN_SCALE, canvas.scale - SCALE_STEP);
    else canvas.scale = Math.min(MAX_SCALE, canvas.scale + SCALE_STEP);
    canvas.originPoint.x = (canvas.originPoint.x - e.offsetX)*canvas.scale/lastScale + e.offsetX;
    canvas.originPoint.y = (canvas.originPoint.y - e.offsetY)*canvas.scale/lastScale + e.offsetY;
}

export const PanTool: Tool = {
    id: "tool-pan",
    cursor: "grab",

    onActivate(ctx:ToolContext) {
        (ctx.canvas.el as any).style.cursor = "grab";
    },

    onPointerDown(e:PointerEvent, ctx:ToolContext) {
        if (e.button !== 0) return;
        (ctx.canvas as any)._panLast = { x: e.offsetX, y: e.offsetY };
        (ctx.canvas.el as any).style.cursor = "grabbing";
    },

    onPointerMove(e:PointerEvent, ctx:ToolContext) {
        const last = (ctx.canvas as any)._panLast;
        if (!last) return;
        ctx.canvas.originPoint.x += e.offsetX - last.x;
        ctx.canvas.originPoint.y += e.offsetY - last.y;
        (ctx.canvas as any)._panLast = { x: e.offsetX, y: e.offsetY };
    },

    onPointerUp(e:PointerEvent, ctx:ToolContext) {
        (ctx.canvas as any)._panLast = null;
        (ctx.canvas.el as any).style.cursor = "grab";
    },

    onWheel(e:WheelEvent, ctx:ToolContext) {
        e.preventDefault();
        zoomAt(ctx.canvas, e);
    },

    onKeyUp(e:KeyboardEvent, ctx:ToolContext) {
        if (e.code === "Space") {
            // 从临时平移恢复到选择
            ctx.setTool("tool-select");
            return;
        }
    }
};
