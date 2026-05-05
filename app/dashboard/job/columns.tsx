"use client"

import { ColumnDef } from "@tanstack/react-table"

export type Job = {
  id: number
  company: { name: string }
  title: string
  salary: string
  location: string
  deadline: string
  applied: boolean
}

export const columns: ColumnDef<Job>[] = [
  {
    accessorKey: "company.name",
    header: "Company",
  },
  {
    accessorKey: "title",
    header: "Role",
  },
  {
    accessorKey: "salary",
    header: "Salary",
    cell: ({ row }) => `₹${row.original.salary}`,
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "deadline",
    header: "Deadline",
    cell: ({ row }) =>
      new Date(row.original.deadline).toLocaleDateString(),
  },
  {
    accessorKey: "applied",
    header: "Applied",
    cell: ({ row }) => (row.original.applied ? "Yes" : "No"),
  },
]