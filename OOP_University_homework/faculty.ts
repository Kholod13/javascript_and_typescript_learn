import { Identifiable } from "./basic-contracts";
import { AcademicGroup } from "./learning-units";
import { Teacher } from "./person-hierarchy";

export class Faculty implements Identifiable {
    private _groups: Map<string, AcademicGroup> = new Map();

    constructor(
        public readonly id: string,
        public name: string,
    ){}

    public createGroup(id:string, name: string,  curator?: Teacher): AcademicGroup{
        if(this._groups.has(id)){
            throw new Error(`Group ${id} already exists in faculty ${this.name}`);
        }
        const newGroup = new AcademicGroup(id, name, curator);
        this._groups.set(id, newGroup);
        return newGroup;
    }

    public deleteGroup(groupId: string): boolean{
        return this._groups.delete(groupId);
    }

    public findGroupById(groupId: string): AcademicGroup | undefined {
        return this._groups.get(groupId);
    }

    public getAllGroups(): AcademicGroup[]  {
        return Array.from(this._groups.values());
    }
}