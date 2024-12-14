import NextAuth, { DefaultSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { AuthOptions } from "next-auth";
// Configure NextAuth options
const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
      authorization: {
        params: {
          redirect_uri: process.env.NEXTAUTH_URL ? `${process.env.NEXTAUTH_URL}/api/auth/callback/google` : 'https://phongtro247.net/api/auth/callback/google'
        }
      }
    }),
  ],
  secret : process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.id = account.id_token!; 
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.idToken = token.id as string; 
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
  },
};

const handler = NextAuth({
  ...authOptions,
  debug: true,
  logger: {
    error: (code, ...message) => {
      console.error(code, message)
    },
    warn: (code, ...message) => {
      console.warn(code, message)
    },
    debug: (code, ...message) => {
      console.debug(code, message)
    },
  },
})


export { handler as GET, handler as POST };
