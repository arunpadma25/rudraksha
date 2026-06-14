import { redirect } from "next/navigation";
import { CheckoutForm } from "@/components/CheckoutForm";
import { getSessionUser } from "@/lib/auth";
import { getUserAddresses } from "@/lib/queries";

export const metadata = { title: "Checkout" };

export default async function CheckoutPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login?redirect=/checkout");

  const addresses = await getUserAddresses(user.id);

  return (
    <CheckoutForm
      defaultName={user.name}
      defaultEmail={user.email}
      savedAddresses={addresses.map((a) => ({
        id: a.id,
        fullName: a.fullName,
        phone: a.phone,
        line1: a.line1,
        line2: a.line2,
        city: a.city,
        state: a.state,
        postalCode: a.postalCode,
        country: a.country,
        isDefault: a.isDefault,
      }))}
    />
  );
}
