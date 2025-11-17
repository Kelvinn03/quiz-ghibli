import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

type ReviewDetailPageProps = {
  params: {
    id: string;
  };
};

export default async function ReviewDetailPage({
  params,
}: ReviewDetailPageProps) {
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
      <div className="mb-4">
        <p className="text-uppercase text-muted small mb-1">Review detail</p>
        <h1 className="h2 mb-2">{review.filmTitle}</h1>
        <p className="text-muted mb-0">
          Rating <span className="fw-semibold">{review.personalRating} / 5</span>
        </p>
      </div>

      <div className="card border-0 shadow-sm bg-white mb-4">
        <div className="card-body">
          <h2 className="h6 text-muted text-uppercase mb-2">Notes</h2>
          <p className="mb-0">{review.reviewNotes}</p>
        </div>
      </div>

      <Link
        href="/my-reviews"
        className="btn btn-outline-secondary rounded-pill px-4"
      >
        Back to reviews
      </Link>
    </div>
  );
}
