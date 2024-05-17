"use client";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

export function Register() {

  const { toast } = useToast();

  const router = useRouter();

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState("");

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    console.log(data);
  
    try {
      const response = await axios.post('http://localhost:8000/api/users', data, { withCredentials: true });
      router.push('/login');
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Uh oh! Something went wrong.",
      })
      if (error.response) {
        setErrors(error.response.data.errors);
      }
    }
  };

  return (
    <Card className="mx-auto max-w-sm shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Register</CardTitle>
        <CardDescription>
          Please provide the following details to create your account and access
          our services
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="flex gap-5">
            <div>
              <Label htmlFor="email">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                placeholder="Your Name"
                required
                type="text"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="email">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                placeholder="Your Last Name"
                required
                type="text"
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              placeholder="Enter your email"
              required
              type="text"
              onChange={handleChange}
            />
            {/* {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )} */}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              required
              type="password"
              onChange={handleChange}
            />
            {/* {errors.password && (
              <p className="text-red-500">{errors.password.message}</p>
            )} */}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Confirm Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              required
              type="password"
              onChange={handleChange}
            />
            {/* {errors.password && (
              <p className="text-red-500">{errors.password.message}</p>
            )} */}
          </div>
          <Button className="w-full" type="submit">
            Register
          </Button>
          <p className="text-sm text-right">
            Already have an account?{" "}
            <a className="text-bold underline" href="/login">
              Login
            </a>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
