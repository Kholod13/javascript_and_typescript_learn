import {Identifiable} from "./basic-contracts";
import {Teacher, Student} from "./person-hierarchy";

export class Course implements Identifiable {
    constructor(
        public readonly id: string,
        public title: string,
        public credits: number,
        private _instructor: Teacher
    ){

    }

    get instructor(): Teacher{
        return this._instructor;
    }

    public reassignInstructor(newInstructor: Teacher): void{
        console.log(`Course "${this.title}" now taught by ${newInstructor.fullName}`);
        this._instructor = newInstructor;
    }
}

export class AcademicGroup implements Identifiable {
    private _students: Map<string, Student> = new Map();

    constructor(
        public readonly id: string,
        public name: string,
        public curator?: Teacher
    ){}

    public addStudent(student: Student): void {
        if(this._students.has(student.id)){
            throw new Error(`Student ${student.fullName} is already in group ${this.name}`);
        }
        this._students.set(student.id, student);
    }

    public removeStudent(studentId: string): boolean {
        return this._students.delete(studentId);
    }

    public getStudents(): Student[]{
        return Array.from(this._students.values());
    }

    public getGroupAverageScore(): number {
        const list = this.getStudents();
        if(list.length === 0) return 0;
        const totalGpa = list.reduce((acc, s) => acc + s.calculateGPA(), 0);
        return Number((totalGpa /list.length).toFixed(2));
    }
}