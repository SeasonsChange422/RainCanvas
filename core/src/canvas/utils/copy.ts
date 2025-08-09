export function deepCopyObject(obj:any,map=new WeakMap()):any{
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    if (map.has(obj)) return map.get(obj);
    const type = Object.prototype.toString.call(obj).slice(8, -1);
    let clone:any;

    switch (type) {
        case 'Date':
            return new Date(obj);
        case 'RegExp':
            return new RegExp(obj);
        case 'Set':
            clone = new Set();
            map.set(obj, clone);
            obj.forEach((value:any) => clone.add(deepCopyObject(value, map)));
            return clone;
        case 'Map':
            clone = new Map();
            map.set(obj, clone);
            obj.forEach((value:any, key:string) => clone.set(key, deepCopyObject(value, map)));
            return clone;
        case 'Symbol':
            return Symbol(obj.description);
        case 'Function':
            return obj.bind({});
        case 'Array':
            clone = [];
            map.set(obj, clone);
            obj.forEach((item:any, i:number) => clone[i] = deepCopyObject(item, map));
            return clone;
        case 'CanvasRenderingContext2D':
            return obj
        default:
            clone = Object.create(Object.getPrototypeOf(obj));
            map.set(obj, clone);
            Reflect.ownKeys(obj).forEach(key => {
                clone[key] = deepCopyObject(obj[key], map);
            });
            return clone;
    }
}
