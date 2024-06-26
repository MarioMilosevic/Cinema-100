import { initialNewUserState } from '../utils/constants'
import { NewUserType } from '../utils/types'
import InputField from './InputField'
import { useState } from 'react'

const SignUp = () => {
  const [newUser, setNewUser] = useState<NewUserType>(initialNewUserState)

  return (
    <>
      <InputField
        type="text"
        placeholder="Name"
        value={newUser.name}
        changeHandler={(e) =>
          setNewUser((prev) => ({ ...prev, name: e.target.value }))
        }
        // zod={{
        //   ...register('name', {
        //     required: {
        //       value: true,
        //       message: 'Name is required',
        //     },
        //   }),
        // }}
      />
      <InputField
        type="text"
        placeholder="Last Name"
        value={newUser.lastName}
        changeHandler={(e) =>
          setNewUser((prev) => ({ ...prev, lastName: e.target.value }))
        }
        // zod={{
        //   ...register('lastName', {
        //     required: {
        //       value: true,
        //       message: 'Last Name is required',
        //     },
        //   }),
        // }}
      />
      <InputField
        type="text"
        placeholder="Email"
        value={newUser.email}
        changeHandler={(e) =>
          setNewUser((prev) => ({
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
        value={newUser.password}
        changeHandler={(e) =>
          setNewUser((prev) => ({
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

export default SignUp
