import {Shape} from "./shape";
import {ShapeOptions, ShapePoint} from "../core/shape";
import {OriginPoint, RelativePoint} from "../core/common";

export class SelectArea extends Shape{
    public startPoint:ShapePoint
    public endPoint:ShapePoint
    constructor(ctx:any,startPoint:ShapePoint,options:ShapeOptions) {
        super(ctx,[],options);
        this.startPoint = startPoint
        this.endPoint = startPoint
    }
    setEndPoint(endPoint:ShapePoint){
        this.endPoint = endPoint
    }
    isPointInside(testPoint: RelativePoint, originPoint: OriginPoint, scale: number): boolean {
        return false
    }
    draw(originPoint: OriginPoint, scale: number) {
        let point1 = this.startPoint
        let point2 = this.endPoint
        if(point1===point2)return
        this.ctx.fillStyle = this.fillColor
        this.ctx.fillRect(point1.x, point1.y, point2.x - point1.x, point2.y - point1.y)
    }
}
