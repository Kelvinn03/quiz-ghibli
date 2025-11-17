import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EditReviewForm from "../EditReviewForm";

type EditPageProps = {
  params: {
    id: string;
  };
};

export default async function EditReviewPage({ params }: EditPageProps) {
  const id = Number(params.id);

  if (!Number.isInteger(id) || id <= 0) {
    notFound();
  }

  const review = await prisma.review.findUnique({ where: { id } });

  if (!review) {
    notFound();
  }

  return (
    <div className="py-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-2 mb-4">
        <div>
          <h1 className="h2 mb-2">Edit review</h1>
          <p className="text-muted mb-0">Update how this Ghibli story felt to you.</p>
        </div>
      </div>

      <EditReviewForm review={review} />
    </div>
  );
}
