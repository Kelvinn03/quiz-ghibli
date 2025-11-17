import Link from "next/link";

export default function Home() {
  return (
    <div className="py-4">
      <div className="row align-items-center g-5">
        <div className="col-lg-6">
          <p className="text-uppercase text-muted small mb-2">Kelvin - 535249102</p>
          <h1 className="display-4 fw-semibold mb-3">Ghibli Tracker</h1>
          <p className="lead text-muted mb-4">
            Browse all Studio Ghibli films and keep a gentle log of your own reviews and
            ratings in one calm, minimal space.
          </p>
          <div className="d-flex flex-wrap gap-3">
            <Link href="/films" className="btn btn-success rounded-pill px-4">
              View all films
            </Link>
            <Link
              href="/my-reviews"
              className="btn btn-outline-secondary rounded-pill px-4"
            >
              My reviews
            </Link>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm bg-light">
            <div className="card-body p-4">
              <img
                src="https://image.idntimes.com/post/20180328/spirited-away-6eef3572e719a945d73aa8c4a375cd15.jpg?tr=w-1200,f-webp,q-75&width=1200&format=webp&quality=75"
                alt="Soft sky and fields inspired by Studio Ghibli"
                className="img-fluid rounded-3"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

