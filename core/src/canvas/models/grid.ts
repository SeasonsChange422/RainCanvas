import {OriginPoint} from "../types/common";
import {BORDER_COLOR1, BORDER_COLOR2, GRID_GAP} from "../constpool/grid";
import {CanvasElement} from "./canvasElement";

export class Grid extends CanvasElement{

    constructor(ctx:any) {
        super(ctx);
    }

    draw(originPoint:OriginPoint,scale:number){
        for(let i=originPoint.x,j=0;i<this.ctx._width;i+=scale*GRID_GAP,j++){
            let color = j%5==0?BORDER_COLOR1:BORDER_COLOR2
            this.drawLine(i,0,i,this.ctx._height,color)
        }
        for(let i=originPoint.x,j=0;i>0;i-=scale*GRID_GAP,j++){
            let color = j%5==0?BORDER_COLOR1:BORDER_COLOR2
            this.drawLine(i,0,i,this.ctx._height,color)
        }
        for(let i=originPoint.y,j=0;i<this.ctx._height;i+=scale*GRID_GAP,j++){
            let color = j%5==0?BORDER_COLOR1:BORDER_COLOR2
            this.drawLine(0,i,this.ctx._width,i,color)
        }
        for(let i=originPoint.y,j=0;i>0;i-=scale*GRID_GAP,j++){
            let color = j%5==0?BORDER_COLOR1:BORDER_COLOR2
            this.drawLine(0,i,this.ctx._width,i,color)
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
