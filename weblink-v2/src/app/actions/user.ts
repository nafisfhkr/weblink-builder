"use server"

import { auth } from "auth";
import { prisma } from "src/lib/prisma";
import bcrypt from "bcryptjs";

export async function updatePassword(password: string) {
  const session = await auth();

  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters long");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { email: session.user.email },
    data: { password: hashedPassword },
  });

  return { success: true };
}
