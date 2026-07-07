import NextAuth from "next-auth"
import authConfig from "./auth.config"
import { prisma } from "./lib/prisma"

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        if (!user.email) return false;
        
        // Simpan / sinkronisasi data user ke database
        await prisma.user.upsert({
          where: { email: user.email },
          update: {
            name: user.name,
            image: user.image,
          },
          create: {
            email: user.email,
            name: user.name,
            image: user.image,
          },
        });
        return true;
      }
      return false;
    },
    async session({ session, token }) {
      if (session.user && token.email) {
        // Ambil ID user dari database untuk disisipkan ke session
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email as string }
        });
        if (dbUser) {
          session.user.id = dbUser.id;
        }
      }
      return session;
    }
  },
  session: { strategy: "jwt" }
})
