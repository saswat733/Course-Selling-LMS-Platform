import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  try {
    await db.category.createMany({
      data: [
        { name: "Web Development" },
        { name: "Mobile Development" },
        { name: "Data Science" },
        { name: "Artificial Intelligence" },
        { name: "Machine Learning" },
        { name: "Blockchain" },
        { name: "Cyber Security" },
        { name: "Cloud Computing" },
        { name: "DevOps" },
        { name: "IoT" },
        { name: "Augmented Reality" },
        { name: "Virtual Reality" },
        { name: "Game Development" },
        { name: "UI/UX Design" },
        { name: "Digital Marketing" },
        { name: "Finance" },
        { name: "Entrepreneurship" },
        { name: "Business" },
        { name: "Management" },
        { name: "Leadership" },
        { name: "Productivity" },
        { name: "Personal Development" },
        { name: "Career Development" },
        { name: "Sales" },
        { name: "Human Resources" },
        { name: "Accounting" },
        { name: "Project Management" },
        { name: "Agile" },
        { name: "Scrum" },
        { name: "Computer Science" },
        { name: "Music" },
        { name: "Film" },
        { name: "Photography" },
        { name: "Sports" },
        { name: "Technology" },
        { name: "Engineering" },
      ],
      skipDuplicates: true, // Prevent duplicate errors
    });

    console.log("Success seeding the data");
  } catch (error) {
    console.error("Error seeding the data:", error);
  } finally {
    await db.$disconnect();
  }
}

main();
