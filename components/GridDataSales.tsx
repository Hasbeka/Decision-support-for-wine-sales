"use client";

import { ColumnDef } from "@tanstack/react-table"
import { SalesBetterFormat } from '@/app/types';
import { DataTable } from "./ui/data-table";

type GridProps = {
    sales: SalesBetterFormat[]
}

import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { parseDate } from "@/lib/utils";


export const columns: ColumnDef<SalesBetterFormat>[] = [
    {
        accessorKey: "saleID",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    SaleID
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "customerName",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Customer
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "wineDesignation",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Wine Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "quantity",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Quantity
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "saleAmount",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Amount
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("saleAmount"))
            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
            }).format(amount)

            return <div className="text-right font-medium">{formatted}</div>
        },
    },

    {
        accessorKey: "saleDate",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        sortingFn: (rowA, rowB, columnId) => {
            const dateA = parseDate(rowA.getValue(columnId));
            const dateB = parseDate(rowB.getValue(columnId));
            if (!dateA || !dateB) return 0;
            return dateA.getTime() - dateB.getTime();
        },

        filterFn: (row, columnId, filterValue) => {

            if (typeof filterValue === 'string') {
                // Pentru search normal
                const dateStr = row.getValue(columnId) as string;
                const date = parseDate(dateStr);
                if (!date) return false;


                const formatted = date.toLocaleDateString("en-US", {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                });

                return formatted.toLowerCase().includes(filterValue.toLowerCase()) ||
                    dateStr.toLowerCase().includes(filterValue.toLowerCase());
            } else {

                const dateStr = row.getValue(columnId) as string;
                const date = parseDate(dateStr);

                if (!date) return false;

                const { from, to } = filterValue as { from: string; to: string };

                if (!from && !to) return true;

                date.setHours(0, 0, 0, 0);

                const fromDate = from ? new Date(from) : null;
                const toDate = to ? new Date(to) : null;

                if (fromDate) {
                    fromDate.setHours(0, 0, 0, 0);
                }
                if (toDate) {
                    toDate.setHours(0, 0, 0, 0);
                }

                if (fromDate && date < fromDate) return false;
                if (toDate && date > toDate) return false;

                return true;
            }
        }
    },
    {
        accessorKey: "wineCategory",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Wine Category
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "customerState",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Customer State
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "wineCountry",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Wine Origin Country
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },

]

const GridDataSales = (props: GridProps) => {
    return (
        <div>
            <DataTable columns={columns} data={props.sales} />
        </div>
    )
}

export default GridDataSales