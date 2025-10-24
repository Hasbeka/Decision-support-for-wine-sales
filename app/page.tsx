import { readCsv } from "@/lib/CsvReader";
import { GeneralCustomerInfo } from "./types";
import { calculateAvgAge, calculateAvgLoyaltyPoints, calculateGenderPercentages, calculateMaxAge, calculateMinAge, getTheMostCommonGender } from "@/lib/GeneralCustInfo";
import { toCustomer, toSales } from "@/lib/utils";
import MainStatistics from "@/components/MainStatistics";
import { calculateAvgSaleAmount, calculateTotalRevenue, compareWithPreviousMonth, getBestSellingWine, getCustomerWithHighestPurchase, getMonthlySales, getWorstSellingWine } from "@/lib/GeneralSalesInfo";


export default async function Home() {

  // Customer Data
  const customerData = await readCsv('Customers_Dataset.csv');
  const customerList = customerData.map(toCustomer);
  const generalCustomerInfo: GeneralCustomerInfo = {
    total: customerList.length,
    avgAge: calculateAvgAge(customerList),
    avgLoyaltyPoints: calculateAvgLoyaltyPoints(customerList),
    gender: getTheMostCommonGender(customerList),
    minAge: calculateMinAge(customerList),
    maxAge: calculateMaxAge(customerList),
    womenPercentage: calculateGenderPercentages(customerList).womenPercentage,
    menPercentage: calculateGenderPercentages(customerList).menPercentage
  }

  // Sales data
  const salesData = await readCsv('Sales_Data_Dataset.csv');
  const salesList = salesData.map(toSales);
  const generalSalesInfo = {
    totalSales: salesList.length,
    totalRevenue: calculateTotalRevenue(salesList),
    avgSaleAmount: calculateAvgSaleAmount(salesList),
    bestSellingWine: getBestSellingWine(salesList),
    worstSellingWine: getWorstSellingWine(salesList),
    customerWithHighestPurchase: getCustomerWithHighestPurchase(salesList, customerList)
  };
  const amountOnMonths = getMonthlySales(salesList);
  const salesComparison = compareWithPreviousMonth(salesList);

  return (
    <div className="min-h-screen w-full  bg-zinc-50 font-sans dark:bg-black" >
      <MainStatistics customerData={generalCustomerInfo} salesData={generalSalesInfo} amountOnMonths={amountOnMonths} salesComparison={salesComparison} />
    </div >
  );
}
