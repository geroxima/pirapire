"use client";
import { AvatarImage, Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/ui/tabs";
import {
  CardTitle,
  CardHeader,
  CardContent,
  Card,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { ResponsiveBar } from "@nivo/bar";
import { IncomeDialog } from "@/components/add-income";
import { ExpenseDialog } from "@/components/add-expense";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { ExitIcon } from "@radix-ui/react-icons";
import { toast } from "./ui/use-toast";

export function Dashboard() {
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const fetchIncomes = async () => {
      const response = await axios.get("http://localhost:8000/api/incomes/");
      setIncomes(response.data);
    };

    const fetchExpenses = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/expenses/");
        setExpenses(response.data);
      } catch (error) {
        console.error("There was an error fetching the expenses", error);
      }
    };

    fetchIncomes();
    fetchExpenses();
  }, []);

  const expensesData = expenses.map((expense) => ({
    name: expense.title,
    date: new Date(expense.createdAt).toLocaleDateString("en-GB"),
    count: expense.amount,
  }));

  const incomesData = incomes.map((income) => ({
    name: income.title,
    date: new Date(income.createdAt).toLocaleDateString("en-GB"),
    count: income.amount,
  }));

  const totalTransactions = incomes.length + expenses.length;

  const handleSingOut = async () => {
    try {
      await axios.delete("http://localhost:8000/api/session/");
      window.location.href = "/login";
      toast({
        description: "You have been signed out",
      })
    } catch (error) {
      console.error("There was an error signing out", error);
      toast({
        variant: "destructive",
        description: "Uh oh! Something went wrong.",
      
      })
    }
  }

  return (
    <div className="bg-white min-h-screen text-gray-900">
      <div className="flex flex-col md:flex-row">
        <main className="flex-1 p-5 md:p-10">
          <header className="flex justify-between items-center mb-4 md:mb-10">
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900">
              Hi, Welcome back 👋
            </h1>
            <Button variant="outline" onClick={handleSingOut}>
              Sign Out
              <ExitIcon className="size-4 ml-2" />
            </Button>
          </header>
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2 md:gap-2 mb-6">
                <Card className="bg-white rounded-lg">
                  <CardHeader>
                    <CardTitle>Total expenses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-semibold text-gray-900">
                      ₲
                      {incomes.reduce(
                        (total, income) => total + income.amount,
                        0,
                      )}
                    </p>
                    <p className="text-sm text-green-500">
                      +20.1% from last month
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-lg">
                  <CardHeader>
                    <CardTitle>Total Incomes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-semibold text-gray-900">
                      ₲
                      {expenses.reduce(
                        (total, expense) => total + expense.amount,
                        0,
                      )}
                    </p>
                    <p className="text-sm text-red-500">
                      -20.1% from last month
                    </p>
                  </CardContent>
                </Card>
              </div>
              <section className="space-y-5">
                <BarChart
                  expensesData={expensesData}
                  className="w-full h-[300px] p-5 rounded-lg border-2 border-black-800 border-solid"
                />
                <BarChart
                  expensesData={incomesData}
                  className="w-full h-[300px] p-5 rounded-lg border-2 border-black-800 border-solid"
                />
              </section>
            </div>
            <div className="w-full md:w-80">
              <Card className="bg-gray-100 rounded-lg h-full">
                <CardHeader>
                  <CardTitle>Recent Financial Movements</CardTitle>
                  <CardDescription>
                    You had {totalTransactions} transactions this month.
                  </CardDescription>
                  <IncomeDialog></IncomeDialog>
                  <ExpenseDialog></ExpenseDialog>
                </CardHeader>
                <div>
                  {incomes.map((income) => (
                    <CardContent key={income.id}>
                      <div className="flex flex-col space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-gray-900">{income.title}</h3>
                            <p className="text-xs text-gray-400">
                              {income.description}
                            </p>
                          </div>
                          <p className="text-green-500">₲{income.amount}</p>
                        </div>
                      </div>
                    </CardContent>
                  ))}
                  {expenses.map((expense) => (
                    <CardContent key={expense.id}>
                      <div className="flex flex-col space-y-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-gray-900">{expense.title}</p>
                            <p className="text-xs text-gray-400">
                              {expense.description}
                            </p>
                          </div>
                          <p className="text-red-500">₲{expense.amount}</p>
                        </div>
                      </div>
                    </CardContent>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function BarChart({ expensesData, ...props }) {
  function formatTick(value) {
    if (value >= 1e9) {
      return (value / 1e9).toFixed(1) + "B";
    }
    if (value >= 1e6) {
      return (value / 1e6).toFixed(1) + "M";
    }
    if (value >= 1e3) {
      return (value / 1e3).toFixed(1) + "K";
    }
    return value;
  }

  return (
    <div {...props}>
      <ResponsiveBar
        data={expensesData}
        keys={["count"]}
        indexBy={(d) => `${d.name} ${d.date}`}
        margin={{ top: 20, right: 0, bottom: 40, left: 40 }}
        padding={0.3}
        colors={["#6e6e6"]}
        axisBottom={{
          tickSize: 0,
          tickPadding: 16,
        }}
        axisLeft={{
          tickSize: 0,
          tickValues: 10,
          tickPadding: 6,
          format: formatTick,
        }}
        gridYValues={4}
        borderRadius={6}
        theme={{
          tooltip: {
            chip: {
              borderRadius: "10px",
            },
            container: {
              fontSize: "12px",
              textTransform: "capitalize",
              borderRadius: "6px",
            },
          },
          grid: {
            line: {
              stroke: "#f3f4f6",
            },
          },
        }}
        tooltipLabel={({ id }) => `${id}`}
        enableLabel={false}
        role="application"
        ariaLabel="A bar chart showing data"
      />
    </div>
  );
}
