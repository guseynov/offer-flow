import type { Metadata } from "next";
import type { DealDetailPageProps } from "@/types/deal";
import { DealEditView } from "@/components/deals/edit/deal-edit-view";
import { getDealById } from "@/lib/server/deal-repository";
import { notFound } from "next/navigation";

export const metadata: Metadata = { title: "Edit offer" };

export default async function DealEditPage({ params }: DealDetailPageProps) {
  const { id } = await params;
  const deal = await getDealById(id);

  if (!deal) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl">
      <DealEditView dealId={id} initialDeal={deal} />
    </div>
  );
}
