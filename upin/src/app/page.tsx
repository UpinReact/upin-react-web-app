"use client";
import React from 'react';
import MyMap from './components/MyMap';



export default function Home() {

  return (
    <div>
      <MyMap  lng = {-117.1611} lat = {32.7157}/>
    </div>
  );
}

