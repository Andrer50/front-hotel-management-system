import axios from "axios";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions, User } from "next-auth";
import type { JWT } from "next-auth/jwt";
import { ApiResponse } from "@/shared";

const BACKEND_URL = process.env.BACKEND_URL!;

interface DjangoUser {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  phone?: string;
  status?: string;
}

interface LoginResponseData {
  access: string;
  refresh: string;
  user: DjangoUser;
}

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const { data } = await axios.post<ApiResponse<{ access: string }>>(
      `${BACKEND_URL}/api/hotel/token/refresh`,
      { refresh: token.refreshToken },
    );

    return {
      ...token,
      accessToken: data.data.access,
      accessTokenExpires: Date.now() + 24 * 60 * 60 * 1000,
    };
  } catch (error) {
    console.error("Error refreshing access token", error);
    return { ...token, error: "AccessTokenExpired" };
  }
}

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<User | null> {
        try {
          const { data: response } = await axios.post<
            ApiResponse<LoginResponseData>
          >(`${BACKEND_URL}/api/hotel/login`, {
            username: credentials?.username,
            password: credentials?.password,
          });

          const code = parseInt(response.code);
          if (isNaN(code) || code < 200 || code >= 300 || !response.data) {
            return null;
          }

          const { user, access, refresh } = response.data;

          return {
            id: user.id.toString(),
            email: user.email,
            name: `${user.first_name} ${user.last_name}`,
            profilePicture: "",
            phone: user.phone || "",
            role: user.role,
            status: user.status || "ACTIVE",
            accessToken: access,
            refreshToken: refresh,
          };
        } catch (error) {
          if (axios.isAxiosError(error)) {
            const msg =
              error.response?.data?.message || "Credenciales inválidas";
            throw new Error(msg);
          }
          throw new Error("Error inesperado en la autenticación");
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }): Promise<JWT> {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.phone = user.phone;
        token.role = user.role;
        token.status = user.status;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.accessTokenExpires = Date.now() + 24 * 60 * 60 * 1000;
      }

      if (Date.now() < token.accessTokenExpires) {
        return token;
      }

      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.accessTokenExpires = token.accessTokenExpires;
      session.error = token.error;
      session.user = {
        id: token.id,
        email: token.email,
        name: token.name,
        phone: token.phone,
        role: token.role,
        status: token.status,
      };
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
