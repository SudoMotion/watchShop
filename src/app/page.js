import HeroSlider from '@/component/HeroSlider'
import ProductCard from '@/component/ProductCard'
import React from 'react'

export default function page() {
  const productList = [
    {
      id: 1,
      image: '/images/mockProduct/1.png',
      title: 'Rolex Submariner',
      brand: 'Rolex',
      price: '৳1,250,000',
      originalPrice: '৳1,400,000',
      discount: '11% OFF',
      rating: 4.8,
      isNew: true
    },
    {
      id: 2,
      image: '/images/mockProduct/2.png',
      title: 'Omega Speedmaster Moonwatch',
      brand: 'Omega',
      price: '৳850,000',
      originalPrice: '৳920,000',
      discount: '8% OFF',
      rating: 4.7,
      isNew: false
    },
    {
      id: 3,
      image: '/images/mockProduct/3.png',
      title: 'TAG Heuer Carrera',
      brand: 'TAG Heuer',
      price: '৳650,000',
      originalPrice: '৳720,000',
      discount: '10% OFF',
      rating: 4.5,
      isNew: true
    },
    {
      id: 4,
      image: '/images/mockProduct/4.png',
      title: 'Tissot PRX Powermatic 80',
      brand: 'Tissot',
      price: '৳120,000',
      originalPrice: '৳135,000',
      discount: '11% OFF',
      rating: 4.6,
      isNew: false
    },
    {
      id: 5,
      image: '/images/mockProduct/5.png',
      title: 'Casio G-Shock GA-2100',
      brand: 'Casio',
      price: '৳25,000',
      originalPrice: '৳28,000',
      discount: '11% OFF',
      rating: 4.9,
      isNew: true
    },
    {
      id: 6,
      image: '/images/mockProduct/6.png',
      title: 'Seiko Presage Cocktail Time',
      brand: 'Seiko',
      price: '৳85,000',
      originalPrice: '৳95,000',
      discount: '11% OFF',
      rating: 4.7,
      isNew: false
    }
  ];
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
      <div className='grid grid-cols-1 md:grid-cols-2'>
        <HeroSlider/>
        <div className='text-center p-5'>
          <h1 className='text-2xl md:text-3xl pb-5'>Recommend</h1>
          <div className='grid grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-10'>
              {productList.map((item, index) => (
                <ProductCard item={item} key={index} />
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
