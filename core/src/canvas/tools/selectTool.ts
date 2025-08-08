import { Tool, ToolContext } from "../core/tool";
import { Shape } from "../models/shape";
import { SelectArea } from "../models/selectArea";
import { SELECT_AREA_COLOR } from "../constpool/shape";
import { MAX_SCALE, MIN_SCALE, SCALE_STEP } from "../constpool/grid";

function zoomAt(canvas: any, e: WheelEvent) {
    const lastScale = canvas.scale;
    if (e.deltaY > 0) {
        canvas.scale = Math.max(MIN_SCALE, canvas.scale - SCALE_STEP);
    } else {
        canvas.scale = Math.min(MAX_SCALE, canvas.scale + SCALE_STEP);
    }
    canvas.originPoint.x = (canvas.originPoint.x - e.offsetX)*canvas.scale/lastScale + e.offsetX;
    canvas.originPoint.y = (canvas.originPoint.y - e.offsetY)*canvas.scale/lastScale + e.offsetY;
}

type Mode = "idle" | "drag" | "pan" | "area";

export const SelectTool: Tool = {
    id: "tool-select",
    cursor: "default",

    onActivate(ctx:ToolContext) {
        // 可选：高亮工具栏
    },

    onPointerDown(e:PointerEvent, ctx:ToolContext) {
        const canvas = ctx.canvas;
        const pos = { x: e.offsetX, y: e.offsetY };
        const shape: Shape | null = canvas.findShapeAt(pos);

        // Shift => 框选；Ctrl/Meta(Mac) => 多选切换
        const isShift = e.shiftKey;
        const isMulti = e.ctrlKey || e.metaKey;

        // if (e.button === 2) {
        //     if (shape) canvas.selectionManager.singleSelect(shape);
        //     // 右键菜单
        //     return;
        // }
        if (isShift) {
            // 开始框选
            canvas.selectArea = new SelectArea(canvas.ctx, pos, { fillColor: SELECT_AREA_COLOR });
            (canvas as any)._mode = "area" as Mode;
            return;
        }

        if (shape) {
            if (isMulti) {
                canvas.selectionManager.toggle(shape);
            } else {
                if (canvas.selectionManager.singleShape()) {
                    canvas.selectionManager.singleSelect(shape);
                }
                if (!canvas.selectionManager.has(shape)) {
                    canvas.selectionManager.singleSelect(shape);
                }
            }
            // 开始拖拽
            (canvas as any)._mode = "drag" as Mode;
            (canvas as any)._lastPt = pos;
            canvas.selectionManager.beginMove();
        } else {
            // 点击空白：清除选择并开始平移
            if (e.button === 0) {
                canvas.selectionManager.clear();
                (canvas as any)._mode = "pan" as Mode;
                (canvas as any)._lastPt = pos;
            }
        }
    },

    onPointerMove(e:PointerEvent, ctx:ToolContext) {
        const canvas = ctx.canvas;
        const mode: Mode = (canvas as any)._mode || "idle";
        if (mode === "drag") {
            const last = (canvas as any)._lastPt;
            const dx = (e.offsetX - last.x) / canvas.scale;
            const dy = (e.offsetY - last.y) / canvas.scale;
            canvas.selectionManager.move(dx, dy);
            (canvas as any)._lastPt = { x: e.offsetX, y: e.offsetY };
        } else if (mode === "pan") {
            const last = (canvas as any)._lastPt;
            canvas.originPoint.x += e.offsetX - last.x;
            canvas.originPoint.y += e.offsetY - last.y;
            (canvas as any)._lastPt = { x: e.offsetX, y: e.offsetY };
        } else if (mode === "area") {
            canvas.selectArea?.setEndPoint({ x: e.offsetX, y: e.offsetY });
        }
    },

    onPointerUp(e:PointerEvent, ctx:ToolContext) {
        const canvas = ctx.canvas;
        const mode: Mode = (canvas as any)._mode || "idle";
        if (mode === "drag") {
            canvas.selectionManager.stopMove();
        } else if (mode === "area") {
            const start = (canvas.selectArea as any)?.startPoint || null;
            const end = { x: e.offsetX, y: e.offsetY };
            if (start) {
                canvas.selectionManager.selectArea(start, end, canvas.shapes, canvas.originPoint, canvas.scale);
            }
            canvas.selectArea = null;
        }
        (canvas as any)._mode = "idle";
    },

    onWheel(e:WheelEvent, ctx:ToolContext) {
        e.preventDefault();
        zoomAt(ctx.canvas, e);
    },

    onKeyDown(e:KeyboardEvent, ctx:ToolContext) {
        const canvas = ctx.canvas;
        // Space 临时平移
        if (e.code === "Space") {
            ctx.setTool("tool-pan");
            return;
        }
        // 撤销/重做
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
            canvas.commandManager.undo();
            return;
        }
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") {
            (canvas.commandManager as any).redo?.();
            return;
        }

        // 方向键微移
        let dx = 0, dy = 0;
        switch (e.key) {
            case "ArrowLeft":  dx = -1; break;
            case "ArrowRight": dx =  1; break;
            case "ArrowUp":    dy = -1; break;
            case "ArrowDown":  dy =  1; break;
        }
        if (dx || dy) {
            canvas.selectionManager.move(dx, dy);
        }
    },

    onKeyUp(e:KeyboardEvent, ctx:ToolContext) {
        const canvas = ctx.canvas;

        // 结束键盘微移的批量历史
        if (["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(e.key)) {
            canvas.selectionManager.stopMove();
        }
        if (e.key === "Shift") {
            canvas.selectArea = null;
        }
    },
};
