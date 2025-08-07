export function throttle(fn:Function,wait:number){
    let lastTime = Date.now()
    let timer:number|null = null
    return function (...args:any[]){
        //@ts-ignore
        let context = this
        if(lastTime+wait<=Date.now()){
            lastTime=Date.now()
            fn.apply(context,args)
        } else {
            if(timer){
                clearTimeout(timer)
                timer = null
            }
            timer = setTimeout(()=>{
                fn.apply(context,args)
            },wait)
        }
    }
}
