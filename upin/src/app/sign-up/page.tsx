import { signup } from './actions';
import Link from "next/link"



export default function SignUpPage() {
  return (
  <>
  <div className='flex justify-center items-center  bg-black w-screen'>
    <div className='w-auto h-auto my-20 bg-upinGreen rounded-3xl p-7 opacity-90 shadow-2xl shadow-slate-400'>
      <div>
        <h1 className='font-montserrat text-center mb-5 text-6xl'>Sign Up</h1>
      </div>
      <form className='grid grid-cols-2  gap-9 w-full' >
        <label htmlFor="email" className='text-2xl'>Email:</label>
        <input id="email" name="email" type="email" required  className='rounded-2xl'/>
        <label htmlFor="password" className='text-2xl'>Password:</label>
        <input id="password" name="password" type="password" required  className='rounded-2xl'/>
        <label htmlFor="confirmPassword" className='text-2xl'>Confirm Password:</label>
        <input type="password" name="confirmPassword" id="confirmPassword" required className='rounded-2xl' />
        <label htmlFor="firstName" className='text-2xl'>First Name:</label>
        <input type="text" name="firstName" id="firstname" className='rounded-2xl' />
        <label htmlFor="lastName" className='text-2xl'>Last Name:</label>
        <input type="text" name="lastName" id="lastName"  className='rounded-2xl'/>
        <label htmlFor="phone" className='text-2xl'>Phone Number:</label>
        <input type="tel" name="phone" id="phone" className='rounded-2xl' />


        
          <legend className='text-2xl'>Choose your Interests:</legend>
          <div className='grid grid-cols-2 '>
            <div>
              <input type="checkbox" id="music" name="music" />
              <label for="music" className='px-2'>Music</label>
            </div>

            <div>
              <input type="checkbox" id="movies" name="movies" />
              <label for="movies" className='px-2'>Movies</label>
            </div>
            <div>
              <input type="checkbox" id="gaming" name="gaming" />
              <label for="gaming" className='px-2'>Gaming</label>
            </div>
            <div>
              <input type="checkbox" id="chilling" name="chilling" />
              <label for="Chilling" className='px-2'>Chilling</label>
            </div>
            <div>
              <input type="checkbox" id="literature" name="literature" />
              <label for="literature" className='px-2'>literature</label>
            </div>
            <div>
              <input type="checkbox" id="other" name="other" value={"still deciding "}/>
              <label for="other" className='px-2'>Other</label>
            </div>
          </div>
          <label htmlFor="gender" className='text-2xl'>Select Gender:</label>
          <select id="gender" name="gender" className='rounded-2xl px-2'>
            <option value=""  className='roundex-2xl' disabled selected>Select your gender</option>
            <option value="male" className='roundex-2xl'>Male</option>
            <option value="female" className='roundex-2xl'>Female</option>
            <option value="prefer not to say" className='roundex-2xl'>Prefer not to say</option>
          </select>

          <label htmlFor="age" className='text-2xl'>Age:</label>
          <input type="number" name="age" id="age" className='rounded-2xl'/>
          <label htmlFor="birthdate" className='text-2xl'>Birthdate</label>
          <input type="date" name="birthday" id="birthday" className='rounded-2xl px-2'/>
          <label htmlFor="bio" className='text-2xl'>Add a bio:</label>
          <textarea name="bio" id="bio" cols="30" rows={"5"} placeholder='Just something small...'></textarea>
          <button formAction={signup} className='bg-black text-white w-auto py-1 rounded-2xl col-span-2 self-center hover:bg-transparent hover:border hover:border-neutral-950 hover:text-black mb-4'>Sign up</button>
      </form>
      <Link href={'/login'} className=' border-white rounded-xl p-1 px-3 hover:text-white'>Already have an account? Login</Link>
    </div>
  </div>
  
  </>
  )
}
