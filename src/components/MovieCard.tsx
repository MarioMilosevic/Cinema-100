import { FaStar, FaSearch, FaBookmark } from 'react-icons/fa'
import { SingleMovieType } from '../utils/types'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { db } from '../config/firebase'
import { addMovie, removeMovie } from '../redux/features/appSlice'
import { useDispatch } from 'react-redux'
import { useAppSlice } from '../hooks/useAppSlice'
import { arrayUnion, doc, updateDoc, arrayRemove } from 'firebase/firestore'
import { useEffect } from 'react'
import { getProduct } from '../utils/api'

const MovieCard = ({
  image,
  title,
  year,
  rating,
  genre,
  id,
}: SingleMovieType) => {
  const navigate = useNavigate()
  // const [bookmarked, setBookmarked] = useState<boolean>(false)
  const dispatch = useDispatch()
  const { globalUser } = useAppSlice()
  const trimmedTitle = title.length > 36 ? `${title.slice(0, 36)}...` : title

  // useEffect(() => {
  //   try {
  //     // const isBookmarked = globalUser.bookmarkedMovies.some(
  //     //   (movie) => movie === id,
  //     // )
  //     // setBookmarked(isBookmarked)
  //   } catch (error) {
  //     console.error('Error with checking', error)
  //   }
  // }, [globalUser.bookmarkedMovies, id])

  const findMovie = async (id: string) => {
    navigate(`/home/${id}`)
  }

  const bookmarkHandler = async (id: string) => {
    try {
      if (!globalUser?.id || !db) {
        console.error('globalUser.id or db is not defined')
        return
      }
      /*
       
       */
             const userRef = doc(db, 'users', globalUser.id)
      const movie = await getProduct(id, db)
      console.log(movie)
      console.log(movie?.id)
      if (bookmarked) {
        await updateDoc(userRef, {
          bookmarkedMovies: arrayRemove(movie?.id),
          // bookmarkedMovies: arrayRemove(id),
        })
        dispatch(removeMovie(movie?.id))
        // dispatch(removeMovie(id))
        setBookmarked(false)
      } else {
        await updateDoc(userRef, {
          bookmarkedMovies: arrayUnion(movie),
          // bookmarkedMovies: arrayUnion(id),
        })
        dispatch(addMovie(movie?.id))
        // dispatch(addMovie(id))
        setBookmarked(true)
      }
    } catch (error) {
      console.error('Error updating document: ', error)
    }
  }

  return (
    <div className="max-w-[300px] flex flex-col">
      <div className="w-full h-[380px] relative">
        <img
          src={image}
          alt={image}
          className="w-full h-full object-cover pb-4"
        />
        <div className="bg-gray-900 absolute top-0 right-0 w-full h-full transition-all duration-300 opacity-0 hover:opacity-70">
          <FaBookmark
            className={`absolute top-2 right-2 cursor-pointer w-5 h-5 hover:text-orange-500 ${bookmarked ? 'text-orange-500' : 'text-gray-700'}`}
            onClick={() => bookmarkHandler(id)}
          />
          <div
            className="flex items-center gap-2 z-10 absolute bottom-1/2 right-1/2 translate-x-1/2 translate-y-1/2 rounded-full bg-gray-700 text-gray-100 px-4 py-2 cursor-pointer hover:text-gray-900 hover:bg-gray-300 active:bg-orange-700 active:text-gray-100"
            onClick={() => findMovie(id)}
          >
            <span>See more</span>
            <FaSearch />
          </div>
        </div>
      </div>

      <h2 className="text-base font-medium capitalize">{trimmedTitle}</h2>
      <div className="flex text-sm gap-2 items-center">
        <span>{year}</span>
        <FaStar color="orange" />
        <div className="flex gap-2">
          <span>{rating}</span>
          {genre.map((el, index) => (
            <span key={index}>
              {index === genre.length - 1 ? el : `${el},`}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MovieCard
