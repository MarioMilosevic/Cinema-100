// import movieLogo from '../assets/movie-icon-vector.jpg'
// import { useState } from 'react'
// import { UserType, NewUserType } from '../utils/types'
// import { initialUserState, initialNewUserState } from '../utils/constants'
// import { authenticationSchema, UserFormFormValues } from '../utils/zod'
// import { zodResolver } from '@hookform/resolvers/zod'
// import { useForm } from 'react-hook-form'
// import { collection, addDoc, getDoc } from 'firebase/firestore'
// import { db } from '../config/firebase'
// import {
//   createUserWithEmailAndPassword,
//   signInAnonymously,
//   signInWithEmailAndPassword,
// } from 'firebase/auth'
// import { where, query, getDocs } from 'firebase/firestore'
// import { useAppSlice } from '../hooks/useAppSlice'
// import { toggleHasAccount, setGlobalUser } from '../redux/features/appSlice'
// import { useDispatch } from 'react-redux'
// import { auth } from '../config/firebase'
// import { useNavigate } from 'react-router'
// import LogIn from './LogIn'
// import SignUp from './SignUp'

// const Auth = () => {
//   const [user, setUser] = useState<UserType>(initialUserState)
//   const [newUser, setNewUser] = useState<NewUserType>(initialNewUserState)
//   const { hasAccount, globalUser } = useAppSlice()
//   const dispatch = useDispatch()
//   const navigate = useNavigate()

//   const form = useForm<UserFormFormValues>({
//     defaultValues: {
//       email: user.email,
//       password: user.password,
//     },
//     resolver: zodResolver(authenticationSchema),
//   })

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = form

//   const createNewUser = async (data: UserFormFormValues) => {
//     try {
//       const newUser = await createUserWithEmailAndPassword(
//         auth,
//         data.email,
//         data.password,
//       )
//       console.log(newUser)

//       // Check if user already exists in Firestore
//       const userQuery = query(
//         collection(db, 'users'),
//         where('email', '==', newUser.user.email),
//       )
//       const querySnapshot = await getDocs(userQuery)
//       console.log(querySnapshot)
//       if (querySnapshot.empty) {
//         console.log('ne postoji')
//         const newUser = {
//           name: data.name,
//           lastName: data.lastName,
//           email: data.email,
//           password: data.password,
//           bookmarkedMovies: [],
//         }
//         await addDoc(collection(db, 'users'), newUser)
//         dispatch(setGlobalUser(newUser))
//         navigate('/home')
//       } else {
//         setNewUser(initialNewUserState)
//         alert('User already exists')
//         console.log('vec postoji')
//       }
//     } catch (error) {
//       console.error('Error', error)
//     }
//   }

//   const signInUser = async (data: UserFormFormValues) => {
//     try {
//       const existingUser = await signInWithEmailAndPassword(
//         auth,
//         data.email,
//         data.password,
//       )
//       const userQuery = query(
//         collection(db, 'users'),
//         where('email', '==', data.email),
//       )
//       const querySnapshot = await getDocs(userQuery)
//       const [user] = querySnapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }))
//       if (existingUser) {
//         navigate('/home')
//         dispatch(setGlobalUser(user))
//       }
//     } catch (error) {
//       console.error(error)
//     }
//   }

//   const signInGuest = async () => {
//     try {
//       await signInAnonymously(auth)
//       const newUser = {
//         name: 'Guest',
//         lastName: '',
//         email: 'guest@gmail.com',
//         password: 'guest',
//         bookmarkedMovies: [],
//       }
//       await addDoc(collection(db, 'users'), newUser)
//       dispatch(setGlobalUser(newUser))
//       navigate('/home')
//     } catch (error) {
//       console.error(error)
//     }
//   }

//   const onSubmit = (data: UserFormFormValues) => {
//     if (hasAccount) {
//       signInUser(data)
//     } else {
//       console.log(data)
//       createNewUser(data)
//     }
//   }

