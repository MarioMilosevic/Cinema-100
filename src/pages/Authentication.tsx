import { useEffect } from 'react'
import { getDocs, getDoc, collection } from 'firebase/firestore'
import { db } from '../config/firebase'
import { useAppSlice } from '../hooks/useAppSlice'
import Auth from '../components/Auth'

const Authentication = () => {
  const { hasAccount } = useAppSlice()
  const moviesCollectionRef = collection(db, 'movies')
  useEffect(() => {
    const getMovieList = async () => {
      try {
        const data = await getDocs(moviesCollectionRef)
        const filteredData = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
        // console.log(data)
        console.log(filteredData)
      } catch (error) {
        console.error(error)
      }
    }
    getMovieList()
  }, [moviesCollectionRef])

  return <Auth />
}

export default Authentication
