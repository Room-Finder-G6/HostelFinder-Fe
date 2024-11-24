import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { AuthOptions } from "next-auth";
import { pages } from "next/dist/build/templates/app-page";

// Configure NextAuth options
const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
    
  ],
  // Thêm các tùy chọn khác nếu cần
};

const handler = NextAuth(authOptions);

// Export các handler cho HTTP methods
export { handler as GET, handler as POST };
