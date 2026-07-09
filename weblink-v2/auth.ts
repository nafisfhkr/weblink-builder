import NextAuth from "next-auth"
import authConfig from "./auth.config"
import { prisma } from "./src/lib/prisma"

const nextAuth = NextAuth({
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

export const { handlers, signIn, signOut } = nextAuth;

export const auth = async (...args: any[]) => {
  if (process.env.PLAYWRIGHT_TEST === "true") {
    try {
      await prisma.user.upsert({
        where: { id: "test-user-id" },
        update: {
          image: null
        },
        create: {
          id: "test-user-id",
          email: "test@example.com",
          name: "Test User",
          image: null
        }
      });
    } catch (e) {
      console.error("Failed to upsert test user in auth mock:", e);
    }
    return {
      user: {
        id: "test-user-id",
        name: "Test User",
        email: "test@example.com",
        image: null
      }
    };
  }
  try {
    return await (nextAuth.auth as any)(...args);
  } catch (error: any) {
    // Next.js redirect() throws an error with a specific digest
    if (error?.digest && error.digest.startsWith('NEXT_REDIRECT')) {
      throw error;
    }
    
    // Catch JWTSessionError or any other Auth errors to prevent crashing the page
    console.warn("Caught Auth Error (likely JWTSessionError). Returning null session. Please clear your cookies if this persists.", error.message);
    return null;
  }
};
