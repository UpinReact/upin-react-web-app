import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import upinLogo from "../../../public/Upin White (cutout content logo).png"

const Header = () => {
  return (
    <nav className='bg-green-400 flex justify-between items-center w-full shadow-2xl shadow-gray-900 z-30'>
        <Image src = {upinLogo} alt = "upin main logo" className='px-2 ml-2 shadow-sm'/>
    <div className='flex-1'> 

    </div> 

    <div className='flex flex-col items-center ml-[-100px]'>

        <h1 className='font-bold text-4xl text-center mb-3'><Link href={'/'}>Upin</Link></h1>
        <p className='text-center font-serif'>Create. Join. Connect</p>
        <ul className='flex justify-between px-4 pt-2'>
            <li className='px-5 hover:text-blue-500 pb-3'>Log In</li>
            <li className='px-5 hover:text-blue-500 pb-3'>Sign Up</li>
        </ul>

    </div>

    <div className='flex-1 flex justify-end'>

    <ul className='flex space-x-4 px-5 mr-12'>
        <li className='hover:text-blue-500 text-lg  font-mono'>News</li>
        <li className='hover:text-blue-500 text-lg  font-mono'> <Link href={"/aboutus"}>About</Link></li>
        <li className='hover:text-blue-500 text-lg  font-mono'>Team</li>
    </ul>

    </div>

    </nav>
  );
}

export default Header;

