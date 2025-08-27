import {Shape} from "../models/shape";
import {OriginPoint, RelativePoint} from "./common";

export class ShapeManager {
    public shapes:Shape[]
    public copyShapes:Shape[]
    constructor(shapes:Shape[]) {
        this.shapes = shapes
        this.copyShapes = []
    }
    addShape(shape:Shape){
        this.shapes.push(shape)
    }
    addShapes(shapes:Shape[]){
        this.shapes.push(...shapes)
    }
    getShapes(){
        return this.shapes
    }
    deleteShapes(shapes:Shape[]){
        const idsToDelete = new Set(shapes.map((shape:Shape) => shape.id));
        this.shapes = this.shapes.filter((shape)=>{
            return !idsToDelete.has(shape.id)
        })
    }
    indexDescArr(shapes:Shape[]){
        return shapes.map((shape)=>{
            return this.shapes.indexOf(shape)
        }).sort((a:number,b:number)=>{
            return b-a
        })
    }
    deleteShape(index:number){
        this.shapes.splice(index,1)
    }
    undelete(index:number,shape:Shape){
        this.shapes.splice(index,0,shape)
    }
    getShape(index:number){
        return this.shapes[index]
    }
    copy(shapes:Shape[]){
        shapes.forEach((shape)=>{
            shape.generalId()
        })
        this.copyShapes = shapes
    }
    paste(shapes:Shape[]){
        shapes.forEach((shape)=>{
            shape.unselect()
        })
        this.shapes.unshift(...shapes)
    }
    findShapeAt(pos:RelativePoint,origin:OriginPoint,scale:number) {
        for (let i = this.shapes.length - 1; i >= 0; i--) {
            if (this.shapes[i].isPointInside(pos,origin,scale)) {
                return this.shapes[i];
            }
        }
        return null;
    }
    draw(origin:OriginPoint,scale:number){
        this.shapes.forEach(shape => shape.draw(origin, scale));
    }
}
