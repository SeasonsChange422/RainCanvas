export function getRandomNumber(min:number,max:number){
    switch(arguments.length){
        case 1:
            return Math.random()*min+1;
        case 2:
            return Math.random()*(max-min+1)+min
        default:
            return 0;
    }
}
