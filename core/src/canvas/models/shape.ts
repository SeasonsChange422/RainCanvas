import {DrawableElement} from "./DrawableElement";
import {OriginPoint, RelativePoint} from "../core/common";
import {RectBorder, ShapeOptions, ShapePoint} from "../core/shape";
import {BORDER_COLOR} from "../constpool/shape";
import {getRectBorder} from "../utils/shapeUtil";
import { Point } from "./point";

export class Shape extends DrawableElement{
    protected shapePoints:ShapePoint[]
    protected points:Point[]
    protected isClose:boolean
    protected isFill:boolean
    protected fillColor:string
    protected strokeColor:string
    protected isSelected:boolean = false
    constructor(ctx:CanvasRenderingContext2D,shapePoints:ShapePoint[],options:ShapeOptions) {
        super(ctx);
        this.shapePoints = shapePoints
        this.points = shapePoints.map((point)=>{
            return new Point(ctx,point.x,point.y)
        })
        this.isClose = options.isClose || false
        this.isFill = options.isFill || false
        this.fillColor = options.fillColor || 'rgb(255,255,255)'
        this.strokeColor = options.strokeColor || 'rgb(0,0,0)'
    }
    getPoints(){
        return this.points
    }
    isInArea(startPoint:RelativePoint,endPoint:RelativePoint,originPoint:OriginPoint,scale:number):boolean{
        let ret = true
        this.shapePoints.map((point)=>{
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
            let rectBorder:RectBorder = getRectBorder(this.shapePoints)
            if( originPoint.x + rectBorder.minX*scale<=testPoint.x&&
                originPoint.x + rectBorder.maxX*scale>=testPoint.x&&
                originPoint.y + rectBorder.minY*scale<=testPoint.y&&
                originPoint.y + rectBorder.maxY*scale>=testPoint.y){
                return true
            }
            return false
        }
        const transformedshapePoints = this.shapePoints.map(p => ({
            x: originPoint.x + p.x * scale,
            y: originPoint.y + p.y * scale
        }));
        let inside = false;
        const n = transformedshapePoints.length;
        for (let i = 0, j = n - 1; i < n; j = i++) {
            const pi = transformedshapePoints[i];
            const pj = transformedshapePoints[j];
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
        let shapePoints:ShapePoint[] = this.shapePoints.map((point)=> {
            return {
                    x: originPoint.x + point.x * scale,
                    y: originPoint.y + point.y * scale
                }
            }
        )
        this.ctx.beginPath()
        this.ctx.fillStyle = this.fillColor
        this.ctx.strokeStyle = this.isSelected&&this.isClose?BORDER_COLOR:this.strokeColor
        shapePoints.forEach((point,index)=>{
            if(index===0){
                this.ctx.moveTo(point.x,point.y)
            } else {
                this.ctx.lineTo(point.x,point.y)
            }
        })
        this.isClose&&this.ctx.closePath()
        this.isFill&&this.ctx.fill()
        this.ctx.stroke()
        this.isSelected&&!this.isClose&&this.drawBorder()
        this.isSelected&&this.drawPoint(originPoint,scale) 

    }
    drawBorder(){
        let rectBorder:RectBorder = getRectBorder(this.shapePoints)
        this.ctx.strokeStyle = BORDER_COLOR
        this.ctx.strokeRect(rectBorder.minX, rectBorder.minY, rectBorder.maxX-rectBorder.minX, rectBorder.maxY-rectBorder.minY)
    }
    drawPoint(originPoint:OriginPoint,scale:number){
        this.points.forEach((point)=>{
            point.draw(originPoint,scale)
        })
    }

    move(offsetX:number,offsetY:number){
        this.shapePoints = this.shapePoints.map((point)=>{
            point.x += offsetX
            point.y += offsetY
            return point
        })
        this.points.forEach((point)=>{
            point.move(offsetX,offsetY)
        })
    }
}
