import type { Metadata } from "next";
import { DealDetailView } from "@/components/deals/detail/deal-detail-view";
import type { DealDetailPageProps } from "@/types/deal";

export const metadata: Metadata = { title: "Offer details" };

export default async function DealDetailPage({ params }: DealDetailPageProps) {
  const { id } = await params;

  return (
    <div className="mx-auto max-w-375">
      <DealDetailView dealId={id} />
    </div>
  );
}
