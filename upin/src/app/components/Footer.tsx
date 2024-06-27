import React from 'react'
import Image from 'next/image'
import bgImg from "@/../public/Upin White (cutout content logo).png"

const Footer = () => {
  return (
    <div>
        <div className='h-48 bg-upinGreen text-white z-50 absolute w-screen'>
            <div>
                <Image src={bgImg} alt='Bg Image'  className='p-3'/>
            </div>
            <div>
                <h3 className='ml-5'>Keep in Touch </h3>
                <form className='m-5'>
                    <div className='flex'>
                        <input type="email" name="email" placeholder='Email...' />
                        <input type="submit" value="Keep in touch"  className='border border-1-white ml-2 px-2 rounded-xl bg-white text-black hover:bg-upinGreen hover:text-black'/>
                    </div>
                </form>
            </div>
        </div>
    </div>
  )
}

export default Footer