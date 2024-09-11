import { InputFieldProps } from '../utils/types'
const InputField = ({
  type,
  placeholder,
  zod,
}: InputFieldProps) => {
  const { onChange: zodOnChange, ...restZodProps } = zod



  return (
    <input
      type={type}
      placeholder={placeholder}
      className="p-2 rounded-lg text-gray-950 placeholder:text-gray-700 focus:ring-4 focus:outline-none focus:ring-red-500 focus:border-none transition-all duration-300"
      onChange={zodOnChange}
      {...restZodProps}
    />
  )
}

export default InputField
