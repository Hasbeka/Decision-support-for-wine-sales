import SalesPage from "@/components/SalesPage";
import { useCustomersStore } from "../stores/Customers";
import { useLocationsStore } from "../stores/Locations";
import { useSalesStore } from "../stores/Sales";
import { useWineStore } from "../stores/Wine";
import SalesChartOnCategory from "@/components/SalesChartOnCategory";


const page = async () => {

    // Sales data
    await useSalesStore.getState().setSales();
    const salesList = useSalesStore.getState().sales;

    // Customer data
    await useCustomersStore.getState().setCustomers();
    const customerList = useCustomersStore.getState().customers;

    // locations data
    await useLocationsStore.getState().setLocations();
    const locationsList = useLocationsStore.getState().locations;


    // Wine data
    await useWineStore.getState().setWines();
    const wineList = useWineStore.getState().wines;


    // Sales better format 
    useSalesStore.getState().getSalesBetterFormat();
    const salesBetterFormat = useSalesStore.getState().salesBetterFormat;
    const salesSummaryOnCat = useSalesStore.getState().montlySalesOnCategory();
    // console.log(salesSummaryOnCat)
    const salesComparison = useSalesStore.getState().salesComparison();

    return (
        <div className="min-h-screen w-full  bg-zinc-50 font-sans dark:bg-black" >
            <SalesPage sales={salesBetterFormat} />
            <SalesChartOnCategory salesData={salesSummaryOnCat} />
        </div>
    )
}

export default page