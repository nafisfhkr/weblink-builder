import NextAuth from "next-auth"
import authConfig from "./auth.config"
import { prisma } from "./src/lib/prisma"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

const nextAuth = NextAuth({
  ...authConfig,
  providers: [
    ...authConfig.providers,
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials as Record<string, any>;
        if (!email || !password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: email as string },
        });

        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          password as string,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],
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
      if (account?.provider === "credentials") {
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
