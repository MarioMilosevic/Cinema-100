import { SignUpProps } from '../utils/types'
import InputField from './InputField'
const SignUp = ({ register }:SignUpProps) => {
  return (
    <>
      <InputField
        type="text"
        placeholder="Name"
        zod={{
          ...register('name', {
            required: {
              value: true,
              message: 'Name is required',
            },
          }),
        }}
      />
      <InputField
        type="text"
        placeholder="Last Name"
        zod={{
          ...register('lastName', {
            required: {
              value: true,
              message: 'Last Name is required',
            },
          }),
        }}
      />
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

export default SignUp
