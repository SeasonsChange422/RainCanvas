import {OriginPoint} from "../core/common";
import {BORDER_COLOR1, BORDER_COLOR2, GRID_GAP} from "../constpool/grid";
import {CanvasElement} from "./canvasElement";

export class Grid extends CanvasElement{

    constructor(ctx:any) {
        super(ctx);
    }

    draw(origin:OriginPoint,scale:number){
        const gap = scale * GRID_GAP;
        const w = this.ctx.canvas.width, h = this.ctx.canvas.height;
        for (let x = origin.x % gap; x < w; x += gap) {
            const globalIndex = Math.floor((x - origin.x) / gap + 0.5);
            const color = Math.abs(globalIndex) % 5 === 0 ? BORDER_COLOR1 : BORDER_COLOR2;
            this.drawLine(x, 0, x, h, color);
        }
        for (let x = (origin.x % gap) - gap; x >= 0; x -= gap) {
            const globalIndex = Math.floor((x - origin.x) / gap + 0.5);
            const color = Math.abs(globalIndex) % 5 === 0 ? BORDER_COLOR1 : BORDER_COLOR2;
            this.drawLine(x, 0, x, h, color);
        }
        for (let y = origin.y % gap; y < h; y += gap) {
            const globalIndex = Math.floor((y - origin.y) / gap + 0.5);
            const color = Math.abs(globalIndex) % 5 === 0 ? BORDER_COLOR1 : BORDER_COLOR2;
            this.drawLine(0, y, w, y, color);
        }
        for (let y = (origin.y % gap) - gap; y >= 0; y -= gap) {
            const globalIndex = Math.floor((y - origin.y) / gap + 0.5);
            const color = Math.abs(globalIndex) % 5 === 0 ? BORDER_COLOR1 : BORDER_COLOR2;
            this.drawLine(0, y, w, y, color);
        }
    }
    private drawLine(startX:number,startY:number,endX:number,endY:number,color:string){
        let oldColor = this.ctx.strokeStyle
        this.ctx.beginPath()
        this.ctx.moveTo(startX,startY)
        this.ctx.lineTo(endX,endY)
        this.ctx.strokeStyle = color
        this.ctx.stroke()
        this.ctx.strokeStyle = oldColor
    }
}
