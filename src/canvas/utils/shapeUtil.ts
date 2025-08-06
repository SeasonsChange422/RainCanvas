import {RectBorder, ShapePoints} from "../types/shape";

export function getRectBorder(points:ShapePoints[]):RectBorder{
    let ret:RectBorder = {minX:Infinity,minY:Infinity,maxX:-Infinity,maxY:-Infinity}
    points.forEach((point)=>{
        ret.minX = Math.min(ret.minX,point.x)
        ret.minY = Math.min(ret.minY,point.y)
        ret.maxX = Math.max(ret.maxX,point.x)
        ret.maxY = Math.max(ret.maxY,point.y)
    })
    return ret
}
