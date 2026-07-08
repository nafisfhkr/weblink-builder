import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const blockSchema = z.object({
  id: z.string(),
  type: z.enum(["link", "image"]),
  title: z.string().optional(),
  url: z.string().optional(),
  storageKey: z.string().optional(),
  alt: z.string().optional(),
  order: z.number(),
});

const blocksDataSchema = z.array(blockSchema).max(30, "Max 30 blocks allowed");

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await req.json();
    const parsedBlocks = blocksDataSchema.parse(body.blocksData);

    const project = await prisma.project.update({
      where: { id, userId: session.user.id },
      data: { blocksData: parsedBlocks },
    });

    return NextResponse.json({ success: true, project });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation Error", details: error.issues }, { status: 400 });
    }
    console.error("Auto-save PATCH error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
