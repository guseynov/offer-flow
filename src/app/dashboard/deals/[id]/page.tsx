import type { Metadata } from "next";
import { DealDetailView } from "@/components/deals/detail/deal-detail-view";
import type { DealDetailPageProps } from "@/types/deal";
import { getDealById, getDealHistory } from "@/lib/server/deal-repository";
import { notFound } from "next/navigation";

export const metadata: Metadata = { title: "Offer details" };

export default async function DealDetailPage({ params }: DealDetailPageProps) {
  const { id } = await params;
  const deal = await getDealById(id);

  if (!deal) {
    notFound();
  }

  const history = await getDealHistory(id);

  return (
    <div className="mx-auto max-w-375">
      <DealDetailView dealId={id} initialData={{ data: deal, history }} />
    </div>
  );
}
