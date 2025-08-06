import {OriginPoint, RelativePoint} from "../types/common";
import {Grid} from "./grid";
import {Shape} from "./shape";
import {AreaSelectState, CanvasState, MultiSelectState, NormalState} from "../state/canvasState";
import {SelectionManager} from "../manager/selectionManager";
import {CommandManager} from "../manager/commandManager";
import {SelectArea} from "./selectArea";
import {throttle} from "../utils/timer";

export class Canvas {
    public el
    public ctx
    public width = 300
    public height = 150
    public scale = 1
    public originPoint:OriginPoint = {x:20,y:20}
    public state:CanvasState
    private multiSelectState
    private areaSelectState
    private normalState
    public shapes:Shape[] = []
    public selectArea:SelectArea
    public grid:Grid
    public selectionManager:SelectionManager
    public commandManager:CommandManager
    private throttledMouseHandler:Function
    private throttledKeyHandler:Function

    constructor(options:any) {
        if (options.el && typeof options.el === 'string') {
            this.el = document.querySelector(options.el);
        }
        if (this.el.getContext) {
            this.ctx = this.el.getContext('2d');
        } else {
            //
        }
        if (isNaN(parseInt(options.width))) {
            throw "width error"
        }
        if (isNaN(parseInt(options.height))) {
            throw "height error"
        }
        this.width = options.width
        this.height = options.height
        this.grid = new Grid(this.ctx)
        this.ctx._height = this.height
        this.ctx._width = this.width
        this.multiSelectState = new MultiSelectState(this)
        this.areaSelectState = new AreaSelectState(this)
        this.normalState = new NormalState(this);
        this.state = this.normalState
        this.commandManager = new CommandManager()
        this.selectionManager = new SelectionManager(this.commandManager)

        this.resize(this.height, this.width)
        this.addShape(new Shape(this.ctx,[{x:330,y:330},{x:770,y:330},{x:770,y:770},{x:330,y:770}],{
            isClose:true,isFill:true
        }))
        this.addShape(new Shape(this.ctx,[{x:330,y:330},{x:770,y:330},{x:770,y:770},{x:330,y:770}],{
            isClose:true,isFill:true
        }))
        this.addShape(new Shape(this.ctx,[{x:330,y:330},{x:770,y:330},{x:770,y:770},{x:330,y:770}],{
            isClose:true,isFill:true
        }))
        this.addShape(new Shape(this.ctx,[{x:330,y:330},{x:770,y:330},{x:770,y:770},{x:330,y:770}],{
            isClose:true,isFill:true
        }))
        this.addShape(new Shape(this.ctx,[{x:330,y:330},{x:221,y:330},{x:246,y:770},{x:445,y:123}],{
            isClose:false,isFill:false
        }))
        this.addShape(new Shape(this.ctx,[{x:100,y:100},{x:200,y:100},{x:200,y:0}],{
            isClose:true,isFill:true
        }))
        this.draw()
        this.registerEvent()
    }
    handleEvent(e:any) {
        const handler = `handle${e.type.charAt(0).toUpperCase() + e.type.slice(1)}`;
        // @ts-ignore
        this.state[handler]?.(e);
    }
    handleKeyEvent(e:any) {
        const handler = `handle${e.type.charAt(0).toUpperCase() + e.type.slice(1)}`;
        if (e.ctrlKey || e.metaKey) { //window || mac
            this.state = this.multiSelectState;
        } else if (e.shiftKey) {
            this.state = this.areaSelectState;
        } else {
            this.state = this.normalState;
        }
        // @ts-ignore
        this.state[handler]?.(e)
    }
    registerEvent(){
        this.throttledMouseHandler = throttle(this.handleEvent.bind(this), 8);
        this.throttledKeyHandler = throttle(this.handleKeyEvent.bind(this), 32);

        this.el.addEventListener('mousewheel',this.throttledMouseHandler)
        this.el.addEventListener('mousedown', this.handleEvent.bind(this));
        this.el.addEventListener('mousemove', this.throttledMouseHandler);
        this.el.addEventListener('mouseup', this.handleEvent.bind(this));
        document.addEventListener('keydown', this.throttledKeyHandler);
        document.addEventListener('keyup', this.throttledKeyHandler);
        this.el.oncontextmenu=()=>false
    }
    findShapeAt(pos:RelativePoint) {
        for (let i = this.shapes.length - 1; i >= 0; i--) {
            if (this.shapes[i].isPointInside(pos,this.originPoint,this.scale)) {
                return this.shapes[i];
            }
        }
        return null;
    }
    draw(loop = true){
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.grid.draw(this.originPoint,this.scale)
        this.shapes.forEach((shape)=>{
            shape.draw(this.originPoint,this.scale)
        })
        this.selectArea&&this.selectArea.draw(this.originPoint,this.scale)
        window.requestAnimationFrame(()=>{this.draw(loop)})
    }
    addShape(shape:Shape){
        this.shapes.push(shape)
    }
    resize(height:number, width:number) {
        this.el.width = width
        this.el.height = height
    }
}
