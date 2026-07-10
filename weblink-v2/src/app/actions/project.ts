"use server";

import { prisma } from "src/lib/prisma";
import { auth } from "auth";
import { revalidatePath } from "next/cache";

export async function updateProjectSlug(projectId: string, newSlug: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  // 1. Clean and validate slug
  const slug = newSlug.trim().toLowerCase();
  
  if (!slug) {
    return { error: "Slug tidak boleh kosong" };
  }

  // Regex validation: letters, numbers, hyphens, and underscores only
  const slugRegex = /^[a-z0-9-_]+$/;
  if (!slugRegex.test(slug)) {
    return { error: "Slug hanya boleh berisi huruf, angka, tanda hubung (-), dan garis bawah (_)" };
  }

  // System reserved words check
  const reservedWords = ["dashboard", "login", "api", "editor", "support", "components", "admin", "settings", "profile"];
  if (reservedWords.includes(slug)) {
    return { error: "Slug ini merupakan kata kunci sistem dan tidak dapat digunakan" };
  }

  try {
    // 2. Check if slug belongs to another project
    const existingProject = await prisma.project.findUnique({
      where: { slug },
    });

    if (existingProject && existingProject.id !== projectId) {
      return { error: "Slug sudah digunakan oleh pengguna lain" };
    }

    // 3. Verify project ownership before update
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project || project.userId !== session.user.id) {
      return { error: "Proyek tidak ditemukan atau Anda tidak memiliki akses" };
    }

    // 4. Update slug
    await prisma.project.update({
      where: { id: projectId },
      data: { slug },
    });

    revalidatePath("/dashboard");
    revalidatePath(`/${slug}`);

    return { success: true };
  } catch (error: any) {
    console.error("Failed to update project slug:", error);
    return { error: "Gagal menyimpan perubahan ke database" };
  }
}
