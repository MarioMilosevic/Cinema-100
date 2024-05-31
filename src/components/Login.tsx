import { auth } from "../config/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import movieLogo from "../assets/movie-icon-vector.jpg";
import { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

    const signIn = async () => {
      await createUserWithEmailAndPassword(auth, email, password)
  };

  return (
    <div className="mt-16 w-[400px] flex flex-col mx-auto items-center gap-8">
      <div className="flex items-center gap-4">
        <img src={movieLogo} alt={movieLogo} className="w-[75px]" />
        <h1 className="text-2xl font-medium">Cinema 100</h1>
      </div>
      <div className="bg-gray-800 w-[400px] mx-auto p-12 flex flex-col text-sm gap-8 rounded-lg">
        <h2 className="text-2xl">Log In</h2>
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Email"
            className="p-2 rounded-lg text-gray-950 placeholder:text-gray-700"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="p-2 rounded-lg text-gray-950 placeholder:text-gray-700"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="bg-red-500 rounded-lg p-2" onClick={signIn}>
            Log in
          </button>
        </div>
        <div className="flex flex-col gap-2 pt-2">
          <p className="flex justify-center gap-2">
            Don't have an account ?
            <span className="text-red-500 cursor-pointer">Sign up</span>
            <br />
          </p>
          <p className="flex justify-center gap-2 text-sm">
            Or,
            <span className="text-red-500 cursor-pointer">Log in as guest</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
