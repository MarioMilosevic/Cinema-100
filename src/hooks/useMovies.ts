import { useSelector } from 'react-redux'
import { RootState } from '../redux/store/store'

export const useMoviesSlice = () => {
  const movies = useSelector((state: RootState) => state.movies)
  return movies
}
