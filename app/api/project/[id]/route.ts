import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const linkSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  url: z.string().url("Must be a valid URL"),
  order: z.number(),
});

const linksDataSchema = z.array(linkSchema).max(15, "Max 15 links allowed");

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await req.json();
    const parsedLinks = linksDataSchema.parse(body.linksData);

    const project = await prisma.project.update({
      where: { id, userId: session.user.id },
      data: { linksData: parsedLinks },
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
