import { LogInProps } from '../utils/types'
import InputField from './InputField'
const LogIn = ({ user, setUser, register }:LogInProps) => {
  return (
    <>
      <InputField
        type="text"
        placeholder="Email"
        value={user.email}
        changeHandler={(e) =>
          setUser((prev) => ({
            ...prev,
            email: e.target.value,
          }))
        }
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
        value={user.password}
        changeHandler={(e) =>
          setUser((prev) => ({
            ...prev,
            password: e.target.value,
          }))
        }
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
