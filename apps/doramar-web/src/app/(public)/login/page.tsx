import logo from "@/assets/doramar.png"
import LoginComponent from "@/components/login"
import Image from "next/image"

export default function Login() {
  
  return (
    <div className="flex flex-col justify-center md:justify-center items-center h-screen gap-12 p-4">
      <Image className="h-24 w-42 mb-24" src={logo} alt="logo" />
      <LoginComponent />
    </div>
  )
}
