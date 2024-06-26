import { initialUserState } from '../utils/constants'
import { UserType } from '../utils/types'
import InputField from './InputField'
import { useState } from 'react'
const LogIn = () => {
  const [user, setUser] = useState<UserType>(initialUserState)
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
        // zod={{
        //     ...register('email', {
        //         required: {
        //             value: true,
        //             message: 'Email is required',
        //         },
        //     }),
        // }}
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
        // zod={{
        //     ...register('password', {
        //         required: {
        //             value: true,
        //             message: 'Password is required',
        //         },
        //     }),
        // }}
      />
    </>
  )
}

export default LogIn
