"use client"
import { Button } from "@/components/ui/button"
import { ChevronRightIcon } from "@radix-ui/react-icons"
import { useRouter } from 'next/navigation'
import TopBar, {Topbar} from "@/components/TopBar"
import { Login } from "@/components/login"
import { LandingPage } from "@/components/landing-page"


import { useState } from 'react';
import axios from 'axios';

export default function Home() {


  const router = useRouter();

  const handleDelete = async () => {
    axios.delete('http://localhost:8000/api/session/')
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getAllUsers = async () => {
    axios.get('http://localhost:8000/api/users/')
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  

  return (
    <main>
      <div className="absolute top-0 -z-10 h-full w-full bg-white">
      <div class="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]"><div class="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#C9EBFF,transparent)]"></div></div>      </div>
      <section>
        <LandingPage></LandingPage>
        {/* <h1 className="text-5xl font-bold mx-auto max-w-sm">LANDING PAGE</h1>
       <Button onClick={() => router.push('/login')} >
          Get Started 
          <ChevronRightIcon className="h-4 w-4" />
        </Button> */}
      </section>
    </main>
  );
}
