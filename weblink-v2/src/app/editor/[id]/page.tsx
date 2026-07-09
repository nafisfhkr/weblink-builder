import { auth } from "auth";
import { prisma } from "src/lib/prisma";
import { notFound, redirect } from "next/navigation";
import BuilderCanvas from "src/components/builder/BuilderCanvas";

export default async function EditorPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  // Get the project ID from params
  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id, userId: session.user.id },
  });

  if (!project) notFound();

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <BuilderCanvas initialData={project} />
    </div>
  );
}
