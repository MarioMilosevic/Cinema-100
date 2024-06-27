import { SingleMovieType } from '../utils/types'
import MovieCard from './MovieCard'

const BookmarkedMovies = ({ bookmarkedMovies }: SingleMovieType[]) => {
  console.log(bookmarkedMovies)
  return bookmarkedMovies.length > 0 ? (
    <div className="grid grid-cols-4 gap-8 py-4 ">
      {bookmarkedMovies.map((movie) => (
        <MovieCard key={movie.id} {...movie} />
      ))}
    </div>
  ) : (
    <div className="flex items-center justify-center">
      <p>No bookmarked movies</p>
    </div>
  )
}

export default BookmarkedMovies
