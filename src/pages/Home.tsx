import { useState, useEffect } from "react"
import { getDocs, collection } from 'firebase/firestore'
import { useAuth } from "../hooks/useAuth"
import { SingleMovieType } from "../utils/types"
import MovieCard from "../components/MovieCard"

const Home = () => {
  const [movies, setMovies] = useState<SingleMovieType[]>([])
  const { db } = useAuth()

  useEffect(() => {
    const getMovieList = async () => {
      try {
        const moviesCollection = collection(db, 'movies')
        const data = await getDocs(moviesCollection)
        const filteredData = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
        // console.log(filteredData)
        setMovies(filteredData)
      } catch (error) {
        console.error(error)
      }
    }
    getMovieList()
  }, [db]) 

  if(movies.length === 0) return
  const mario = movies[54]
  return (
    <div className="max-w-[1300px] mx-auto border grid grid-cols-4 gap-4">
        <MovieCard movie={mario}/>
        <MovieCard movie={mario}/>
        <MovieCard movie={mario}/>
        <MovieCard movie={mario}/>
        <MovieCard movie={mario}/>
    </div>
  )
}

export default Home
