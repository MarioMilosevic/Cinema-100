import MovieCard from './MovieCard'
import { SingleMovieType } from '../utils/types'

const BookmarkedMovies = ({
  bookmarkedMovies,
}: SingleMovieType[]) => {
  console.log(bookmarkedMovies)
  return bookmarkedMovies.length > 0 ? (
    <div className="grid grid-cols-4 gap-8 py-4 ">
      {bookmarkedMovies.map((movie) => (
        <MovieCard key={movie.id} {...movie} isBookmarked={true} />
      ))}
    </div>
  ) : (
    <div className="flex items-center justify-center min-h-[200px]">
      <p className="text-lg font-medium">No bookmarked movies</p>
    </div>
  )
}

export default BookmarkedMovies
