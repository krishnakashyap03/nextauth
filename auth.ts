import NextAuth from "next-auth"
import  Credentials  from "next-auth/providers/credentials"
import * as z from 'zod'
import { PrismaAdapter } from "@auth/prisma-adapter"
import db from "./lib/db"
import { compareSync } from "bcrypt-ts"

const SignInSchema = z.object({
  email: z.string().min(2, {
    message: "Email must be at least 2 characters.",
  }).email(),
  password: z.string().min(1, { message : "please enter the password"}).min(8, {message: "Password must be longer than 8 chars"})
})

 
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    Credentials ({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials){
        const { email, password } = SignInSchema.parse(credentials)

        try {
          if(!email || !password){
            throw new Error("Invalid credentials");
          }
          const existingUser = await db.user.findUnique({
            where: {email: email}
          })
          if(!existingUser){
            throw new Error(`User ${credentials?.email} not found`);
          }
          const passwordMatch = compareSync(password, existingUser.password)
          if(!passwordMatch){
            throw new Error(`User ${credentials?.email} not macth`);
          }
          return existingUser
          
        } catch (error) {
          console.log("Error", error)
          return new Error("Wrong Credentials")
        }
      }
    })
  ],
  secret: process.env.NEXT_AUTHSECRET,
  pages: {
    signIn: "/sign-in"
  },
  debug: true,
})