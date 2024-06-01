export type UserType = {
    email: string;
    password:string
}

export type InputFieldProps = {
  type: string;
  placeholder: string;
  changeHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
};