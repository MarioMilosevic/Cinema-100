import { useParams } from 'react-router'
import { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { FaStar } from 'react-icons/fa'
import { useAuth } from '../hooks/useAuth'
import { SingleMovieType } from '../utils/types'
import { FaBookmark } from 'react-icons/fa'
import ReactPlayer from 'react-player'
const SingleMovie = () => {
  const { movieId } = useParams()
  const { db } = useAuth()
  const [singleMovie, setSingleMovie] = useState<SingleMovieType | null>(null)
  console.log(singleMovie)
  useEffect(() => {
    const getProduct = async () => {
      if (movieId) {
        try {
          const docRef = doc(db, 'movies', movieId)
          const docSnap = await getDoc(docRef)
          const filteredMovie = docSnap.data()
          setSingleMovie(filteredMovie)
        } catch (error) {
          console.error(error)
        }
      }
    }

    getProduct()
  }, [db, movieId])

  if (!singleMovie) return
  return (
    <div className="max-w-[1300px] mx-auto border">
      <div className="border flex justify-between">
        <div>
          <h2 className="font-semibold">{singleMovie?.title}</h2>
          <h3>{`(${singleMovie?.year})`}</h3>
        </div>
        <div className="flex items-center gap-8">
          <div className="">
            <h2>Imdb rating</h2>
            <div className="flex items-center">
              <FaStar color="orange" />
              <p>{`${singleMovie?.rating}/10`}</p>
            </div>
          </div>
          <div className="">
            <h2>Rank</h2>
            <p>{`${singleMovie?.rank}/100`}</p>
          </div>
        </div>
      </div>
      <div className="border flex bg-orange-100">
          <div className="relative w-1/3">
            <img
              src={singleMovie.image}
              alt={singleMovie.image}
              className="w-full"
            />
            <FaBookmark className="absolute w-5 h-5 top-2 right-2" />
          </div>
          <div className='bg-red-400 w-2/3'>
            <ReactPlayer
            url={singleMovie.trailer}
            width="100%"
            height="100%"
            controls
            />
          </div>
      </div>
      <div className="flex flex-col gap-4 py-4 w-1/2">
        <div className="flex gap-2">
          {singleMovie.genre.map((el, index) => (
            <span key={index} className="font-medium">
              {index === singleMovie.genre.length - 1 ? el : `${el},`}
            </span>
          ))}
        </div>
        <p>{singleMovie.description}</p>
        <div className="border-b border-b-gray-100">
          <h3>Director</h3>
          <span>{singleMovie.director}</span>
        </div>
        <div className="border-b border-b-gray-100">
          <h3>Writers</h3>
          <div className='flex gap-4'>
          {singleMovie.writers.map((writer) => {
              return <span className=''>{writer}</span> 
            })}
            </div>
        </div>
      </div>
    </div>
  )
}

export default SingleMovie
