import { Professor, AssociateProfessor } from "./person-hierarchy";
import { Faculty } from "./faculty";

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
}

runDemonstration().catch(console.error);