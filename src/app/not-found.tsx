import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-vh-100 d-flex align-items-center">
      <div className="container text-center">
        <p className="text-uppercase text-muted small mb-2">
          404 - Spirited away
        </p>
        <h1 className="display-5 fw-semibold mb-3">
          Looks like this page drifted into the spirit world.
        </h1>
        <p className="text-muted mb-4">
          The path you are looking for is hidden behind the mist. Let&apos;s guide you back
          home.
        </p>
        <Link href="/" className="btn btn-success rounded-pill px-4">
          Go home
        </Link>
      </div>
    </div>
  );
}
