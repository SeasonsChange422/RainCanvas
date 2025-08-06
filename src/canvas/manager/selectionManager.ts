import {Shape} from "../models/shape";

export class SelectionManager{
    private selectedShape
    constructor() {
        this.selectedShape = new Set<Shape>()
    }
    singleSelect(shape:Shape){
        this.clear()
        if(!this.selectedShape.has(shape)){
            this.selectedShape.add(shape)
            shape.select()
        }
    }
    unselect(shape:Shape){
        if(this.selectedShape.has(shape)){
            this.selectedShape.delete(shape)
            shape.unselect()
        }
    }
    toggle(shape:Shape){
        if(this.selectedShape.has(shape)){
            this.selectedShape.delete(shape)
            shape.unselect()
        } else {
            this.selectedShape.add(shape)
            shape.select()
        }
    }
    clear(){
        this.selectedShape.forEach((shape)=>{
            shape.unselect()
        })
        this.selectedShape.clear()
    }
    move(offsetX:number,offsetY:number){
        this.selectedShape.forEach((shape)=>{
            shape.move(offsetX,offsetY)
        })
    }
    singleShape(){
        return this.selectedShape.size <= 1
    }
}
