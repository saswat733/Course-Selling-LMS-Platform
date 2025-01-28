import { auth } from "@clerk/nextjs/server";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

const CoursePage = async () => {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  const courses = await db.course.findMany({
    where: {
      userId,
    },
  });

  return (
    <div>
      <DataTable columns={columns} data={courses} />
    </div>
  );
};

export default CoursePage;
