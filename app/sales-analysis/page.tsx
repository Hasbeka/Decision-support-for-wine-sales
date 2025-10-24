import { useCustomersStore } from "../stores/Customers";
import { useLocationsStore } from "../stores/Locations";
import { useSalesStore } from "../stores/Sales";
import { useWineStore } from "../stores/Wine";


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
    const salesBetterFormat = useSalesStore.getState().getSalesBetterFormat();

    return (
        <div>This is Sales Analysis</div>
    )
}

export default page