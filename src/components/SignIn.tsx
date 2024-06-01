import { useState } from "react"
import movieLogo from "../assets/movie-icon-vector.jpg"
import { NewUserType } from "../utils/types";
import { initialNewUserState } from "../utils/constants";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import InputField from "./InputField";
const SignIn = () => {
    const [newUser, setNewUser] = useState<NewUserType>(initialNewUserState);

    const createNewUser = async () => {
        if(newUser.email && newUser.password) {
          try {
            await createUserWithEmailAndPassword(auth, newUser.email, newUser.password);
          } catch (error) {
            console.error("Error", error);
          }
        }
      };

  return (
    <div className="mt-16 w-[400px] flex flex-col mx-auto items-center gap-8">
    <div className="flex items-center gap-4">
      <img src={movieLogo} alt={movieLogo} className="w-[75px]" />
      <h1 className="text-2xl font-medium">Cinema 100</h1>
    </div>
    <div className="bg-gray-800 w-[400px] mx-auto p-10 flex flex-col text-sm gap-8 rounded-lg">
      <h2 className="text-2xl">Sign In</h2>
      <div className="flex flex-col gap-4">
        <InputField type="text" placeholder="Name"  changeHandler={(e) =>
            setNewUser((prev) => ({ ...prev, name: e.target.value }))
          }/>
        <InputField type="text" placeholder="Last Name"  changeHandler={(e) =>
            setNewUser((prev) => ({ ...prev, lastName: e.target.value }))
          }/>
        <InputField
          type="text"
          placeholder="Email"
          changeHandler={
        (e) => setNewUser((prev) => ({...prev, email:e.target.value}))
          }
        />
        <InputField
          type="password"
          placeholder="Password"
          changeHandler={(e) => setNewUser((prev) => ({...prev, password: e.target.value}))
          }
        />
        <button className="bg-red-500 rounded-lg p-2" onClick={createNewUser}>
          Log In
        </button>
      </div>
      <div className="flex flex-col gap-2">
        <p className="flex justify-center gap-2">
          Don't have an account ?
          <span
            className="text-red-500 cursor-pointer"
            onClick={() => setHasAccount((prev) => !prev)}
          >
            Sign up
          </span>
          <br />
        </p>
        {!hasAccount && 
        <p className="flex justify-center gap-2 text-sm">
          Or,
          <span
            className="text-red-500 cursor-pointer"
            onClick={signInAnonymouslyHandler}
            >
            Log in as guest
          </span>
        </p>
          }
      </div>
    </div>
  </div>
  )
}

export default SignIn
