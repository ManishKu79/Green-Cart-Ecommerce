import React from 'react'
import MainBanner from '../component/MainBanner'
import Category from '../component/Category'
import BestSeller from '../component/BestSeller'
import BottomBanner from '../component/BottomBanner'
import NewsLetter from '../component/NewsLetter'

const Home = () => {
  return (
    <div className='mt-10'>
      <MainBanner/>
      <Category/>
      <BestSeller/>
      <BottomBanner/>
      <NewsLetter/>
    </div>
  )
}

export default Home
