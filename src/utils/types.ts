export type UserType = {
  email: string;
  password: string;
};

export type NewUserType ={ 
  name:string;
  lastName:string;
  email:string;
  password:string
}

export type InputFieldProps = {
  type: string;
  placeholder: string;
  changeHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export type SingleMovieType = {
  rank: number;
  title: string;
  thumbnail: string;
  rating: string;
  id: string;
  year: number;
  image: string;
  description: string;
  trailer: string;
  genre: string[];
  director: string[];
  writers: string[];
  imdbid: string;
};

export type AppState = {
  hasAccount:boolean;
}