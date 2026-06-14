import { Suspense } from "react";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/AuthForm";
import { getSessionUser } from "@/lib/auth";

export const metadata = { title: "Create Account" };

export default async function RegisterPage() {
  const user = await getSessionUser();
  if (user) redirect(user.role === "ADMIN" ? "/admin" : "/account");

  return (
    <Suspense>
      <AuthForm mode="register" />
    </Suspense>
  );
}
