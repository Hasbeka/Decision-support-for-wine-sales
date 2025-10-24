import { Customer, Sale } from "@/app/types";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function fromStringToArray(str: string): string[] {
  if (!str) return [];
  return str.split(',').map(s => s.trim());
}

export function toCustomer(obj: any): Customer {
  return {
    customerID: obj.CustomerID,
    name: obj.Name,
    email: obj.Email,
    phone: obj.Phone,
    address: obj.Address,
    age: obj.Age,
    gender: obj.Gender,
    purchaseHistory: fromStringToArray(obj.PurchaseHistory),
    loyaltyPoints: obj.LoyaltyPoints
  };
}

export function toSales(obj: any): Sale {
  return {
    saleID: obj.SaleID,
    customerID: obj.CustomerID,
    wineDesignation: obj.WineDesignation,
    quantity: obj.Quantity,
    saleAmount: obj.SaleAmount,
    saleDate: new Date(obj.SaleDate)
  }
}
