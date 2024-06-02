import { auth } from "../config/firebase";
import {
  signInWithEmailAndPassword,
  signInAnonymously,
} from "firebase/auth";
import { useState } from "react";
import { UserType } from "../utils/types";
import {initialUserState } from "../utils/constants";
import InputField from "./InputField";
import movieLogo from "../assets/movie-icon-vector.jpg";
import { useDispatch } from "react-redux";
import { toggleHasAccount } from "../redux/features/appSlice";

const Login = () => {
  const [user, setUser] = useState<UserType>(initialUserState);
const dispatch = useDispatch()

  const signIn = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    if(user.email && user.password) {
      try {
        console.log("proslo")
        await signInWithEmailAndPassword(auth, user.email, user.password)
      } catch (error) {
        console.error("error", error)
      }
    }
  }

  const signInAnonymouslyHandler = async (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    e.preventDefault()
    try {
      await signInAnonymously(auth);
    } catch (error) {
      console.error("Error", error);
    }
  };


  return (
    <div className="mt-16 w-[400px] flex flex-col mx-auto items-center gap-8">

      <div className="flex items-center gap-4">
        <img src={movieLogo} alt={movieLogo} className="w-[75px]" />
        <h1 className="text-2xl font-medium">Cinema 100</h1>
      </div>
      <form className="bg-gray-800 w-[400px] mx-auto p-10 flex flex-col text-sm gap-8 rounded-lg">
        <h2 className="text-2xl">Log In</h2>
        <div className="flex flex-col gap-4">
          <InputField
            type="text"
            placeholder="Email"
            changeHandler={
              (e) =>
                setUser((prev) => ({ ...prev, email: e.target.value })) 
            }
            />
          <InputField
            type="password"
            placeholder="Password"
            changeHandler={(e) =>
              setUser((prev) => ({ ...prev, password: e.target.value }))
            }
            />
          <button className="bg-red-500 rounded-lg p-2" onClick={signIn}>
            Log In
          </button>
        </div>
        <div className="flex flex-col gap-2">
          <p className="flex justify-center gap-2">
            Don't have an account ?
            <span
              className="text-red-500 cursor-pointer"
              onClick={() => dispatch(toggleHasAccount())}
            >
              Sign up
            </span>
            <br />
          </p>
          <p className="flex justify-center gap-2 text-sm">
            Or,
            <span
              className="text-red-500 cursor-pointer"
              onClick={signInAnonymouslyHandler}
              >
              Log in as guest
            </span>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
