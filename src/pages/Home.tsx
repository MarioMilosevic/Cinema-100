import Login from "../components/Login";
import { useState, useEffect } from "react";
import { getDocs, getDoc, collection } from "firebase/firestore";
import { db } from "../config/firebase";

const Home = () => {
    const [movieList, setMovieList] = useState([]);

    const moviesCollectionRef = collection(db, "movies")
    useEffect(() => {
      const getMovieList = async () => {
        try {
          const data = await getDocs(moviesCollectionRef);
          const filteredData = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
          console.log(data)
          console.log(filteredData)
        } catch (error) {
          console.error(error)
        }
      };
      getMovieList()
    }, [moviesCollectionRef]);
  
    return (
      <>
        <Login />
      </>
    );
}

export default Home
