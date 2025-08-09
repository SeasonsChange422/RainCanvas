import {CanvasElement} from "./canvasElement";
import {OriginPoint, RelativePoint} from "../core/common";
import {RectBorder, ShapeOptions, ShapePoint} from "../core/shape";
import {BORDER_COLOR} from "../constpool/shape";
import {getRectBorder} from "../utils/shapeUtil";

export class Shape extends CanvasElement{
    protected points:ShapePoint[]
    protected isClose:boolean
    protected isFill:boolean
    protected fillColor:string
    protected strokeColor:string
    protected isSelected:boolean = false
    private index = 0
    constructor(ctx:any,points:ShapePoint[],options:ShapeOptions) {
        super(ctx);
        this.points = points
        this.isClose = options.isClose || false
        this.isFill = options.isFill || false
        this.fillColor = options.fillColor || 'rgb(255,255,255)'
        this.strokeColor = options.strokeColor || 'rgb(0,0,0)'
    }
    isInArea(startPoint:RelativePoint,endPoint:RelativePoint,originPoint:OriginPoint,scale:number):boolean{
        let ret = true
        this.points.map((point)=>{
            return {
                x:originPoint.x + point.x * scale,
                y:originPoint.y + point.y * scale
            }
        }).forEach((point)=>{
            if( point.x<Math.min(startPoint.x,endPoint.x)||
                point.x>Math.max(startPoint.x,endPoint.x)||
                point.y<Math.min(startPoint.y,endPoint.y)||
                point.y>Math.max(startPoint.y,endPoint.y)){
                ret = false
            }
        })
        return ret
    }
    isPointInside(testPoint: RelativePoint, originPoint: OriginPoint, scale: number): boolean {
        if (!this.isClose){
            let rectBorder:RectBorder = getRectBorder(this.points)
            if( originPoint.x + rectBorder.minX*scale<=testPoint.x&&
                originPoint.x + rectBorder.maxX*scale>=testPoint.x&&
                originPoint.y + rectBorder.minY*scale<=testPoint.y&&
                originPoint.y + rectBorder.maxY*scale>=testPoint.y){
                return true
            }
            return false
        }
        const transformedPoints = this.points.map(p => ({
            x: originPoint.x + p.x * scale,
            y: originPoint.y + p.y * scale
        }));
        let inside = false;
        const n = transformedPoints.length;
        for (let i = 0, j = n - 1; i < n; j = i++) {
            const pi = transformedPoints[i];
            const pj = transformedPoints[j];
            // 检查点是否在顶点上
            if (pi.x === testPoint.x && pi.y === testPoint.y) {
                return true;
            }
            // 检查射线是否穿过边
            const intersectY = (pi.y > testPoint.y) !== (pj.y > testPoint.y);
            const intersectX = testPoint.x < (pj.x - pi.x) *
                (testPoint.y - pi.y) / (pj.y - pi.y) + pi.x;

            if (intersectY && intersectX) {
                inside = !inside;
            }
        }
        return inside;
    }

    select(){
        this.isSelected = true
    }
    unselect(){
        this.isSelected = false
    }

    draw(originPoint: OriginPoint, scale: number) {
        let points:ShapePoint[] = this.points.map((point)=> {
            return {
                    x: originPoint.x + point.x * scale,
                    y: originPoint.y + point.y * scale
                }
            }
        )
        this.ctx.beginPath()
        this.ctx.fillStyle = this.fillColor
        this.ctx.strokeStyle = this.isSelected&&this.isClose?BORDER_COLOR:this.strokeColor
        points.forEach((point,index)=>{
            if(index===0){
                this.ctx.moveTo(point.x,point.y)
            } else {
                this.ctx.lineTo(point.x,point.y)
            }
        })
        this.isClose&&this.ctx.closePath()
        this.isFill&&this.ctx.fill()
        this.ctx.stroke()
        this.isSelected&&!this.isClose&&this.drawBorder(points)

    }
    drawBorder(points:ShapePoint[]){
        this.index=(this.index++)%23
        let rectBorder:RectBorder = getRectBorder(points)
        this.ctx.strokeStyle = BORDER_COLOR
        this.ctx.strokeRect(rectBorder.minX, rectBorder.minY, rectBorder.maxX-rectBorder.minX, rectBorder.maxY-rectBorder.minY)
    }
    move(offsetX:number,offsetY:number){
        this.points = this.points.map((point)=>{
            point.x += offsetX
            point.y += offsetY
            return point
        })
    }
}
