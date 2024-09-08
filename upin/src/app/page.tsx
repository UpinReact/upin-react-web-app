"use client";
import React from 'react';
import MyMap from './components/MyMap';




export default function Home() {

  return (
   
    <div className='phone:h-auto tablet:h-auto'>
      <MyMap lng = {-117.1661} lat={33.1434}/>
    </div>
 
  );
}

