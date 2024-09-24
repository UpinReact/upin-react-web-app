import React from 'react';
import Image from 'next/image';
import bgImg from "@/../public/Upin White (cutout content logo).png";

const Footer = () => {
  return (
    <div className="flex-shrink-0">
      <div className='h-48 bg-upinGreen text-white w-screen'>
        <div>
          <Image src={bgImg} alt='Bg Image' className='p-3' />
        </div>
        <div>
          <h3 className='ml-5'>Keep in Touch </h3>
          <form className='m-5'>
            <div className='flex'>
              <input type="email" name="email" placeholder='Email...' className="border border-gray-300 rounded p-2" />
              <input type="submit" value="Keep in touch" className='border border-1-white ml-2 px-2 rounded-xl bg-white text-black hover:bg-upinGreen hover:text-black' />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Wrap the footer and main content in a layout component
const Layout = ({ children }) => {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">{children}</main>
        <Footer />
      </div>
    );
  };
  
  export default Layout;