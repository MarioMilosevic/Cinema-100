import { FaStar, FaSearch, FaBookmark } from 'react-icons/fa'
import { SingleMovieType } from '../utils/types'
import { useNavigate } from 'react-router'
import { db, moviesCollection } from '../config/firebase'

import { useAppSlice } from '../hooks/useAppSlice'
import {
  arrayUnion,
  doc,
  updateDoc,
  arrayRemove,
  getDoc,
  where,
  query,
  getDocs,
} from 'firebase/firestore'

const MovieCard = ({
  image,
  title,
  year,
  rating,
  genre,
  isBookmarked,
  id,
}: SingleMovieType) => {
  const navigate = useNavigate()
  const { globalUser } = useAppSlice()
  const trimmedTitle = title.length > 36 ? `${title.slice(0, 36)}...` : title

  const findMovie = async (id: string) => {
    navigate(`/home/${id}`)
  }

  const bookmarkHandler = async (id: string) => {
    console.log(id)
    try {
      if (!globalUser?.id || !db) {
        console.error('globalUser.id or db is not defined')
        return
      }
      console.log(moviesCollection)
      const q = query(moviesCollection, where('id', '==', id))
      console.log(q)
      const querySnapshot = await getDocs(q)
      const [movie] = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
      }))
      console.log(movie)

      const userRef = doc(db, 'users', globalUser.id)
      const userDoc = await getDoc(userRef)
      console.log(userDoc)

      if (userDoc.exists()) {
        const userData = userDoc.data()
        const bookmarkedMovies = userData.bookmarkedMovies

        const isBookmarked = bookmarkedMovies.some(
          (bookmarkedMovie) => bookmarkedMovie.id === movie.id,
        )
        if (isBookmarked) {
          console.log('Izbrisi film')
          await updateDoc(userRef, {
            bookmarkedMovies: arrayRemove(movie),
          })
        } else {
          console.log('Dodaj film')
          await updateDoc(userRef, {
            bookmarkedMovies: arrayUnion(movie),
          })
        }
      } else {
        console.error('User document does not exist')
      }
    } catch (error) {
      console.error('Error:', error)
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
            className={`absolute top-2 right-2 cursor-pointer w-5 h-5 hover:text-orange-500 active:text-red-700 ${isBookmarked ? 'text-orange-500' : 'text-gray-700'}`}
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
