import { useSelector } from 'react-redux'
import { RootState } from '../redux/store/store'

export const useUserSlice = () => {
  const movies = useSelector((state: RootState) => state.movies)
  return movies
}
