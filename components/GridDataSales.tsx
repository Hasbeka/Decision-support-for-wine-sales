"use client";

import React from 'react'
import { ColumnDef } from "@tanstack/react-table"
import { SalesBetterFormat } from '@/app/types';

type Props = {}

export const columns: ColumnDef<SalesBetterFormat>[] = [
    {
        accessorKey: "salesID",
        header: "SalesID",
    },
    {
        accessorKey: "customerName",
        header: "Customer",
    },
    {
        accessorKey: "wineDesignation",
        header: "Wine Name",
    },
    {
        accessorKey: "quantity",
        header: "Quantity",
    },
    {
        accessorKey: "saleAmount",
        header: "Sale Amount",
    },
    {
        accessorKey: "saleDate",
        header: "Sale Date",
    },
    {
        accessorKey: "wineCategory",
        header: "Wine Category",
    },
    {
        accessorKey: "customerCountry",
        header: "Customer Country",
    },
    {
        accessorKey: "customerState",
        header: "Customer State",
    },
    {
        accessorKey: "wineCountry",
        header: "Wine origin country",
    },
]

const GridDataSales = (props: Props) => {
    return (
        <div>

        </div>
    )
}

export default GridDataSales