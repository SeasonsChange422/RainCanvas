export function deepCopyObject(obj){
    if(obj === null)return
    let ret = Array.isArray(obj)?[]:{}
    Object.keys(obj).forEach((key)=>{
        ret[key] = typeof obj[key]==='object'?deepCopyObject(obj[key]):obj[key]
    })
    return ret
}
