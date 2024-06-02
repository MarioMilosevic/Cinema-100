import { InputFieldProps } from "../utils/types";
const InputField = ({ type, placeholder, changeHandler, value }: InputFieldProps) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      className="p-2 rounded-lg text-gray-950 placeholder:text-gray-700 focus:ring-4 focus:outline-none focus:ring-red-500 focus:border-none transition-all duration-300"
      onChange={(e) => changeHandler(e)}
    />
  );
};

export default InputField;
