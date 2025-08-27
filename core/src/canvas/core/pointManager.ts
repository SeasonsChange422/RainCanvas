import { Point } from "../models/point"
import { RelativePoint } from "./common"
import { OriginPoint } from "./common"

export class PointManager {
    public points:Point[]
    constructor() {
        this.points = []
    }
    addPoint(point:Point){
        this.points.push(point)
    }
    addPoints(points:Point[]){
        this.points.push(...points)
    }
    getPoints(){
        return this.points
    }
    findPointNear(pos:RelativePoint,origin:OriginPoint,scale:number){
        let nearPoints:Point[] = []
        this.points.forEach((point)=>{
            if(point.isNear(pos,origin,scale)){
                nearPoints.push(point)
            }
        })
        if(nearPoints.length==0){
            return null
        }
        return nearPoints.sort((a,b)=>{
            return a.getDistance(pos,origin,scale)-b.getDistance(pos,origin,scale)
        })[0]
    }
}