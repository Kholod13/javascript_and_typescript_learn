import { Student, Professor, AssociateProfessor } from "./person-hierarchy";
import { Course } from "./learning-units";
import { Faculty } from "./faculty";
import { InMemoryRepository } from "./repository";

async function runDemonstration() {
    console.log("=== 1. Teachers (polymorphism and inheritance) ===");
    const profShevchenko = new Professor("t-1", "Taras", "Shevchenko", "t.shevchenko@univ.edu", 20000);
    const docentKoval = new AssociateProfessor("t-2", "Olena", "Koval", "o.koval@univ.edu", 16000);

    console.log(`${profShevchenko.getRoleDescription()} | Salary: ${profShevchenko.calculateSalary()}`);
    console.log(`${docentKoval.getRoleDescription()} | Salary: ${docentKoval.calculateSalary()}`);

    console.log("\n=== 2. Faculty and groups (composition) ===");
    const csFaculty = new Faculty("f-1", "Computer Science Faculty");

    const groupKN21 = csFaculty.createGroup("g-kn21", "KN-21", docentKoval);
    console.log(`Group "${groupKN21.name}" created in faculty "${csFaculty.name}"`);

    console.log("\n=== 3. Students and grades (aggregation + encapsulation) ===");
    const studentIvan = new Student("s-101", "Ivan", "Melnyk", "ivan.m@univ.edu", "KB123456");
    const studentAnna = new Student("s-102", "Anna", "Boyko", "anna.b@univ.edu", "KB123457");

    groupKN21.addStudent(studentIvan);
    groupKN21.addStudent(studentAnna);

    const tsCourse = new Course("c-ts", "TypeScript Enterprise Patterns", 5, profShevchenko);

    studentIvan.addGrade({ courseId: tsCourse.id, score: 95, date: new Date() });
    studentIvan.addGrade({ courseId: tsCourse.id, score: 87, date: new Date() });
    studentAnna.addGrade({ courseId: tsCourse.id, score: 98, date: new Date() });
    studentAnna.addGrade({ courseId: tsCourse.id, score: 92, date: new Date() });

    console.log(`Ivan GPA: ${studentIvan.calculateGPA()}`);
    console.log(`Anna GPA: ${studentAnna.calculateGPA()}`);
    console.log(`Average of group ${groupKN21.name}: ${groupKN21.getGroupAverageScore()}`);

    console.log("\n=== 4. Generic repository ===");
    const studentRepo = new InMemoryRepository<Student>();
    await studentRepo.save(studentIvan);
    await studentRepo.save(studentAnna);

    const foundStudent = await studentRepo.findById("s-101");
    console.log(`Found in repository: ${foundStudent?.fullName} (${foundStudent?.email})`);
    console.log(`Total students in storage: ${(await studentRepo.findAll()).length}`);
}

runDemonstration().catch(console.error);