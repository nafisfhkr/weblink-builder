import { NextRequest, NextResponse } from "next/server";
import { auth } from "auth";
import { prisma } from "src/lib/prisma";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await req.json().catch(() => ({}));
    const { blocksData, pageSettings } = body;

    // Cari project untuk validasi
    const project = await prisma.project.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const dataToUpdate: any = {
      isPublished: true,
      publishedAt: new Date(),
    };

    if (blocksData !== undefined) {
      dataToUpdate.blocksData = blocksData;
      dataToUpdate.publishedBlocksData = blocksData;
    } else {
      dataToUpdate.publishedBlocksData = project.blocksData as any;
    }

    if (pageSettings !== undefined) {
      dataToUpdate.pageSettings = pageSettings;
    }

    // Update project
    const updatedProject = await prisma.project.update({
      where: { id },
      data: dataToUpdate,
    });

    // Revalidate the published page to clear any cached version
    revalidatePath(`/${project.slug}`);

    return NextResponse.json({ success: true, project: updatedProject });
  } catch (error) {
    console.error("Publish project error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
