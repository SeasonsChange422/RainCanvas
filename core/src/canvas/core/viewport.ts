import { OriginPoint, RelativePoint } from "./common";
import { MAX_SCALE, MIN_SCALE, SCALE_STEP } from "../constpool/grid";

/**
 * Viewport 负责：
 * - 统一的仿射变换（目前仅使用 uniform scale + translation）
 * - screen <-> world 坐标转换
 * - 平移/缩放（支持以屏幕点为中心缩放）
 */
export class Viewport {
    private matrix: DOMMatrix;
    private readonly minScale: number;
    private readonly maxScale: number;
    private readonly step: number;

    constructor(options?: {
        scale?: number;
        origin?: OriginPoint; // 旧语义中的 originPoint（屏幕上的平移分量）
        minScale?: number;
        maxScale?: number;
        step?: number;
    }) {
        const scale = options?.scale ?? 1;
        const origin = options?.origin ?? { x: 0, y: 0 };
        this.minScale = options?.minScale ?? MIN_SCALE;
        this.maxScale = options?.maxScale ?? MAX_SCALE;
        this.step = options?.step ?? SCALE_STEP;

        this.matrix = new DOMMatrix([
            scale, 0,
            0, scale,
            origin.x, origin.y
        ]);
    }

    // 只读获取当前缩放
    get scale(): number {
        return this.matrix.a;
    }

    // 获取平移（屏幕坐标中的偏移量）
    get origin(): OriginPoint {
        return { x: this.matrix.e, y: this.matrix.f };
    }

    // 设置缩放（以左上角(0,0)为基准，不维护某点不动）
    setScaleUnsafe(newScale: number) {
        const s = this.clampScale(newScale);
        // 保持平移不变，更新缩放
        this.matrix = new DOMMatrix([s, 0, 0, s, this.matrix.e, this.matrix.f]);
    }

    // 在屏幕点处缩放一步（基于常量步长），dir: 1=放大，-1=缩小
    zoomAtStep(screenPoint: RelativePoint, dir: 1 | -1) {
        const oldScale = this.scale;
        const newScale = this.clampScale(oldScale + dir * this.step);
        this.zoomToAt(screenPoint, newScale);
    }

    // 在屏幕点处缩放到指定倍数（保持该屏幕点在缩放前后位置不变）
    zoomToAt(screenPoint: RelativePoint, newScale: number) {
        const sOld = this.scale;
        const sNew = this.clampScale(newScale);
        if (sNew === sOld) return;

        // t' = (t - p) * sNew/sOld + p
        const ratio = sNew / sOld;
        const tOldX = this.matrix.e;
        const tOldY = this.matrix.f;
        const px = screenPoint.x;
        const py = screenPoint.y;

        const tNewX = (tOldX - px) * ratio + px;
        const tNewY = (tOldY - py) * ratio + py;

        this.matrix = new DOMMatrix([sNew, 0, 0, sNew, tNewX, tNewY]);
    }

    // 平移屏幕（以像素为单位）
    panBy(dx: number, dy: number) {
        this.matrix = new DOMMatrix([this.scale, 0, 0, this.scale, this.matrix.e + dx, this.matrix.f + dy]);
    }

    // 坐标转换
    worldToScreen(p: RelativePoint): RelativePoint {
        // screen = S * world + T
        return {
            x: this.matrix.a * p.x + this.matrix.e,
            y: this.matrix.d * p.y + this.matrix.f,
        };
    }

    screenToWorld(p: RelativePoint): RelativePoint {
        const s = this.scale;
        return {
            x: (p.x - this.matrix.e) / s,
            y: (p.y - this.matrix.f) / s,
        };
    }

    private clampScale(s: number) {
        return Math.max(this.minScale, Math.min(this.maxScale, s));
    }
}
