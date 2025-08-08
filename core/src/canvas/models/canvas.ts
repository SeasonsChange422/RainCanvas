import {OriginPoint, RelativePoint} from "../types/common";
import {Grid} from "./grid";
import {Shape} from "./shape";
import {SelectionManager} from "../manager/selectionManager";
import {CommandManager} from "../manager/commandManager";
import {SelectArea} from "./selectArea";
import {ToolManager} from "../core/toolManager";
import {SelectTool} from "../tools/selectTool";
import {PanTool} from "../tools/panTool";
import {Tool} from "../core/tool";

export class Canvas {
    public el
    public ctx
    public width = 300
    public height = 150
    public scale = 1
    public originPoint:OriginPoint = {x:20,y:20}
    private toolManager:ToolManager
    public shapes:Shape[] = []
    public selectArea:SelectArea | null
    public grid:Grid
    public selectionManager:SelectionManager
    public commandManager:CommandManager
    // private rafId: number | null = null;
    // private dirty = true;

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
        this.selectArea = null
        this.commandManager = new CommandManager()
        this.toolManager = new ToolManager(this.ctx)
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
        this.registerTools();
        this.registerToolEvents();
    }
    private registerTools() {
        this.toolManager = new ToolManager({
            canvas: this,
            setTool: (id: string) => this.toolManager.setTool(id),
        });
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
        for (let i = this.shapes.length - 1; i >= 0; i--) {
            if (this.shapes[i].isPointInside(pos,this.originPoint,this.scale)) {
                return this.shapes[i];
            }
        }
        return null;
    }
    // invalidate() { this.dirty = true; if (this.rafId == null) this.rafId = requestAnimationFrame(() => this.draw()); }

    draw(loop=true){
        // this.rafId = null;
        // if (!this.dirty) return;
        // this.dirty = false;
        const w = this.el.width, h = this.el.height;
        this.ctx.clearRect(0, 0, w, h);
        this.grid.draw(this.originPoint, this.scale);
        this.shapes.forEach(shape => shape.draw(this.originPoint, this.scale));
        this.selectArea && this.selectArea.draw(this.originPoint, this.scale);
        requestAnimationFrame(() => this.draw(loop))
    }
    addShape(shape:Shape){
        this.shapes.push(shape)
    }
    resize(height:number, width:number) {
        this.el.width = width
        this.el.height = height
    }
}
