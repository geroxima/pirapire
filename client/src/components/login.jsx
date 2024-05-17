"use client"
import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"


export function Login() {

  const { toast } = useToast()
  const router = useRouter();
  

  const [data, setData] = useState(
    {
      email: '',
      password: ''
    }
  );

  const [errors, setErrors] = useState('');

  const handleLogIn = (e) => {
    e.preventDefault();
    console.log(data);
    axios.post('http://localhost:8000/api/session/', data)
      .then((response) => {
        toast({
          description: "Logged successfully!",
        })
        console.log(response);
        router.push('/dashboard');
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          description: "Uh oh! Something went wrong.",
        })

        console.log(error);
        if(error.message){
          setErrors(error.response.data.errors);
        }
      });
  }

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value
    });
  }

  return (
    
    (<Card className="mx-auto max-w-sm shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Login</CardTitle>
        <CardDescription>Enter your email and password to login to your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogIn} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" placeholder="Enter your email" required type="text" onChange={handleChange} />
            {errors.email && <p className="text-red-500">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" required type="password" onChange={handleChange} />
            {errors.password && <p className="text-red-500">{errors.password.message}</p>}
          </div>
          <Button className="w-full" type="submit">
            Login
          </Button>
          <p className="text-sm text-right">Don't have an account? <a className="text-bold underline" href="/register">Register</a></p>
        </form>
      </CardContent>
    </Card>)
  );
}
