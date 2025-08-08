import {Command} from "../command/command";

export class CommandManager{
    private history: Command[][] = [];
    private redoStack: Command[][] = [];
    push(commands: Command[]) { this.history.push(commands); this.redoStack.length = 0; }
    execute(commands: Command[], push: boolean) {
        for (const c of commands) c.execute();
        if (push) this.push(commands);
    }
    undo() {
        const group = this.history.pop();
        if (!group) return;
        for (let i = group.length - 1; i >= 0; i--) group[i].undo();
        this.redoStack.push(group);
    }
    redo() {
        const group = this.redoStack.pop();
        if (!group) return;
        for (const c of group) c.execute();
        this.history.push(group);
    }
}
