import HeroSlider from '@/component/HeroSlider'
import React from 'react'

export default function page() {
  return (
    <div>
      <HeroSlider/>
      <div className='py-10 bg-black text-white'>
        <div className='max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between'>
          <p>Important</p>
          <div>
            <p>Important Notice regarding Counterfeit and Modified SEIKO watches</p>
            <p>Notice Concerning Succession of Clock Sales Business from Seiko Time Creation Inc.</p>
            <p>[About the "fake accounts" on our official SNS]</p>
          </div>
          <a href="#">More</a>
        </div>
      </div>
    </div>
  )
}
