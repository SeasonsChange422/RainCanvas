import {Shape} from "../models/shape";
import {RelativePoint} from "../types/common";
import {MAX_SCALE, MIN_SCALE, SCALE_STEP} from "../constpool/grid";
import {Canvas} from "../models/canvas";

export abstract class CanvasState {
    protected canvas
    constructor(canvas:Canvas) {
        this.canvas = canvas
    }

    abstract handleMousedown(e:any):void;
    abstract handleMouseup(e:any):void;
    abstract handleMousemove(e:any):void;
    abstract handleMousewheel(e:any):void;
    abstract handleKeydown(e:any):void;
    abstract handleKeyup(e:any):void;
}

// 单击
export class NormalState extends CanvasState{
    private totalOffsetX = 0
    private totalOffsetY = 0
    handleMousedown(e:any) {
        let pos:RelativePoint = {
            x: e.offsetX,
            y: e.offsetY
        }
        let shape:Shape |null = this.canvas.findShapeAt(pos)
        if(shape){ // 点击元素
            switch(e.button){
                case 0: {
                    if(this.canvas.selectionManager.singleShape()){ // 单选的情况下，点击元素会重新选择
                        this.canvas.selectionManager.singleSelect(shape)
                    }
                    if(!this.canvas.selectionManager.has(shape)){
                        this.canvas.selectionManager.singleSelect(shape) // 多选的情况下，点击其他元素会重新选择
                    }
                    this.canvas.state = new DragState(this.canvas,pos)
                    break
                }
                case 2: {
                    this.canvas.selectionManager.singleSelect(shape)
                }
            }
        } else {
            if(e.button === 0){
                this.canvas.selectionManager.clear()
                this.canvas.state = new PanState(this.canvas,pos)
            }
        }
    }

    handleMousemove(e:any) {

    }

    handleMouseup(e:any) {

    }

    handleMousewheel(e:any) {
        scale(this.canvas,e)
    }

    handleKeydown(e: any): void {
        let offsetX=0,offsetY=0
        switch (e.key) {
            case 'ArrowLeft':{
                this.totalOffsetX--
                offsetX = -1
                break
            }
            case 'ArrowUp':{
                this.totalOffsetY--
                offsetY = -1
                break
            }
            case 'ArrowRight':{
                this.totalOffsetX++
                offsetX = 1
                break
            }
            case 'ArrowDown':{
                this.totalOffsetY++
                offsetY = 1
                break
            }
        }
        this.canvas.selectionManager.move(offsetX,offsetY)
    }

    handleKeyup(e: any): void {
        this.canvas.selectionManager.stopMove()
    }
}

// ctrl多选
export class MultiSelectState extends CanvasState {
    handleMousedown(e:any) {
        let pos:RelativePoint = {
            x: e.offsetX,
            y: e.offsetY
        }
        let shape:Shape | null = this.canvas.findShapeAt(pos)
        if(shape){
            this.canvas.selectionManager.toggle(shape)
        }
    }

    handleMousemove(e:any) {
    }

    handleMouseup(e:any) {
    }
    handleMousewheel(e:any) {
        scale(this.canvas,e)
    }

    handleKeydown(e: any): void {
        switch (e.key) {
            case 'z': {
                this.canvas.commandManager.undo()
                break;
            }
        }
    }

    handleKeyup(e: any): void {
    }
}

// shift区域选择
export class AreaSelectState extends CanvasState {
    handleMousedown(e:any) {
    }

    handleMousemove(e:any) {
    }

    handleMouseup(e:any) {
    }

    handleMousewheel(e:any) {
        scale(this.canvas,e)
    }

    handleKeydown(e: any): void {
    }

    handleKeyup(e: any): void {
    }
}

export class PanState extends CanvasState{

    private startPoint:RelativePoint
    constructor(canvas:Canvas,point:RelativePoint) {
        super(canvas);
        this.startPoint = point
    }
    handleMousedown(e:any) {
    }

    handleMousemove(e:any) {
        if(e.button === 0){
            this.canvas.originPoint.x += e.offsetX - this.startPoint.x
            this.canvas.originPoint.y += e.offsetY - this.startPoint.y
            this.startPoint.x = e.offsetX
            this.startPoint.y = e.offsetY
        }
    }

    handleMouseup(e:any) {
        this.canvas.state = new NormalState(this.canvas)
    }

    handleMousewheel(e:any) {
        scale(this.canvas,e)
    }

    handleKeydown(e: any): void {
    }

    handleKeyup(e: any): void {
    }
}
export class DragState extends CanvasState{

    private startPoint:RelativePoint
    constructor(canvas:Canvas,point:RelativePoint) {
        super(canvas);
        this.startPoint = point
    }
    handleMousedown(e:any) {
    }

    handleMousemove(e:any) {
        let offsetX = (e.offsetX - this.startPoint.x)/this.canvas.scale
        let offsetY = (e.offsetY - this.startPoint.y)/this.canvas.scale
        this.canvas.selectionManager.move(offsetX,offsetY)
        this.startPoint.x = e.offsetX
        this.startPoint.y = e.offsetY
    }

    handleMouseup(e:any) {
        this.canvas.selectionManager.stopMove()
        this.canvas.state = new NormalState(this.canvas)
    }

    handleMousewheel(e:any) {
        scale(this.canvas,e)
    }

    handleKeydown(e: any): void {
    }

    handleKeyup(e: any): void {
    }
}
function scale(canvas:Canvas,e:any){
    let lastScale = canvas.scale
    if(e.deltaY>0){
        canvas.scale-=SCALE_STEP
        canvas.scale = Math.max(MIN_SCALE,canvas.scale)
    } else {
        canvas.scale+=SCALE_STEP
        canvas.scale = Math.min(MAX_SCALE,canvas.scale)
    }
    // 以左上角为原点的向量空间中
    // 向量a为(e.offsetX,e.offsetY)
    // 向量b为(this.originPoint.x,this.originPoint.y)
    // 向量c为(this.originPoint.x - e.offsetX,this.originPoint.y - e.offsetY) = b - a
    // c *= n, n=this.scale/lastScale（相较于上一次的倍数）
    // 保持向量a不变，增长向量c，求向量b，b=a+c
    canvas.originPoint.x = (canvas.originPoint.x - e.offsetX)*canvas.scale/lastScale + e.offsetX
    canvas.originPoint.y = (canvas.originPoint.y - e.offsetY)*canvas.scale/lastScale + e.offsetY
    e.preventDefault()
}
