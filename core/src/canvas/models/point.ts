import { HOVER_POINT_COLOR, HOVER_POINT_RADIUS, POINT_COLOR, POINT_RADIUS } from "../constpool/point";
import { DrawableElement } from "./DrawableElement";
import { OriginPoint, RelativePoint } from "../core/common";

export class Point extends DrawableElement{
    protected x:number
    protected y:number
    protected hover:boolean = false
    constructor(ctx:CanvasRenderingContext2D,x:number,y:number){
        super(ctx)
        this.x = x
        this.y = y
    }
    setHover(hover:boolean){
        this.hover = hover
    }
    draw(originPoint: OriginPoint, scale: number): void {
        this.ctx.fillStyle = this.hover?HOVER_POINT_COLOR:POINT_COLOR
        this.ctx.beginPath()
        this.ctx.arc(originPoint.x+this.x*scale,originPoint.y+this.y*scale,POINT_RADIUS*scale,0,2*Math.PI)
        this.ctx.fill()
    }
    isNear(testPoint: RelativePoint,originPoint: OriginPoint, scale: number): boolean {
        let point:RelativePoint = {
            x:this.x*scale+originPoint.x,
            y:this.y*scale+originPoint.y
        }
        let hoverRadius = HOVER_POINT_RADIUS*scale
        return testPoint.x>=point.x-hoverRadius&&testPoint.x<=point.x+hoverRadius&&testPoint.y>=point.y-hoverRadius&&testPoint.y<=point.y+hoverRadius
    }
    getX(){
        return this.x
    }
    getY(){
        return this.y
    }
    getDistance(testPoint: RelativePoint,originPoint: OriginPoint, scale: number): number {
        let point:RelativePoint = {
            x:this.x*scale+originPoint.x,
            y:this.y*scale+originPoint.y
        }
        return Math.sqrt(Math.pow(testPoint.x-point.x,2)+Math.pow(testPoint.y-point.y,2))
    }
    move(dx:number,dy:number){
        this.x += dx
        this.y += dy
    }
}
