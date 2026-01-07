 import logo from "@/assets/doramar.png"
import { LoginComponent } from "@/components/login"
 
export function LoginPage() {
  
  return (
    <div className="flex flex-col justify-center md:justify-center items-center h-screen gap-12 p-4">
      <img className="h-24 w-50 mb-24" src={logo} />
       <LoginComponent />
    </div>
  )
}
