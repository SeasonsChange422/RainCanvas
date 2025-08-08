    import {Shape} from "../models/shape";
    import {Command, MoveCommand} from "../command/command";
    import {CommandManager} from "./commandManager";
    import {OriginPoint, RelativePoint} from "../types/common";

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
        selectArea(startPoint:RelativePoint,endPoint:RelativePoint,shapes:Shape[],originPoint:OriginPoint,scale:number){
            shapes.forEach((shape)=>{
                if(shape.isInArea(startPoint,endPoint,originPoint,scale)){
                    this.toggle(shape)
                }
            })
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
        beginMove(){
            this.totalOffsetX = 0;
            this.totalOffsetY = 0;
        }

        move(offsetX:number,offsetY:number){
            if (!offsetX && !offsetY) return;
            const commands:Command[] = [];
            this.selectedShape.forEach((shape)=>{
                commands.push(new MoveCommand(shape,offsetX,offsetY));
            });
            this.commandManager.execute(commands,false);
            this.totalOffsetX+=offsetX;
            this.totalOffsetY+=offsetY;
        }

        stopMove(){
            if (!this.totalOffsetX && !this.totalOffsetY) return;
            const commands:Command[] = [];
            this.selectedShape.forEach((shape)=>{
                commands.push(new MoveCommand(shape,this.totalOffsetX,this.totalOffsetY));
            });
            this.commandManager.push(commands);
            this.totalOffsetX = 0;
            this.totalOffsetY = 0;
        }
        singleShape(){
            return this.selectedShape.size <= 1
        }
    }
