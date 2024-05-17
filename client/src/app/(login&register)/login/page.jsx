'use client'
import { Login } from "@/components/login"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"

const LoginPage = () => {

    const {toast} = useToast()

    return(
        <div className="flex justify-center items-center h-screen">
            <Login /> 
        </div>
    )
}

export default LoginPage