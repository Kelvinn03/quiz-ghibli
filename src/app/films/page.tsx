type Film = {
  id: string;
  title: string;
  description: string;
  director: string;
  release_date: string;
  image: string;
  movie_banner: string;
};

async function getFilms(): Promise<Film[]> {
  const response = await fetch("https://ghibliapi.vercel.app/films", {
    next: { revalidate: 60 * 60 },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch films");
  }

  return response.json();
}

export default async function FilmsPage() {
  let films: Film[] = [];

  try {
    films = await getFilms();
  } catch {
    return (
      <div className="py-4">
        <h1 className="h2 mb-3">All Films</h1>
        <p className="text-muted">Unable to load films right now. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="py-4">
      <div className="d-flex flex-column flex-md-row align-items-md-end justify-content-between mb-4 gap-2">
        <div>
          <h1 className="h2 mb-2">All Studio Ghibli Films</h1>
          <p className="text-muted mb-0">
            Browse the full catalog of Studio Ghibli films from the public API.
          </p>
        </div>
      </div>

      <div className="row g-4">
        {films.map((film) => (
          <div key={film.id} className="col-12 col-md-6 col-lg-4">
            <div className="card h-100 border-0 shadow-sm bg-white">
              {film.image && (
                <img
                  src={film.image}
                  alt={film.title}
                  className="card-img-top"
                  style={{ objectFit: "cover", maxHeight: "260px" }}
                />
              )}
              <div className="card-body d-flex flex-column">
                <h2 className="h5 mb-1">{film.title}</h2>
                <p className="text-muted small mb-2">
                  Directed by <span className="fw-semibold">{film.director}</span> ·{" "}
                  <span>{film.release_date}</span>
                </p>
                <p className="small flex-grow-1 mb-0">{film.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
