import {OriginPoint} from "../core/common";

export abstract class CanvasElement{
    protected ctx
    public id:string = '-1'
    constructor(ctx:any) {
        this.ctx = ctx
        this.generalId()
    }
    generalId(){
        this.id = 'id-' + new Date().getTime().toString(36) + '-' + Math.random().toString(36).substring(2, 9);
    }
    abstract draw(originPoint:OriginPoint,scale:number):void
}
