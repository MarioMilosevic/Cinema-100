import movieLogo from "../assets/movie-icon-vector.jpg";
const Login = () => {
  return (
      <div className="mt-32 w-[400px] flex flex-col mx-auto items-center gap-8 border">
          <div className="flex items-center gap-4">
          <img src={movieLogo} alt={movieLogo} className="w-[75px]" />
          <p>Cinema 100</p>
          </div>
      <div className="bg-gray-800 w-[400px] mx-auto p-8 flex flex-col gap-4 rounded-lg">
        <h2>Log In</h2>
        <input type="text" placeholder="Email" className="px-2 py-2 rounded-lg text-gray-950"/>
        <input type="text" placeholder="Password" className="px-2 py-2 rounded-lg text-gray-950"/>
        <button>Log in</button>
      </div>
    </div>
  );
};

export default Login;
