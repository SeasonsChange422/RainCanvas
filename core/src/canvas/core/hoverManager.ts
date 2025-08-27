import { DrawableElement } from "../models/DrawableElement"
import { Point } from "../models/point"
import { OriginPoint, RelativePoint } from "./common"
import { PointManager } from "./pointManager"

export class HoverManager{
    private pointManager:PointManager
    private lastHoverPoint:DrawableElement|null = null
    constructor(pointManager:PointManager){
        this.pointManager = pointManager
    }
    setHover(pos:RelativePoint,origin:OriginPoint,scale:number){
        let point = this.pointManager.findPointNear(pos,origin,scale)
        if(this.lastHoverPoint&&this.lastHoverPoint instanceof Point){
            this.lastHoverPoint.setHover(false)
        }
        if(point){
            point.setHover(true)
        }
        
        this.lastHoverPoint = point
    }
}