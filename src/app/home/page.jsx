"use client";
import  Events  from '@/components/Events';
import  Hero  from '@/components/Hero';
import Partners  from '@/components/Partners';
import  Steps  from '@/components/Steps';
import Sustainability  from '@/components/Sustainability';
import React from 'react'

const HomePage = () => {
  return (
    <div>
      <Hero/>
      <Steps/>
      <Events/>
      <Partners/>
      <Sustainability/>
    </div>
  )
}

export default HomePage;
