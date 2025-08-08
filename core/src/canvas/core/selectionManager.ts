import {Shape} from "../models/shape";
import {Command} from "./command";
import {MoveCommand} from '../commands/moveCommand'
import {CommandManager} from "./commandManager";
import {OriginPoint, RelativePoint} from "./common";
import {ShapeManager} from "./shapeManager";
import {DelCommand} from "../commands/delCommand";

export class SelectionManager {
    private selectedShape
    private commandManager
    private shapeManager
    private totalOffsetX = 0
    private totalOffsetY = 0

    constructor(commandManager: CommandManager,shapeManager:ShapeManager) {
        this.selectedShape = new Set<Shape>()
        this.commandManager = commandManager
        this.shapeManager = shapeManager
    }

    singleSelect(shape: Shape) {
        this.clear()
        if (!this.selectedShape.has(shape)) {
            this.selectedShape.add(shape)
            shape.select()
        }
    }

    selectArea(startPoint: RelativePoint, endPoint: RelativePoint, shapes: Shape[], originPoint: OriginPoint, scale: number) {
        shapes.forEach((shape) => {
            if (shape.isInArea(startPoint, endPoint, originPoint, scale)) {
                this.toggle(shape)
            }
        })
    }

    unselect(shape: Shape) {
        if (this.selectedShape.has(shape)) {
            this.selectedShape.delete(shape)
            shape.unselect()
        }
    }

    toggle(shape: Shape) {
        if (this.selectedShape.has(shape)) {
            this.selectedShape.delete(shape)
            shape.unselect()
        } else {
            this.selectedShape.add(shape)
            shape.select()
        }
    }

    clear() {
        this.selectedShape.forEach((shape) => {
            shape.unselect()
        })
        this.selectedShape.clear()
    }

    has(shape: Shape) {
        return this.selectedShape.has(shape)
    }

    beginMove() {
        this.totalOffsetX = 0;
        this.totalOffsetY = 0;
    }

    move(offsetX: number, offsetY: number) {
        if (!offsetX && !offsetY) return;
        const commands: Command[] = [];
        this.selectedShape.forEach((shape) => {
            commands.push(new MoveCommand(shape, offsetX, offsetY));
        });
        this.commandManager.execute(commands, false);
        this.totalOffsetX += offsetX;
        this.totalOffsetY += offsetY;
    }

    stopMove() {
        if (!this.totalOffsetX && !this.totalOffsetY) return;
        const commands: Command[] = [];
        this.selectedShape.forEach((shape) => {
            commands.push(new MoveCommand(shape, this.totalOffsetX, this.totalOffsetY));
        });
        this.commandManager.push(commands);
        this.totalOffsetX = 0;
        this.totalOffsetY = 0;
    }

    singleShape() {
        return this.selectedShape.size <= 1
    }

    deleteShapes(){
        const indexArr = this.shapeManager.indexDescArr(Array.from(this.selectedShape))
        const commands:Command[] = []
        this.commandManager.execute(indexArr.map((index)=>{
            return new DelCommand(this.shapeManager,index,this.shapeManager.getShape(index))
        }),true)

    }
}
