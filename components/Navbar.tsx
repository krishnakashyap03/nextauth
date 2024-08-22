import Link from "next/link"
import { buttonVariants } from "./ui/button"

export const Navbar = () => {
  return (
    <div className="h-10 w-full bg-slate-400 fixed z-10 px-10 ">
      <Link className={buttonVariants()} href='/sign-in'>SignIn</Link>
    </div>
  )
}