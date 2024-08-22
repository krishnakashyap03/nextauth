'use client'
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { GoogleSignin } from "./GooglesignIn"
import { SignIn } from "../signin"
import { useRouter } from "next/navigation"

const FormSchema = z.object({
  email: z.string().min(2, {
    message: "Email must be at least 2 characters.",
  }).email(),
  password: z.string().min(1, { message : "please enter the password"}).min(8, {message: "Password must be longer than 8 chars"})
})

export const SignInForm = () => {
  const router = useRouter()
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })
  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    const signindata = await SignIn(values.email, values.password)
    
    form.reset()
  }
  return (
    <div className="text-black">
    <Form {...form} >
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <div className="space-y-2">
          <FormField 
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem >
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter email" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your password" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" className="w-full mt-2">Submit</Button>
      </form>
      <div className="mx-auto my-4 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-slate-400 after:ml-4 after:block after:h-px after:flex-grow after:bg-slate-400">
        or
      </div>
      <GoogleSignin>
          Sign Up with Google
      </GoogleSignin>
      <p className="text-center text-sm text-gray-600 mt-2">
        If you Don&apos;t have an account, Please&nbsp;
        <Link className="text-blue-500 hover:underline" href="/sign-up">Sign Up</Link>
      </p>
    </Form>
    </div>
  )
}
