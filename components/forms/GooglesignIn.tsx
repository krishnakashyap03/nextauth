import { Button } from "../ui/button"

export const GoogleSignin = ({children}: {children: React.ReactNode}) => {
  const LoginwithGoogle = () => console.log("login with Google")

  return (
    <Button onClick={LoginwithGoogle} className="w-full">
      {children}
    </Button>
  )
}