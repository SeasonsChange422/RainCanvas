import {Shape} from "../models/shape";
import {Command, MoveCommand} from "../command/command";
import {CommandManager} from "./commandManager";

export class SelectionManager{
    private selectedShape
    private commandManager
    private totalOffsetX = 0
    private totalOffsetY = 0
    constructor(commandManager:CommandManager) {
        this.selectedShape = new Set<Shape>()
        this.commandManager = commandManager
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
    has(shape:Shape){
        return this.selectedShape.has(shape)
    }
    move(offsetX:number,offsetY:number){
        let commands:Command[] = []
        this.selectedShape.forEach((shape)=>{
            commands.push(new MoveCommand(shape,offsetX,offsetY))
        })
        this.commandManager.execute(commands,false) //每次移动都很小，因此只执行命令，不推入执行历史
        this.totalOffsetX+=offsetX
        this.totalOffsetY+=offsetY // 计算总移动量，在stopMove时才将命令推入执行历史
    }
    stopMove(){
        let commands:Command[] = []
        this.selectedShape.forEach((shape)=>{
            commands.push(new MoveCommand(shape,this.totalOffsetX,this.totalOffsetY))
        })
        this.commandManager.push(commands)
        this.totalOffsetX = 0
        this.totalOffsetY = 0
    }
    singleShape(){
        return this.selectedShape.size <= 1
    }
}
