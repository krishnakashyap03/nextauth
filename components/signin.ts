'use server'
import { signIn } from "@/auth"
import { redirect } from "next/navigation"

export const SignIn = async (email: string, password: string) => {

  const response = await signIn('credentials',{ email: email, password: password, redirect: false})

  console.log(response?.ok) // do your checks
}