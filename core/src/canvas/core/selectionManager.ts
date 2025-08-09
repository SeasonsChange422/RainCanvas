import {Shape} from "../models/shape";
import {Command} from "./command";
import {MoveCommand} from '../commands/moveCommand'
import {CommandManager} from "./commandManager";
import {OriginPoint, RelativePoint} from "./common";
import {ShapeManager} from "./shapeManager";
import {DelCommand} from "../commands/delCommand";
import {PasteCommand} from "../commands/pasteCommand";
import {deepCopyObject} from "../utils/copy";

export class SelectionManager {
    private selectedShapes
    private commandManager
    private shapeManager
    private totalOffsetX = 0
    private totalOffsetY = 0

    constructor(commandManager: CommandManager,shapeManager:ShapeManager) {
        this.selectedShapes = new Set<Shape>()
        this.commandManager = commandManager
        this.shapeManager = shapeManager
    }

    singleSelect(shape: Shape) {
        this.clear()
        if (!this.selectedShapes.has(shape)) {
            this.selectedShapes.add(shape)
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
        if (this.selectedShapes.has(shape)) {
            this.selectedShapes.delete(shape)
            shape.unselect()
        }
    }

    toggle(shape: Shape) {
        if (this.selectedShapes.has(shape)) {
            this.selectedShapes.delete(shape)
            shape.unselect()
        } else {
            this.selectedShapes.add(shape)
            shape.select()
        }
    }

    clear() {
        this.selectedShapes.forEach((shape) => {
            shape.unselect()
        })
        this.selectedShapes.clear()
    }

    has(shape: Shape) {
        return this.selectedShapes.has(shape)
    }

    beginMove() {
        this.totalOffsetX = 0;
        this.totalOffsetY = 0;
    }

    move(offsetX: number, offsetY: number) {
        if (!offsetX && !offsetY) return;
        const commands: Command[] = [];
        this.selectedShapes.forEach((shape) => {
            commands.push(new MoveCommand(shape, offsetX, offsetY));
        });
        this.commandManager.execute(commands, false);
        this.totalOffsetX += offsetX;
        this.totalOffsetY += offsetY;
    }

    stopMove() {
        if (!this.totalOffsetX && !this.totalOffsetY) return;
        const commands: Command[] = [];
        this.selectedShapes.forEach((shape) => {
            commands.push(new MoveCommand(shape, this.totalOffsetX, this.totalOffsetY));
        });
        this.commandManager.push(commands);
        this.totalOffsetX = 0;
        this.totalOffsetY = 0;
    }

    singleShape() {
        return this.selectedShapes.size <= 1
    }

    deleteShapes(){
        const indexArr = this.shapeManager.indexDescArr(Array.from(this.selectedShapes)) //获取index数组（倒序），execute时从后往前删
        this.commandManager.execute(indexArr.map((index)=>{
            return new DelCommand(this.shapeManager,index,this.shapeManager.getShape(index))
        }),true)
    }
    copy(){
        this.shapeManager.copy(Array.from(this.selectedShapes).map((shape)=>{
            return deepCopyObject(shape)
        }))
    }
    paste(){
        this.commandManager.execute([new PasteCommand(this.shapeManager)],true)
    }
}
