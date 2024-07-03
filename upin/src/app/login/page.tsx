import { login } from './actions';
import Link from 'next/link';


export default function LoginPage() {
  return (
  <>
  <div className='flex justify-center items-center bg-black'>
    <div className='w-auto h-auto my-20 bg-upinGreen rounded-3xl p-7 opacity-90 shadow-2xl shadow-slate-400'>
        <div>
          <h1 className='font-montserrat text-center mb-5 text-6xl'>Log In</h1>
        </div>
        <form className='grid grid-cols-2 gap-5  w-96' >
          <label htmlFor="email" className='text-2xl'>Email:</label>
          <input id="email" name="email" type="email" required />
          <label htmlFor="password" className='text-2xl'>Password:</label>
          <input id="password" name="password" type="password" required />
          <button formAction={login} className='bg-black text-white w-auto py-1 rounded-2xl col-span-2 self-center hover:bg-transparent hover:border hover:border-neutral-950 hover:text-black' >Log in</button>
        </form>
        <div>
          <button className=' rounded-2xl p-1 px-3 t w-auto m-2  hover:text-white'>Forgot Password </button>
          <Link href={'/sign-up'} className=' border-white rounded-xl p-1 px-3 hover:text-white'>Sign Up</Link>
        </div>
    </div>
  </div>
  </>
  )
}