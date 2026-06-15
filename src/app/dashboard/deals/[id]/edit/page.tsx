import type { Metadata } from "next";
import { DealEditView } from "@/components/deals/edit/deal-edit-view";
import type { DealDetailPageProps } from "@/types/deal";

export const metadata: Metadata = { title: "Edit deal" };

export default async function DealEditPage({ params }: DealDetailPageProps) {
  const { id } = await params;

  return (
    <div className="mx-auto max-w-4xl">
      <DealEditView dealId={id} />
    </div>
  );
}
