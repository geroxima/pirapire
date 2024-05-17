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
import { PlusIcon, ArrowTopRightIcon} from "@radix-ui/react-icons"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

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

export function IncomeDialog() {

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
    axios.post(`http://localhost:8000/api/incomes/`, data)
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
  }

  return (
    <Dialog>
      
      <DialogTrigger asChild >
        <Button variant="outline" ><ArrowTopRightIcon className="mr-1 size-4"/> Add Income</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]" >
        <DialogHeader>
          <DialogTitle>Add a new income</DialogTitle>
          <DialogDescription>
            Add the title, description, and amount of the income.
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
                <SelectLabel>Income</SelectLabel>
                <SelectItem id="tags" value="salary">Salary</SelectItem>
                <SelectItem id="tags" value="freelance">Freelance</SelectItem>
                <SelectItem id="tags" value="investments">Investments</SelectItem>
                <SelectItem id="tags" value="other">Other</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        <DialogTrigger><Button type="submit">Save Changes</Button></DialogTrigger>
      </form>
      </DialogContent>
    </Dialog>
  )
}
