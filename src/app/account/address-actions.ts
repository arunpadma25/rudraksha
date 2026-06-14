"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

function str(value: FormDataEntryValue | null): string {
  return String(value ?? "").trim();
}

export async function createAddress(formData: FormData) {
  const user = await requireUser();

  const data = {
    fullName: str(formData.get("fullName")),
    phone: str(formData.get("phone")),
    line1: str(formData.get("line1")),
    line2: str(formData.get("line2")) || null,
    city: str(formData.get("city")),
    state: str(formData.get("state")),
    postalCode: str(formData.get("postalCode")),
    country: str(formData.get("country")) || "IN",
  };

  if (!data.fullName || !data.phone || !data.line1 || !data.city || !data.state || !data.postalCode) {
    throw new Error("Please fill in all required address fields.");
  }

  const existingCount = await prisma.address.count({ where: { userId: user.id } });
  const makeDefault = formData.get("isDefault") === "on" || existingCount === 0;

  if (makeDefault) {
    await prisma.address.updateMany({ where: { userId: user.id }, data: { isDefault: false } });
  }

  await prisma.address.create({
    data: { ...data, userId: user.id, isDefault: makeDefault },
  });

  revalidatePath("/account");
  revalidatePath("/checkout");
}

export async function deleteAddress(id: string) {
  const user = await requireUser();
  // Scope by userId so a user can only delete their own address.
  await prisma.address.deleteMany({ where: { id, userId: user.id } });
  revalidatePath("/account");
  revalidatePath("/checkout");
}

export async function setDefaultAddress(id: string) {
  const user = await requireUser();
  const address = await prisma.address.findFirst({ where: { id, userId: user.id } });
  if (!address) return;
  await prisma.$transaction([
    prisma.address.updateMany({ where: { userId: user.id }, data: { isDefault: false } }),
    prisma.address.update({ where: { id }, data: { isDefault: true } }),
  ]);
  revalidatePath("/account");
  revalidatePath("/checkout");
}
