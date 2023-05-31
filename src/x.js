import { useEffect, useState } from 'react';
import axios from 'axios';
import YouTube from 'react-youtube';
import firebase, { db } from '../firebase';
import '../components/Principal1.css';

function Principal() {
  const API_URL = "https://api.themoviedb.org/3";
  const API_KEY = "4f5f43495afcc67e9553f6c684a82f84";
  const IMAGE_PATH = "https://image.tmdb.org/t/p/original";

  const URL_IMAGE = "https://image.tmdb.org/t/p/original";

  const [movies, setMovies] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [trailer, setTrailer] = useState(null);
  const [movie, setMovie] = useState({ title: "Cargando películas" });
  const [playing, setPlaying] = useState(false);
  const [watchlist, setWatchlist] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);

  const fetchMovies = async (searchKey) => {
    const type = searchKey ? "search" : "discover";
    const {
      data: { results },
    } = await axios.get(`${API_URL}/${type}/movie`, {
      params: {
        api_key: API_KEY,
        query: searchKey,
        language: 'es',
      },
    });

    setMovies(results);
    setMovie(results[0]);

    if (results.length) {
      await fetchMovie(results[0].id);
    }
  };

  const fetchMovie = async (id) => {
    const { data } = await axios.get(`${API_URL}/movie/${id}`, {
      params: {
        api_key: API_KEY,
        append_to_response: "videos",
        language: 'es',
      },
    });

    if (data.videos && data.videos.results) {
      const trailer = data.videos.results.find(
        (vid) => vid.name === "Tráiler oficial"
      );
      setTrailer(trailer ? trailer : data.videos.results[0]);
    }

    setMovie(data);
  };

  const selectMovie = async (movie) => {
    fetchMovie(movie.id);

    setMovie(movie);
    window.scrollTo(0, 0);
  };

  const searchMovies = async (e) => {
    e.preventDefault();
    await fetchMovies(searchKey);

    // Guardar los datos de búsqueda en Firestore
    try {
      await db.collection("searches").add({ searchKey });
      console.log("Datos de búsqueda almacenados en Firestore exitosamente.");
    } catch (error) {
      console.error("Error al almacenar datos de búsqueda en Firestore:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = db.collection("searches").onSnapshot((snapshot) => {
      const searches = snapshot.docs.map((doc) => doc.data());
      setSearchHistory(searches);
    });

    fetchMovies();

    return () => unsubscribe();
  }, []);

  const getAgeRating = (voteAverage) => {
    if (voteAverage >= 7.5) {
      return "PG-13";
    } else if (voteAverage >= 5) {
      return "PG";
    } else {
      return "G";
    }
  };

  const addToWatchlist = () => {
    if (!watchlist.find((item) => item.id === movie.id)) {
      setWatchlist([...watchlist, movie]);
    }
  };

  const clearSearchHistory = async () => {
    // Eliminar los datos de búsqueda de Firestore
    try {
      const searchSnapshot = await db.collection("searches").get();
      searchSnapshot.forEach((doc) => {
        doc.ref.delete();
      });
      console.log("Historial de búsqueda eliminado de Firestore exitosamente.");
    } catch (error) {
      console.error("Error al eliminar el historial de búsqueda de Firestore:", error);
    }
  };

  return (
    <div className="container-fluid">
      <h2 className="text-center mt-5 mb-5">NEFLIS</h2>

      <form className="mb-4" onSubmit={searchMovies}>
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar"
            onChange={(e) => setSearchKey(e.target.value)}
          />
          <button className="btn btn-primary">Buscar</button>
        </div>
      </form>

      <div>
        <main>
          {movie ? (
            <div className="viewtrailer" style={{ backgroundImage: `url("${IMAGE_PATH}${movie.backdrop_path}")` }}>
              {playing ? (
                <>
                  <YouTube
                    videoId={trailer.key}
                    className="reproductor container"
                    containerClassName="youtube-container amru"
                    opts={{
                      width: "100%",
                      height: "100%",
                      playerVars: {
                        autoplay: 1,
                        controls: 0,
                        cc_load_policy: 0,
                        fs: 0,
                        iv_load_policy: 0,
                        modestbranding: 0,
                        rel: 0,
                        showinfo: 0,
                      },
                    }}
                  />
                  <button onClick={() => setPlaying(false)} className="btn btn-light mt-3">
                    Cerrar
                  </button>
                </>
              ) : (
                <div className="container">
                  <div className="">
                    {trailer ? (
                      <button className="btn btn-primary mt-3" onClick={() => setPlaying(true)} type="button">
                        Ver Tráiler
                      </button>
                    ) : (
                      <p>Lo sentimos, no hay tráiler disponible</p>
                    )}
                    <h1 className="text-white">{movie.title}</h1>
                    <p className="text-white">{movie.overview}</p>
                    <p className="text-white">Clasificación por edades: {getAgeRating(movie.vote_average)}</p>
                    <button onClick={addToWatchlist} className="btn btn-primary mt-3">
                      Agregar a la lista de seguimiento
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </main>
      </div>

      <div className="row row-cols-1 row-cols-md-4 g-4 mt-3">
        {movies.map((movie) => (
          <div key={movie.id} className="col">
            <div className="card">
              <img
                src={`${URL_IMAGE + movie.poster_path}`}
                alt=""
                className="card-img-top"
              />
              <div className="card-body">
                <h5 className="card-title">{movie.title}</h5>
                <p className="card-text">{movie.overview}</p>
                <button className="btn btn-primary" onClick={() => selectMovie(movie)}>
                  Ver detalles
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="container mt-5">
        <h2>Historial de búsqueda:</h2>
        <ul>
          {searchHistory.map((search, index) => (
            <li key={index}>{search.searchKey}</li>
          ))}
        </ul>
        <button className="btn btn-danger" onClick={clearSearchHistory}>
          Borrar historial de búsqueda
        </button>
      </div>

      <div className="container mt-5">
        <h2>Lista de seguimiento:</h2>
        <ul>
          {watchlist.map((movie) => (
            <li key={movie.id}>{movie.title}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Principal;
