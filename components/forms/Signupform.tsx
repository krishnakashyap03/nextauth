'use client'
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { GoogleSignin } from "./GooglesignIn"
import axios from 'axios'
import { useRouter } from "next/navigation"

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

export const SignUpForm = () => {
  const router = useRouter()
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
      username: "",
      confirmPassword: "",
    },
  })
  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    const response = await axios.post("/api/user",values)

    if(response.statusText == "Created"){
      router.push("/sign-in")
    }
    router.refresh()
    form.reset()
  }
  return (
    <div className="text-black">
    <Form {...form} >
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <div className="space-y-2">
        <FormField 
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem >
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Enter username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Re-Enter Password</FormLabel>
                <FormControl>
                  <Input placeholder="confirm password" type="password" {...field} />
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
        If you already have an account, Please&nbsp;
        <Link className="text-blue-500 hover:underline" href="/sign-in">Sign In</Link>,
      </p>
    </Form>
    </div>
  )
}
