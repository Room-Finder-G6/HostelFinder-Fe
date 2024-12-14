import NextAuth, { DefaultSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { AuthOptions } from "next-auth";
// Configure NextAuth options
const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
      authorization :{
        params : {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.id = account.id_token!; 
      }
      return token;
    },
    // async session({ session, token }) {
    //   if (session.user) {
    //     session.user.idToken = token.id as string; 
    //   }
    //   return session;
    // },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
