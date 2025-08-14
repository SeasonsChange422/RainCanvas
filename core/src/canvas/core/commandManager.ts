import {Command} from "./command";

export class CommandManager{
    private history: Command[][] = [];
    private redoStack: Command[][] = [];
    push(commands: Command[]) { this.history.push(commands); this.redoStack.length = 0; }
    execute(commands: Command[], push: boolean) {
        for (const c of commands) c.execute();
        if (push) this.history.push(commands);
    }
    undo() {
        const group = this.history.pop()
        if (!group) return;
        group.forEach((task)=>{
            task.undo()
        })
        this.redoStack.push(group);
    }
    redo() {
        const group = this.redoStack.pop();
        if (!group) return;
        for (const c of group) c.execute();
        this.history.push(group);
    }
    
    canUndo(): boolean {
        return this.history.length > 0;
    }
    
    canRedo(): boolean {
        return this.redoStack.length > 0;
    }
}
