import { NextRequest, NextResponse } from "next/server";
import { auth } from "auth";
import { prisma } from "src/lib/prisma";
import { z } from "zod";

const headingContentSchema = z.object({
  title: z.string().max(60, "Judul halaman maksimal 60 karakter").optional().or(z.literal("")),
  bio: z.string().max(120, "Bio maksimal 120 karakter").optional().or(z.literal("")),
}).passthrough();

const textContentSchema = z.object({
  text: z.string().max(200, "Deskripsi maksimal 200 karakter").optional().or(z.literal("")),
}).passthrough();

const linkContentSchema = z.object({
  title: z.string().max(40, "Judul tautan maksimal 40 karakter").optional().or(z.literal("")),
  url: z.string().optional().or(z.literal("")),
}).passthrough();

const imageContentSchema = z.object({
  url: z.string().optional().or(z.literal("")),
  alt: z.string().max(100, "Alt text maksimal 100 karakter").optional().or(z.literal("")),
  storageKey: z.string().optional().or(z.literal("")),
}).passthrough();

const dividerContentSchema = z.object({}).passthrough().optional();

const socialItemSchema = z.object({
  platform: z.string(),
  url: z.string().optional().or(z.literal("")),
}).passthrough();

const socialContentSchema = z.object({
  items: z.array(socialItemSchema).optional(),
}).passthrough();

const blockSchema = z.discriminatedUnion("type", [
  z.object({
    id: z.string(),
    type: z.literal("heading"),
    content: headingContentSchema,
    order: z.number(),
  }),
  z.object({
    id: z.string(),
    type: z.literal("text"),
    content: textContentSchema,
    order: z.number(),
  }),
  z.object({
    id: z.string(),
    type: z.literal("link"),
    content: linkContentSchema,
    order: z.number(),
  }),
  z.object({
    id: z.string(),
    type: z.literal("image"),
    content: imageContentSchema,
    order: z.number(),
  }),
  z.object({
    id: z.string(),
    type: z.literal("divider"),
    content: dividerContentSchema,
    order: z.number(),
  }),
  z.object({
    id: z.string(),
    type: z.literal("social"),
    content: socialContentSchema,
    order: z.number(),
  }),
]);

const blocksDataSchema = z.array(blockSchema).max(30, "Max 30 blocks allowed");

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await req.json();

    // Path 1: Save blocksData (auto-save draft)
    if (body.blocksData !== undefined) {
      const parsedBlocks = blocksDataSchema.parse(body.blocksData);
      
      // Extract title from the heading block
      let projectTitle = "My Linktree";
      const headingBlock = parsedBlocks.find(b => b.type === "heading");
      if (headingBlock && "title" in headingBlock.content && headingBlock.content.title) {
        projectTitle = headingBlock.content.title;
      }

      const project = await prisma.project.update({
        where: { id, userId: session.user.id },
        data: { 
          blocksData: parsedBlocks as any,
          title: projectTitle
        },
      });
      return NextResponse.json({ success: true, project });
    }

    // Path 2: Save pageSettings (background + card + layout + profile config)
    if (body.pageSettings !== undefined) {
      const pageSettingsSchema = z.object({
        type: z.enum(["color", "gradient", "image"]),
        color: z.string().optional(),
        gradient: z.string().optional(),
        imageUrl: z.string().optional(),
        storageKey: z.string().optional(),
        // Card styles
        cardBgColor: z.string().optional(),
        cardBgOpacity: z.number().min(0).max(100).optional(),
        cardTextColor: z.string().optional(),
        cardBorderColor: z.string().optional(),
        cardBorderOpacity: z.number().min(0).max(100).optional(),
        cardBlur: z.number().min(0).max(20).optional(),
        cardShowHeadingCard: z.boolean().optional(),
        // Overlay
        imageOverlayOpacity: z.number().min(0).max(100).optional(),
        backgroundOverlayOpacity: z.number().min(0).max(100).optional(),
        // Profile
        profileImageUrl: z.string().optional(),
        profileTitle: z.string().max(60).optional(),
        profileBio: z.string().max(150).optional(),
        showProfile: z.boolean().optional(),
        // Layout
        blockSpacing: z.number().min(0).max(40).optional(),
        fontFamily: z.string().optional(),
      });
      const parsedSettings = pageSettingsSchema.parse(body.pageSettings);
      const project = await prisma.project.update({
        where: { id, userId: session.user.id },
        data: { pageSettings: parsedSettings as any },
      });
      return NextResponse.json({ success: true, project });
    }

    return NextResponse.json({ error: "No valid data to update" }, { status: 400 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.warn("Validation warning on auto-save:", error.issues);
      return NextResponse.json({ error: "Validation Error", details: error.issues }, { status: 400 });
    }
    console.error("Auto-save PATCH error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const deletedProject = await prisma.project.delete({
      where: { id, userId: session.user.id },
    });

    return NextResponse.json({ success: true, project: deletedProject });
  } catch (error) {
    console.error("Delete project error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


