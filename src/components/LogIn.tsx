import { LogInProps } from '../utils/types'
import InputField from './InputField'
const LogIn = ({ register }:LogInProps) => {
  return (
    <>
      <InputField
        type="text"
        placeholder="Email"
        zod={{
          ...register('email', {
            required: {
              value: true,
              message: 'Email is required',
            },
          }),
        }}
      />
      <InputField
        type="password"
        placeholder="Password"
        zod={{
          ...register('password', {
            required: {
              value: true,
              message: 'Password is required',
            },
          }),
        }}
      />
    </>
  )
}

export default LogIn
