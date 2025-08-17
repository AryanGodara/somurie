import '@farcaster/auth-kit/styles.css';
import {SignInButton} from '@farcaster/auth-kit'

const Login = () => {
  return(
    <>
      <SignInButton
        onSuccess={({ fid, username }) =>
          console.log(`Hello, ${username}! Your fid is ${fid}.`)
        }
      />
    </>
  )
}

export default Login