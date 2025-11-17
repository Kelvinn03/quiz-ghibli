"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Review = {
  id: number;
  filmTitle: string;
  personalRating: number;
  reviewNotes: string;
};

type EditReviewFormProps = {
  review: Review;
};

export default function EditReviewForm({ review }: EditReviewFormProps) {
  const router = useRouter();
  const [filmTitle, setFilmTitle] = useState(review.filmTitle);
  const [personalRating, setPersonalRating] = useState(
    String(review.personalRating)
  );
  const [reviewNotes, setReviewNotes] = useState(review.reviewNotes);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const ratingNumber = Number(personalRating);

    if (!filmTitle.trim() || !reviewNotes.trim() || Number.isNaN(ratingNumber)) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    if (ratingNumber < 1 || ratingNumber > 5) {
      setError("Rating must be between 1 and 5.");
      setLoading(false);
      return;
    }

    const payload = {
      filmTitle: filmTitle.trim(),
      personalRating: ratingNumber,
      reviewNotes: reviewNotes.trim(),
    };

    try {
      const response = await fetch(`/api/reviews/${review.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        const message =
          body && typeof body.error === "string"
            ? body.error
            : "Unable to update review.";
        throw new Error(message);
      }

      router.push("/my-reviews");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to update review.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body">
        <h1 className="h4 mb-3">Edit review</h1>
        {error && (
          <div className="alert alert-danger py-2 small" role="alert">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
          <div>
            <label className="form-label small text-uppercase text-muted mb-1">
              Film title
            </label>
            <input
              type="text"
              className="form-control"
              value={filmTitle}
              onChange={(event) => setFilmTitle(event.target.value)}
            />
          </div>
          <div>
            <label className="form-label small text-uppercase text-muted mb-1">
              Rating (1–5)
            </label>
            <input
              type="number"
              min={1}
              max={5}
              className="form-control"
              value={personalRating}
              onChange={(event) => setPersonalRating(event.target.value)}
            />
          </div>
          <div>
            <label className="form-label small text-uppercase text-muted mb-1">
              Notes
            </label>
            <textarea
              className="form-control"
              rows={4}
              value={reviewNotes}
              onChange={(event) => setReviewNotes(event.target.value)}
            />
          </div>
          <div className="d-flex gap-2">
            <button
              type="submit"
              className="btn btn-success rounded-pill px-4"
              disabled={loading}
            >
              Save changes
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary rounded-pill px-3"
              onClick={() => router.push("/my-reviews")}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
