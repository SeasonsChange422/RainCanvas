import {OriginPoint, RelativePoint} from "../types/common";
import {Grid} from "./grid";
import {Shape} from "./shape";
import {AreaSelectState, MultiSelectState, NormalState} from "../state/canvasState";
import {SelectionManager} from "../manager/selectionManager";

export class Canvas {
    public el
    public ctx
    public width = 300
    public height = 150
    public scale = 1
    public originPoint:OriginPoint = {x:20,y:20}
    public state
    public shapes:Shape[] = []
    public grid:Grid
    public selectionManager:SelectionManager
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
        this.state = new NormalState(this);
        this.selectionManager = new SelectionManager()
        this.resize(this.height, this.width)
        let shape1 = new Shape(this.ctx,[{x:33,y:33},{x:77,y:33},{x:77,y:77},{x:33,y:77}],{
            isClose:true,isFill:true
        })
        let shape2 = new Shape(this.ctx,[{x:330,y:330},{x:770,y:330},{x:770,y:770},{x:330,y:770}],{
            isClose:true,isFill:true
        })
        this.addShape(shape1)
        this.addShape(shape2)
        this.draw()
        this.registerEvent()
    }
    handleEvent(e:any) {
        const handler = `handle${e.type.charAt(0).toUpperCase() + e.type.slice(1)}`;
        // @ts-ignore
        this.state[handler]?.(e);
    }
    handleKeyEvent(e:any) {
        if (e.ctrlKey || e.metaKey) {
            this.state = new MultiSelectState(this);
        } else if (e.shiftKey) {
            this.state = new AreaSelectState(this);
        } else {
            this.state = new NormalState(this);
        }
    }
    registerEvent(){
        this.el.addEventListener('mousewheel',this.handleEvent.bind(this))
        this.el.addEventListener('mousedown', this.handleEvent.bind(this));
        this.el.addEventListener('mousemove', this.handleEvent.bind(this));
        this.el.addEventListener('mouseup', this.handleEvent.bind(this));
        document.addEventListener('keydown', this.handleKeyEvent.bind(this));
        document.addEventListener('keyup', this.handleKeyEvent.bind(this));
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
