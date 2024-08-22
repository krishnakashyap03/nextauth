import  db  from "@/lib/db"
import { hashSync } from "bcrypt-ts"
import { NextRequest, NextResponse } from "next/server"
import z from 'zod'

const FormSchema = z.object({
  email: z.string().min(2, {
    message: "Email must be at least 2 characters.",
  }).email(),
  password: z.string().min(1, { message : "Please enter the password"}).min(8, {message: "Password must be longer than 8 chars"}),
  username: z.string().min(1, { message : "Username is required"}),
  confirmPassword: z.string().min(1, { message : "Password is Required"}).min(8, {message: "Password must be longer than 8 chars"}),
}).refine((data) => data.password === data.confirmPassword, {
  path: ['confirmPassword'],
  message: "Password do not Match"
})

export const POST = async (req: NextRequest) => {
  try {
    const { email, password, username } = FormSchema.parse(await req.json())

    const existingEmail = await db.user.findUnique({
      where: {
        email: email
      }
    })
    if(existingEmail){
      return NextResponse.json({user: null, message:"User exists with this email" }, {status: 401})
    }
    const existingusername = await db.user.findUnique({
      where: {
        username: username
      }
    })
    if(existingusername){
      return NextResponse.json({user: null, message:"User exists with this username" }, {status: 401})
    }
    const hashedPassword = hashSync(password, 10)
    const newProfile  = await db.user.create({
      data: {
        email,
        username,
        password: hashedPassword
      }
    })
    const {password: newProfilePassword, ...rest} = newProfile

    return NextResponse.json({user: rest, message: "User created Successfully"}, {status: 201})
  } catch (error) {
    return new NextResponse("Profile Not created", {status: 500})
  }
}