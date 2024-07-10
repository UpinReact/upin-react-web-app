'use client'
import { login } from './actions';
import Link from 'next/link';
import { useState, FormEvent } from 'react';

export default function LoginPage() {
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    const formData = new FormData(event.target as HTMLFormElement);
    const dataa = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };
    event.preventDefault();

    const response = await login(dataa);

    if (response.error) {
      setErrorMessage("Email or Password are incorrect");
    } else {
      setErrorMessage('');
      // redirect to account page
      window.location.href = '/account';
    }
  };

  return (
    <>
      <div className='flex justify-center items-center bg-black'>
        <div className='w-auto h-auto my-20 bg-upinGreen rounded-3xl p-7 opacity-90 shadow-2xl shadow-slate-400'>
          <div>
            <h1 className='font-montserrat text-center mb-5 text-6xl'>Log In</h1>
          </div>
          <form className='grid grid-cols-2 gap-5 w-96' onSubmit={handleSubmit}>
            <label htmlFor="email" className='text-2xl'>Email:</label>
            <input id="email" name="email" type="email" required />
            <label htmlFor="password" className='text-2xl'>Password:</label>
            <input id="password" name="password" type="password" required />
            <button type="submit" className='bg-black text-white w-auto py-1 rounded-2xl col-span-2 self-center hover:bg-transparent hover:border hover:border-neutral-950 hover:text-black'>Log in</button>
          </form>
          {errorMessage && <p className='text-red-500 text-center mt-4'>{errorMessage}</p>}
          <div>
            <button className='rounded-2xl p-1 px-3 w-auto m-2 hover:text-white'>Forgot Password</button>
            <Link href={'/sign-up'} className='border-white rounded-xl p-1 px-3 hover:text-white'>Sign Up</Link>
          </div>
        </div>
      </div>
    </>
  );
}
