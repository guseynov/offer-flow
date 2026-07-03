import type { Metadata } from "next";
import type { DealDetailPageProps } from "@/types/deal";
import { DealEditView } from "@/components/deals/edit/deal-edit-view";

export const metadata: Metadata = { title: "Edit offer" };

export default async function DealEditPage({ params }: DealDetailPageProps) {
  const { id } = await params;

  return (
    <div className="mx-auto max-w-4xl">
      <DealEditView dealId={id} />
    </div>
  );
}
