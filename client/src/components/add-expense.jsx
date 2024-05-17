'use client'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowBottomRightIcon } from "@radix-ui/react-icons"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/components/ui/use-toast"


import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

import React, { useState } from 'react';
import axios from 'axios';

export function ExpenseDialog() {

  const { toast } = useToast()


  const [data, setData] = useState(
    {
      title: '',
      description: '',
      amount: 0,
      tags: 'General',
    }
  )

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.id]: e.target.value
    });
  }

  const handleSelect = (value) => {
    setData(prevData => ({
      ...prevData,
      tags: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    console.log(data);
    axios.post(`http://localhost:8000/api/expenses/`, data)
    .then((response) => {
      toast({
        description: "Expense added!",
      })
      console.log(response);
    })
    .catch((error) => {
      toast({
        variant: "destructive",
        description: "Uh oh! Something went wrong.",
      })
      console.log(error);
    });
  }

  return (
    <Dialog>
      
      <DialogTrigger asChild >
        <Button variant="outline" ><ArrowBottomRightIcon className="mr-1 size-4"/> Add Expenses</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]" >
        <DialogHeader>
          <DialogTitle>Add a new expense</DialogTitle>
          <DialogDescription>
            Add the title, description, and amount of the expense.
          </DialogDescription>
        </DialogHeader>


      <form onSubmit={handleSubmit} className="flex flex-col justify-between gap-6">
        <section className="flex flex-row gap-28">


        </section>
        <div className="space-y-5">
          <div className="flex gap-5 items-center">
            <Label>Title</Label>
            <Input required id="title"  onChange={handleChange} placeholder="Transaction title"/>
          </div>
          <div className="flex gap-5 items-center">
            <Label>Description</Label>
            <Input required id="description"  onChange={handleChange} placeholder="A brief description" />
          </div>
          <div className="flex gap-5 items-center">
            <Label>Amount</Label>
            <Input required id="amount"  type="number" onChange={handleChange} />
          </div>
        </div>


        <Select onChange={handleSelect}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent >
              <SelectGroup>
                <SelectLabel>Expenses</SelectLabel>
                <SelectItem value="food">Food</SelectItem>
                <SelectItem value="transport">Transport</SelectItem>
                <SelectItem value="utilities">Utilities</SelectItem>
                <SelectItem value="health">Health</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        <DialogTrigger><Button type="submit">Save Changes</Button></DialogTrigger>
      </form>
      </DialogContent>
    </Dialog>
  )
}
