import {Command} from "../core/command";
import {ShapeManager} from "../core/shapeManager";
import {Shape} from "../models/shape";

export class DelCommand extends Command{
    private shapeManager
    private index
    private shape
    constructor(shapeManager:ShapeManager,index:number,shape:Shape) {
        super();
        this.shapeManager = shapeManager
        this.index = index
        this.shape = shape
    }
    execute(): void {
        this.shapeManager.deleteShape(this.index)
    }

    undo(): void {
        this.shapeManager.undelete(this.index,this.shape)
    }

}
