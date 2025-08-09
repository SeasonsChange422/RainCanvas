import {Command} from "../core/command";
import {ShapeManager} from "../core/shapeManager";
import {Shape} from "../models/shape";
import {deepCopyObject} from "../utils/copy";

export class PasteCommand extends Command{
    private shapeManager:ShapeManager
    private pastedShapes:Shape[] = []
    constructor(shapeManager:ShapeManager) {
        super();
        this.shapeManager = shapeManager
    }
    execute(): void {
        this.pastedShapes = this.shapeManager.copyShapes.map((shape)=>{
            return deepCopyObject(shape)
        })
        this.pastedShapes.forEach((shape)=>{
            shape.generalId()
            shape.move(50,50)
        })
        this.shapeManager.paste(this.pastedShapes)
    }

    undo(): void {
        this.shapeManager.deleteShapes(this.pastedShapes)
    }

}
