import { useEffect } from 'react'
import { getDocs, getDoc, collection } from 'firebase/firestore'

// import { db } from '../config/firebase'
import { useAppSlice } from '../hooks/useAppSlice'
import Auth from '../components/Auth'
import { useAuth } from '../hooks/useAuth'
const Authentication = () => {
  const { hasAccount } = useAppSlice()
  const {db} = useAuth()
  const moviesCollection = collection(db, 'movies')

  useEffect(() => {
    const getMovieList = async () => {
      try {
        const data = await getDocs(moviesCollection)
        const filteredData = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
        console.log(filteredData)
      } catch (error) {
        console.error(error)
      }
    }
    getMovieList()
  }, [moviesCollection])

  return <Auth />
}

export default Authentication
