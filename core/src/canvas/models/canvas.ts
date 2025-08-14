import {OriginPoint, RelativePoint} from "../core/common";
import {Grid} from "./grid";
import {Shape} from "./shape";
import {SelectionManager} from "../core/selectionManager";
import {CommandManager} from "../core/commandManager";
import {ToolManager} from "../core/toolManager";
import {SelectTool} from "../tools/selectTool";
import {PanTool} from "../tools/panTool";
import {Tool} from "../core/tool";
import {ShapeManager} from "../core/shapeManager";

export class Canvas {
    public el
    public ctx:CanvasRenderingContext2D
    public width = 300
    public height = 150
    public scale = 1
    public originPoint:OriginPoint = {x:20,y:20}
    public grid:Grid
    public toolManager:ToolManager
    public shapeManager:ShapeManager
    public selectionManager:SelectionManager
    public commandManager:CommandManager
    // private rafId: number | null = null;
    // private dirty = true;

    constructor(options:any) {
        if (options.el) {
            if(typeof options.el === 'string'){
                this.el = document.querySelector(options.el);
            } else if(options.el instanceof HTMLElement){
                this.el = options.el
            }
            if(!this.el){
                throw ('canvas error')
            }

        }
        if (this.el.getContext) {
            this.ctx = this.el.getContext('2d');
        } else {
            throw ('canvas error')
        }
        if (isNaN(parseInt(options.width))) {
            throw "width error"
        }
        if (isNaN(parseInt(options.height))) {
            throw "height error"
        }
        let shapes = []
        shapes.push(new Shape(this.ctx,[{x:330,y:330},{x:770,y:330},{x:770,y:770},{x:330,y:770}],{
            isClose:true,isFill:true
        }))
        shapes.push(new Shape(this.ctx,[{x:330,y:330},{x:770,y:330},{x:770,y:770},{x:330,y:770}],{
            isClose:true,isFill:true
        }))
        shapes.push(new Shape(this.ctx,[{x:330,y:330},{x:770,y:330},{x:770,y:770},{x:330,y:770}],{
            isClose:true,isFill:true
        }))
        shapes.push(new Shape(this.ctx,[{x:330,y:330},{x:770,y:330},{x:770,y:770},{x:330,y:770}],{
            isClose:true,isFill:true
        }))
        shapes.push(new Shape(this.ctx,[{x:330,y:330},{x:221,y:330},{x:246,y:770},{x:445,y:123}],{
            isClose:false,isFill:false
        }))
        shapes.push(new Shape(this.ctx,[{x:100,y:100},{x:200,y:100},{x:200,y:0}],{
            isClose:true,isFill:true
        }))
        this.width = options.width
        this.height = options.height
        this.grid = new Grid(this.ctx)
        this.commandManager = new CommandManager()
        this.shapeManager = new ShapeManager(shapes)
        this.toolManager = new ToolManager({
            canvas: this,
            setTool: (id: string) => this.toolManager.setTool(id),
        });
        this.selectionManager = new SelectionManager(this.commandManager,this.shapeManager)

        this.resize(this.height, this.width)

        this.draw()
        this.registerTools();
        this.registerToolEvents();
    }
    private registerTools() {
        this.toolManager.register(<Tool>SelectTool);
        this.toolManager.register(<Tool>PanTool);
        this.toolManager.setTool("tool-select"); // 默认使用选择工具
    }

    private registerToolEvents() {
        this.el.addEventListener("pointerdown", this.toolManager.handlePointerDown, { passive: false });
        this.el.addEventListener("pointermove", this.toolManager.handlePointerMove, { passive: false });
        window.addEventListener("pointerup", this.toolManager.handlePointerUp, { passive: false });
        this.el.addEventListener("wheel", this.toolManager.handleWheel, { passive: false });
        document.addEventListener("keydown", this.toolManager.handleKeyDown, { passive: false });
        document.addEventListener("keyup", this.toolManager.handleKeyUp, { passive: false });

        this.el.oncontextmenu = () => false;
    }

    dispose() {
        this.el.removeEventListener("pointerdown", this.toolManager.handlePointerDown as any);
        this.el.removeEventListener("pointermove", this.toolManager.handlePointerMove as any);
        window.removeEventListener("pointerup", this.toolManager.handlePointerUp as any);
        this.el.removeEventListener("wheel", this.toolManager.handleWheel as any);
        document.removeEventListener("keydown", this.toolManager.handleKeyDown as any);
        document.removeEventListener("keyup", this.toolManager.handleKeyUp as any);
    }
    findShapeAt(pos:RelativePoint) {
        return this.shapeManager.findShapeAt(pos,this.originPoint,this.scale)
    }
    // invalidate() { this.dirty = true; if (this.rafId == null) this.rafId = requestAnimationFrame(() => this.draw()); }

    draw(loop=true){
        // this.rafId = null;
        // if (!this.dirty) return;
        // this.dirty = false;
        const w = this.el.width, h = this.el.height;
        this.ctx.clearRect(0, 0, w, h);
        this.grid.draw(this.originPoint, this.scale);
        this.shapeManager.draw(this.originPoint,this.scale)
        this.selectionManager.draw(this.originPoint,this.scale)
        requestAnimationFrame(() => this.draw(loop))
    }

    resize(height:number, width:number) {
        this.el.width = width
        this.el.height = height
    }
}
