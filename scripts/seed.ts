import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  try {
    const categories = [
      "Web Development",
      "Mobile Development",
      "Data Science",
      "Artificial Intelligence",
      "Machine Learning",
      "Blockchain",
      "Cyber Security",
      "Cloud Computing",
      "DevOps",
      "IoT",
      "Augmented Reality",
      "Virtual Reality",
      "Game Development",
      "UI/UX Design",
      "Digital Marketing",
      "Finance",
      "Entrepreneurship",
      "Business",
      "Management",
      "Leadership",
      "Productivity",
      "Personal Development",
      "Career Development",
      "Sales",
      "Human Resources",
      "Accounting",
      "Project Management",
      "Agile",
      "Scrum",
      "Computer Science",
      "Music",
      "Film",
      "Photography",
      "Sports",
      "Technology",
      "Engineering",
    ];

    // Loop through and check if category exists before creating
    for (const name of categories) {
      const categoryExists = await db.category.findUnique({
        where: { name },
      });

      if (!categoryExists) {
        await db.category.create({
          data: { name },
        });
      }
    }

    console.log("Success seeding the data");
  } catch (error) {
    console.error("Error seeding the data:", error);
  } finally {
    await db.$disconnect();
  }
}

main();
