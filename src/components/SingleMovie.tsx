import { useParams } from 'react-router'
import { useEffect, useState } from 'react'
import { FaStar } from 'react-icons/fa'
import { getProduct } from '../utils/api'
import { db } from '../config/firebase'
import { SingleMovieType } from '../utils/types'
import MovieCard from './MovieCard'
import ReactPlayer from 'react-player'
const SingleMovie = () => {
  const { movieId } = useParams()
  const [singleMovie, setSingleMovie] = useState<SingleMovieType | null>(null)

  useEffect(() => {
    const fetchMovie = async () => {
      if (!movieId) return
      const movie = await getProduct(movieId, db)
      setSingleMovie(movie as SingleMovieType)
    }
    fetchMovie()
  }, [movieId])

  if (!singleMovie) return
  console.log(singleMovie)
  return (
    <div className="max-w-[1200px] mx-auto flex flex-col min-h-screen py-4">
      <div className="flex justify-between">
        <div className="py-4 lg:px-0 px-2">
          <h2 className="font-semibold capitalize lg:text-xl text-lg">
            {singleMovie?.title}
          </h2>
          <h3>{`(${singleMovie?.year})`}</h3>
        </div>
        <div className="flex items-center gap-8 lg:px-0 px-2">
          <div className="">
            <h2>Imdb rating</h2>
            <div className="flex items-center gap-2">
              <FaStar color="orange" />
              <p className="tracking-wide">{`${singleMovie?.rating}/10`}</p>
            </div>
          </div>
          <div className="">
            <h2>Rank</h2>
            <p className="tracking-wide">{`${singleMovie?.rank}/100`}</p>
          </div>
        </div>
      </div>
      <div className="flex lg:flex-row flex-col lg:gap-1 lg:h-[500px] gap-4">
        <div className="relative lg:w-1/3 flex justify-center">
          <MovieCard {...singleMovie} isBookmarked={true} size='big'/>
        </div>
        <div className="lg:w-2/3 lg:h-full lg:px-0 px-2 h-[380px]">
          <ReactPlayer
            url={singleMovie.trailer}
            playing
            width="100%"
            height="100%"
            controls
          />
        </div>
      </div>
      <div className="flex flex-col gap-4 py-4 lg:w-1/2 px-2">
        <div className="flex gap-2 lg:pt-0 pt-4">
          {singleMovie.genre.map((el, index) => (
            <span key={index} className="font-semibold text-lg">
              {index === singleMovie.genre.length - 1 ? el : `${el},`}
            </span>
          ))}
        </div>
        <p className="pb-4 border-b border-b-gray-100">
          {singleMovie.description}
        </p>
        <div className="border-b border-b-gray-100 pb-4">
          <h3>Director</h3>
          <span>{singleMovie.director}</span>
        </div>
        <div className="border-b border-b-gray-100 pb-4">
          <h3>Writers</h3>
          <div className="flex gap-4">
            {singleMovie.writers.map((writer, index) => {
              return <span key={index}>{writer}</span>
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SingleMovie
