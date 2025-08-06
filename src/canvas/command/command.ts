import {Shape} from "../models/shape";

export abstract class Command {
    abstract execute():void;
    abstract undo():void;
}

export class MoveCommand extends Command {
    private shape
    private offsetX
    private offsetY
    constructor(shape:Shape,offsetX:number,offsetY:number) {
        super();
        this.shape = shape
        this.offsetX = offsetX
        this.offsetY = offsetY
    }
    execute(): void {
        this.shape.move(this.offsetX,this.offsetY)
    }

    undo(): void {
        this.shape.move(-this.offsetX,-this.offsetY)
    }

}
