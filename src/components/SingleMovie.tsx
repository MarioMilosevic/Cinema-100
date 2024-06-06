import { useParams } from 'react-router'
import { useEffect, useState } from 'react'
import { doc, DocumentData, getDoc } from 'firebase/firestore'
import { FaStar } from 'react-icons/fa'
import { useAuth } from '../hooks/useAuth'
import { SingleMovieType } from '../utils/types'
const SingleMovie = () => {
  const { movieId } = useParams()
  const { db } = useAuth()
  const [singleMovie, setSingleMovie] = useState<SingleMovieType | null>(null)
  console.log(movieId)
  useEffect(() => {
    const getProduct = async () => {
      if (movieId) {
        try {
          const docRef = doc(db, 'movies', movieId)
          const docSnap = await getDoc(docRef)
          const filteredMovie = docSnap.data()
          setSingleMovie(filteredMovie)
          console.log(filteredMovie)
        } catch (error) {
          console.error(error)
        }
      }
    }

    getProduct()
  }, [db, movieId])

  console.log(singleMovie)
  if(!singleMovie) return
  return (
    <div className="max-w-[1300px] mx-auto border">
      <div className="border flex justify-between">
        <div>
          <h2>{singleMovie?.title}</h2>
          <h3>{`(${singleMovie?.year})`}</h3>
        </div>
        <div className='flex items-center gap-8'>
            <div className=''>
                <h2>Imdb rating</h2>
                <div className='flex items-center'>
                    <FaStar color='orange'/>
                    <p>{`${singleMovie?.rating}/10`}</p>
                </div>
            </div>
            <div className=''>
                <h2>Rank</h2>
                    <p>{`${singleMovie?.rank}/100`}</p>
            </div>
        </div>
      </div>
    </div>
  )
}

export default SingleMovie
