import {Command} from "../command/command";

export class CommandManager{
    private history:Command[][]
    constructor() {
        this.history = []
    }
    push(commands:Command[]){
        this.history.push(commands)
    }
    execute(commands:Command[],push:boolean){
        commands.forEach((command)=>{
            command.execute()
        })
        push&&this.history.push(commands)
    }
    undo(){
        let commands:Command[] = this.history.pop() || []
        commands.forEach((command)=>{
            command.undo()
        })
    }
}
