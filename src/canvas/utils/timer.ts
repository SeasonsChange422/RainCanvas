export function throttle(fn:Function,wait:number){
    let lastTime = Date.now()
    return function (){
        let args = arguments
        //@ts-ignore
        let context = this
        if(lastTime+wait<=Date.now()){
            lastTime=Date.now()
            fn.apply(context,args)
        }
    }
}
