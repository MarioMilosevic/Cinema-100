import { useState, useEffect } from "react"
import { getDocs, collection, query, orderBy, startAt, limit } from 'firebase/firestore'
import { useAuth } from "../hooks/useAuth"
import { SingleMovieType } from "../utils/types"
import MovieCard from "../components/MovieCard"

const Home = () => {
  const [movies, setMovies] = useState<SingleMovieType[]>([])
  const { db } = useAuth()
const pageSize = 12
const field = "rating"
  useEffect(() => {
    const getMovieList = async () => {
      try {
        const moviesCollection = collection(db, 'movies')
        
        const moviesQuery = query(moviesCollection, orderBy(field, "desc"), limit(pageSize))

        const data = await getDocs(moviesQuery)

        const filteredData = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
        console.log(filteredData)
        setMovies(filteredData)
      } catch (error) {
        console.error(error)
      }
    }
    getMovieList()
  }, [db]) 

  const nextPage = (last:string) => {
    const movieQuery = query(movies)
    return 
  }


  if(movies.length === 0) return


  return (
    <div className="max-w-[1300px] mx-auto border grid grid-cols-4 gap-4">
      {movies.map((movie) => <MovieCard key={movie.id} movie={movie}/>)}
    </div>
  )
}

export default Home
