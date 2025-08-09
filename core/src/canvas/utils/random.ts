export function getRandomNumber(min,max){
    switch(arguments.length){
        case 1:
            return Math.random()*min+1;
        case 2:
            return Math.random()*(max-min+1)+min
        default:
            return 0;
    }
}