//   return (
//     <div className="mt-16 w-[400px] flex flex-col mx-auto items-center gap-8">
//       <div className="flex items-center gap-4">
//         <img src={movieLogo} alt="movie logo" className="w-[75px]" />
//         <h1 className="text-2xl font-medium">Cinema 100</h1>
//       </div>
//       <div className="bg-gray-800 w-[400px] mx-auto p-10 flex flex-col text-sm gap-8 rounded-lg">
//         <h2 className="text-2xl">{hasAccount ? 'Log In' : 'Sign Up'}</h2>
//         <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
//           {hasAccount ? (
//             <LogIn user={user} setUser={setUser} register={register} />
//           ) : (
//             <SignUp
//               newUser={newUser}
//               setNewUser={setNewUser}
//               register={register}
//             />
//           )}
//           <button className="bg-red-500 rounded-lg p-2" type="submit">
//             {hasAccount ? 'Log In' : 'Sign Up'}
//           </button>
//         </form>
//         <div className="flex flex-col gap-2">
//           <p className="flex justify-center gap-2">
//             {hasAccount
//               ? "Don't have an account ?"
//               : 'Already have an account ?'}
//             <span
//               className="text-red-500 cursor-pointer"
//               onClick={() => dispatch(toggleHasAccount())}
//             >
//               {hasAccount ? 'Sign Up' : 'Log In'}
//             </span>
//           </p>
//           {hasAccount && (
//             <p className="flex justify-center gap-2 text-sm">
//               Or,
//               <span
//                 className="text-red-500 cursor-pointer"
//                 onClick={signInGuest}
//               >
//                 Log in as guest
//               </span>
//             </p>
//           )}
//         </div>
//       </div>
//       {errors && (
//         <div className="text-red-500 text-sm py-1">
//           {Object.values(errors).map((error, index) => (
//             <p key={index}>{error.message}</p>
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }

// export default Auth

import movieLogo from '../assets/movie-icon-vector.jpg'
import { useState } from 'react'
import { UserType, NewUserType } from '../utils/types'
import { initialUserState, initialNewUserState } from '../utils/constants'
import { authenticationSchema, UserFormFormValues } from '../utils/zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useAppSlice } from '../hooks/useAppSlice'
import { toggleHasAccount, setGlobalUser } from '../redux/features/appSlice'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router'
import LogIn from './LogIn'
import SignUp from './SignUp'
import { createUser, signInUser, signInGuest } from '../utils/api'

const Auth = () => {
  const [user, setUser] = useState<UserType>(initialUserState)
  const [newUser, setNewUser] = useState<NewUserType>(initialNewUserState)
  const { hasAccount } = useAppSlice()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const form = useForm<UserFormFormValues>({
    defaultValues: {
      email: user.email,
      password: user.password,
    },
    resolver: zodResolver(authenticationSchema),
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form

  const onSubmit = async (data: UserFormFormValues) => {
    if (hasAccount) {
      await signInUser(data, dispatch, navigate, setGlobalUser)
    } else {
      await createUser(data, dispatch, navigate, setGlobalUser, setNewUser)
    }
  }

  return (
    <div className="mt-16 w-[400px] flex flex-col mx-auto items-center gap-8">
      <div className="flex items-center gap-4">
        <img src={movieLogo} alt="movie logo" className="w-[75px]" />
        <h1 className="text-2xl font-medium">Cinema 100</h1>
      </div>
      <div className="bg-gray-800 w-[400px] mx-auto p-10 flex flex-col text-sm gap-8 rounded-lg">
        <h2 className="text-2xl">{hasAccount ? 'Log In' : 'Sign Up'}</h2>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          {hasAccount ? (
            <LogIn user={user} setUser={setUser} register={register} />
          ) : (
            <SignUp
              newUser={newUser}
              setNewUser={setNewUser}
              register={register}
            />
          )}
          <button className="bg-red-500 rounded-lg p-2" type="submit">
            {hasAccount ? 'Log In' : 'Sign Up'}
          </button>
        </form>
        <div className="flex flex-col gap-2">
          <p className="flex justify-center gap-2">
            {hasAccount
              ? "Don't have an account ?"
              : 'Already have an account ?'}
            <span
              className="text-red-500 cursor-pointer"
              onClick={() => dispatch(toggleHasAccount())}
            >
              {hasAccount ? 'Sign Up' : 'Log In'}
            </span>
          </p>
          {hasAccount && (
            <p className="flex justify-center gap-2 text-sm">
              Or,
              <span
                className="text-red-500 cursor-pointer"
                onClick={() => signInGuest(dispatch, navigate, setGlobalUser)}
              >
                Log in as guest
              </span>
            </p>
          )}
        </div>
      </div>
      {errors && (
        <div className="text-red-500 text-sm py-1">
          {Object.values(errors).map((error, index) => (
            <p key={index}>{error.message}</p>
          ))}
        </div>
      )}
    </div>
  )
}

export default Auth
