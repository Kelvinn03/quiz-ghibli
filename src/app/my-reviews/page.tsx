"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Review = {
  id: number;
  filmTitle: string;
  personalRating: number;
  reviewNotes: string;
  createdAt: string;
  updatedAt: string;
};

export default function MyReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filmTitle, setFilmTitle] = useState("");
  const [personalRating, setPersonalRating] = useState("3");
  const [reviewNotes, setReviewNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadReviews() {
    try {
      const response = await fetch("/api/reviews");
      if (!response.ok) {
        throw new Error("Failed to fetch reviews");
      }
      const data = (await response.json()) as Review[];
      setReviews(data);
    } catch {
      setError("Unable to load reviews right now.");
    }
  }

  useEffect(() => {
    loadReviews();
  }, []);

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
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        const message =
          body && typeof body.error === "string"
            ? body.error
            : "Unable to save review.";
        throw new Error(message);
      }

      setFilmTitle("");
      setPersonalRating("3");
      setReviewNotes("");
      await loadReviews();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to save review.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    setError(null);
    try {
      const response = await fetch(`/api/reviews/${id}`, { method: "DELETE" });
      if (!response.ok) {
        const body = await response.json().catch(() => null);
        const message =
          body && typeof body.error === "string"
            ? body.error
            : "Unable to delete review.";
        throw new Error(message);
      }

      setReviews((current) => current.filter((review) => review.id !== id));
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to delete review.");
    }
  }

  return (
    <div className="py-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-2 mb-4">
        <div>
          <h1 className="h2 mb-2">My Reviews</h1>
          <p className="text-muted mb-0">
            Keep a personal log of how each Ghibli story felt to you.
          </p>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-5">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h2 className="h5 mb-3">Add a new review</h2>
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
                    placeholder="e.g., Spirited Away"
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
                    placeholder="What stood out to you?"
                  />
                </div>
                <div className="d-flex gap-2">
                  <button
                    type="submit"
                    className="btn btn-success rounded-pill px-4"
                    disabled={loading}
                  >
                    Save review
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-7">
          {reviews.length === 0 ? (
            <div className="text-muted small border rounded-3 p-4 bg-white shadow-sm">
              You have not added any reviews yet. Start by writing about a film that
              moved you.
            </div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {reviews.map((review) => (
                <div key={review.id} className="card border-0 shadow-sm bg-white">
                  <div className="card-body">
                    <div className="d-flex justify-content-between gap-3 mb-1">
                      <div>
                        <h2 className="h5 mb-1">{review.filmTitle}</h2>
                        <p className="text-muted small mb-0">
                          Rating: <span className="fw-semibold">{review.personalRating} / 5</span>
                        </p>
                      </div>
                    </div>
                    <p className="text-muted small mb-3">{review.reviewNotes}</p>
                    <div className="d-flex flex-wrap gap-2">
                      <Link
                        href={`/my-reviews/${review.id}`}
                        className="btn btn-outline-success btn-sm rounded-pill px-3"
                      >
                        View details
                      </Link>
                      <Link
                        href={`/my-reviews/${review.id}/edit`}
                        className="btn btn-outline-secondary btn-sm rounded-pill px-3"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm rounded-pill px-3"
                        onClick={() => handleDelete(review.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
