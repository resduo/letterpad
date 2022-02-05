import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextApiRequest, NextApiResponse } from "next";
import { basePath } from "@/constants";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const providers = (_req: NextApiRequest) => [
  CredentialsProvider({
    name: "Credentials",
    credentials: {
      email: { label: "Email" },
      password: { label: "Password", type: "password" },
    },
    authorize: async (credentials): Promise<any> => {
      try {
        const author = await prisma.author.findFirst({
          where: { email: credentials?.email },
          include: {
            role: true,
            permissions: true,
          },
        });
        if (author) {
          if (!author.verified) {
            throw new Error("Your email id is not verified yet.");
          }
          const authenticated = await bcrypt.compare(
            credentials?.password || "",
            author.password,
          );
          if (authenticated) {
            const user = {
              id: author.id,
              avatar: author.avatar,
              username: author.username,
              name: author.name,
              email: author.email,
              role: author.role.name,
              permissions: author.permissions.map(({ name }) => name),
            };
            return user;
          }
        }
      } catch (e) {
        throw Error(e);
      }
    },
  }),
];

const options = (req: NextApiRequest): NextAuthOptions => ({
  providers: providers(req),
  callbacks: {
    redirect: async ({ url, baseUrl }) => {
      if (url.startsWith(baseUrl)) {
        return url;
      }
      return process.env.ROOT_URL + "/posts";
    },
    jwt: async ({ token, user }) => {
      //  "user" parameter is the object received from "authorize"
      //  "token" is being send to "session" callback...
      //  ...so we set "user" param of "token" to object from "authorize"...
      //  ...and return it...
      token.user = user;
      return token;
    },
    session: async ({ session, token }) => {
      try {
        const author = await prisma.author.findFirst({
          //@ts-ignore
          where: { id: parseInt(token.sub) },
          include: {
            role: true,
          },
        });
        if (author) {
          const { id, email, username, avatar, name } = author;
          session.user = {
            id,
            email,
            username,
            name,
            avatar,
            role: author.role.name,
          } as any;
        }
      } catch (e) {
        console.log(e);
      }
      return session;
    },
  },
  jwt: {
    secret: process.env.SECRET_KEY,
  },
  pages: {
    signIn: `${basePath}/login`,
  },
  secret: process.env.SECRET_KEY,
});

export default (req: NextApiRequest, res: NextApiResponse) =>
  NextAuth(req, res, options(req));
