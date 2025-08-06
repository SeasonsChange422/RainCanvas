export interface ShapePoint {
    x:number
    y:number
}

export interface ShapeOptions {
    isClose?:boolean | null
    isFill?:boolean | null
    fillColor?:string | null
    strokeColor?:string | null
}

export interface RectBorder {
    minX:number
    minY:number
    maxX:number
    maxY:number
}
