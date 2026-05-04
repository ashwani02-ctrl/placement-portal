// columns.ts
import { ColumnDef } from "@tanstack/react-table"
import { Student } from "./page" // adjust path

export const columns: ColumnDef<Student>[] = [
  {
    accessorKey: "id",
    header: "id"
  },
  {
    accessorKey: "user",
    header: "User",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "course",
    header: "Course",
  },
  {
    accessorKey: "batch",
    header: "Batch",
  },
]