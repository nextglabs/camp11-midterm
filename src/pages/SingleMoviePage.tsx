import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { SingleMovie, getSingleMovie } from '../api/movies';
import Header from '../components/Header';
import { findCrewByRole } from '../utils/findCrewByRole';
import Button from '../components/Button';
import Score from '../components/Score';

function SingleMoviePage() {
  const { movieId } = useParams();

  const [movieData, setMovieData] = useState<SingleMovie | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const readMore = () => {
    setIsOpen(!isOpen);
  };
  useEffect(() => {
    getSingleMovie(parseInt(movieId!))
      .then(movie => {
        setMovieData(movie);
      })
      .catch(err => {
        console.error(err);
      });
  }, []);

  const membersData = movieData ? movieData.credits.crew : [];
  const writer = findCrewByRole(membersData, 'Writer');
  const director = findCrewByRole(membersData, 'Director');
  const unknownWriter = writer ? writer.name : 'Unknown Writer';
  const genres = movieData?.genres.map(genre => {
    return genre.name;
  });

  return (
    <div className="flex flex-col gap-6">
      <Header header={'Movie Detail'} />
      {movieData && (
        <img
          key={movieData.id}
          className="rounded-lg"
          src={`https://image.tmdb.org/t/p/w300/${movieData.backdrop_path}`}
        />
      )}

      <h1 className="text-white font-bold">{movieData?.title}</h1>
      <div className=" text-white text-xs flex justify-between">
        <div className="flex gap-6">
          <span>{movieData?.release_date.slice(0, 4)}</span>
          <span className="text-white-dimmed">
            {genres?.slice(0, 2).join('/')}
          </span>
          <span className="text-white-dimmed">
            {movieData &&
              Math.floor(movieData.runtime / 60) +
                'h ' +
                (movieData.runtime % 60) +
                'm'}
          </span>
        </div>

        {movieData && <Score voteAverage={movieData.vote_average} />}
      </div>
      <div className="flex justify-between text-xs">
        <div className="flex flex-col gap-2 text-white-dimmed">
          <span>Director: </span>
          <span>Writer: </span>
        </div>
        <div className="flex flex-col gap-2 font-bold text-white">
          <span>{director?.name}</span>
          <span>{unknownWriter}</span>
        </div>
        <div className="w-[140px] text-white">
          <Link to={`/movies/${movieId}/cast-crew`}>
            <Button size="sm" variant="secondary">
              Cast & Crew
            </Button>
          </Link>
        </div>
      </div>
      <hr className="border-white-dimmed" />
      <div className="flex flex-col gap-2 items-start">
        <span className="text-white font-bold text-sm">Synopsis</span>
        <p
          className={`text-white-dimmed text-sm ${
            isOpen ? 'none' : 'line-clamp-2'
          }`}
        >
          {movieData?.overview}
        </p>
        <button className="text-sm underline text-[#FFB43A]" onClick={readMore}>
          {isOpen ? 'Read Less' : 'Read More'}
        </button>
      </div>
      <Link to={`/movies/${movieId}/reservation`}>
        <Button size="lg"> Get Reservation</Button>
      </Link>
    </div>
  );
}

export default SingleMoviePage;
