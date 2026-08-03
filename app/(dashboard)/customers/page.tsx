import { AddCustomerDialog } from "@/components/customers/add-customer-dialog";
import { CustomerTable } from "@/components/customers/customer-table";
import { listCustomers } from "@/lib/data/customers";

export const dynamic = "force-static";
export const revalidate = 60;

export default async function CustomersPage() {
  const initialCustomers = await listCustomers();

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Customers</h1>
          <p className="text-xs text-muted-foreground">Manage all your customers in one place.</p>
        </div>
        <AddCustomerDialog />
      </div>
      <CustomerTable initialCustomers={initialCustomers} />
    </div>
  );
}
