import {OriginPoint} from "../types/common";

export abstract class CanvasElement{
    protected ctx
    constructor(ctx:any) {
        this.ctx = ctx
    }
    abstract draw(originPoint:OriginPoint,scale:number):void
}
