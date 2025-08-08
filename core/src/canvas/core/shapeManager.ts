import {Shape} from "../models/shape";

export class ShapeManager {
    private shapes:Shape[]
    constructor(shapes:Shape[]) {
        this.shapes = shapes
    }
    deleteShapes(shapes:Shape[]){
        this.shapes.filter((shape)=>{
            return !shapes.includes(shape)
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
}
