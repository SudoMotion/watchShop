import { productList } from '@/_lib/productList';
import { topBrands } from '@/_lib/tobBrands';
import BigButton from '@/component/BigButton';
import HeroSlider from '@/component/HeroSlider';
import ProductCard from '@/component/ProductCard';
import ProductSection from '@/component/ProductSection';
import SecoundaryProductSlider from '@/component/SecoundaryProductSlider';
import { Backend_Base_Url } from '@/config';
import { getHome } from '@/stores/HomeAPI';
import { getTopBrands } from '@/stores/homeSpecification';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default async function page() {
  const topBrands = await getTopBrands();
  const {trending_banners, two_banners, discount_products, mens_products, ladies_products, new_arrival} = await getHome() || {};
  const HomeData = await getHome();
  // console.log('trending_banners', HomeData)
  const blurSvg = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiB2aWV3Qm94PSIwIDAgMzAwIDMwMCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2YzZjRmNSIgLz48L3N2Zz4=`;
  return (
    <div>
      <HeroSlider/>
      <div className='py-10 bg-gray-50 px-2'>
        <div className='max-w-7xl mx-auto'>
          <h2 className='text-3xl md:text-4xl font-bold mb-8'>Top Watch Brands</h2>
          <div className='grid grid-cols-5 md:grid-cols-10 items-center justify-center'>
            {topBrands.map((brand, index) => (
              <div key={index} className='flex flex-col items-center p-3 bg-white shadow-sm hover:shadow-md transition-shadow duration-300 w-full'>
                <div className='relative w-full h-10 md:h-20'>
                  <Image
                    src={Backend_Base_Url + '/' + brand.image}
                    alt={brand.name}
                    fill
                    className='object-contain p-2'
                    // sizes='(max-width: 768px) 33vw, (max-width: 1024px) 25vw, 10vw'
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className='max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-7 gap-5 mb-10 md:h-[400px] px-2'>
        <div className='col-span-1 md:col-span-4 rounded-md md:rounded-lg overflow-hidden'>
          <video preload='true' autoPlay loop muted playsInline>
            <source src="/intro.mp4" type="video/mp4" />            
            Your browser does not support the video.
          </video>
        </div>
        <div className='col-span-1 md:col-span-3 rounded-md md:rounded-lg overflow-hidden'>
          <Image src="/images/beside-video.avif" alt="beside-video" width={500} height={500} className='w-full'/>
        </div>
      </div>
      <div className='py-10 bg-black text-white px-2'>
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
      <div className='grid grid-cols-1 md:grid-cols-2 px-2'>
        <SecoundaryProductSlider/>
        <div className='text-center p-5'>
          <h1 className='title'>Discount Products</h1>
          <div className='grid grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-10'>
              {discount_products?.map((item, index) => (
                <ProductCard item={item} key={index} />
              ))}
          </div>
          <Link href={"/product"} className='flex items-center justify-center'>
            <BigButton label="View All Watches" className='mt-10'/>
          </Link>
        </div>
      </div>
      <ProductSection products={new_arrival} title="New Arrival"/>
      <div className='max-w-7xl mx-auto my-10 px-2'>
        <h1 className='title'>Trending Now</h1>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
          {
            two_banners?.map((item, index)=>(
              <Image key={index} placeholder="blur" blurDataURL={blurSvg} src={Backend_Base_Url +'/'+ item?.image} className='w-full md:h-96 object-contain' alt={item.title || ''} width={500} height={500}/>
            ))
          }
        </div>
      </div>
      <ProductSection products={mens_products} title="MEN'S BEST SELLER"/>
      <div className='max-w-7xl mx-auto my-10 px-2'>
        <Image placeholder="blur" blurDataURL={blurSvg} src="/images/offer3.webp" className='w-full object-contain' alt="offer1" width={1500} height={1500}/>
      </div>
      <ProductSection products={ladies_products} title="LADIES BEST SELLER"/>
      <div className='max-w-7xl mx-auto my-10 px-2'>
        <h1 className='title'>Trending Now</h1>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
        {
            trending_banners?.map((item, index)=>(
              <Image key={index} placeholder="blur" blurDataURL={blurSvg} src={Backend_Base_Url +'/'+ item?.image} className='w-full md:h-96 object-contain' alt={item.title || ''} width={500} height={500}/>
            ))
          }
        </div>
      </div>
      <div className='max-w-7xl mx-auto mb-10 px-2'>
        <h1 className='text-2xl md:text-3xl font-semibold'>WATCHSHOPBD: <Link href="#" className='hover:text-red-600 transition-all duration-200'>LATEST MAGAZINE OF WATCH INDUSTRY</Link></h1>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-5 mt-5'>
          <div className='flex flex-col gap-y-1'>
            <div className='rounded-md overflow-hidden'>
              <Image placeholder="blur" blurDataURL={blurSvg} src="/images/magazine1.jpg" className='w-full object-contain rounded-md hover:scale-110 transition-all duration-300' alt="offer1" width={500} height={400}/>
            </div>
              <p className='text-lg font-medium'>Watch Water Resistance</p>
              <p className='text-xl'>Water Resistance watches in Bangladesh</p>
              <p className='line-clamp-3'>Watch Water Resistance Explained: What You Need to Know1. The Great Misconception: Waterproof vs. Water ResistantThe first thing every watch owner must understand is that no w Watch Water Resistance Explained: What You Need to Know1. The Great Misconception: Waterproof vs. Water ResistantThe first thing every watch owner must understand is that no w</p>
          </div>
          <div className='flex flex-col gap-y-1'>
            <div className='rounded-md overflow-hidden'>
              <Image placeholder="blur" blurDataURL={blurSvg} src="/images/magazine2.jpg" className='w-full object-contain rounded-md hover:scale-110 transition-all duration-300' alt="offer1" width={500} height={400}/>
            </div>
              <p className='text-lg font-medium'>Watch Water Resistance</p>
              <p className='text-xl'>Water Resistance watches in Bangladesh</p>
              <p className='line-clamp-3'>Watch Water Resistance Explained: What You Need to Know1. The Great Misconception: Waterproof vs. Water ResistantThe first thing every watch owner must understand is that no w Watch Water Resistance Explained: What You Need to Know1. The Great Misconception: Waterproof vs. Water ResistantThe first thing every watch owner must understand is that no w</p>
          </div>
          <div className='flex flex-col gap-y-1'>
            <div className='rounded-md overflow-hidden'>
              <Image placeholder="blur" blurDataURL={blurSvg} src="/images/magazine3.jpg" className='w-full object-contain rounded-md hover:scale-110 transition-all duration-300' alt="offer1" width={500} height={400}/>
            </div>
              <p className='text-lg font-medium'>Watch Water Resistance</p>
              <p className='text-xl'>Water Resistance watches in Bangladesh</p>
              <p className='line-clamp-3'>Watch Water Resistance Explained: What You Need to Know1. The Great Misconception: Waterproof vs. Water ResistantThe first thing every watch owner must understand is that no w Watch Water Resistance Explained: What You Need to Know1. The Great Misconception: Waterproof vs. Water ResistantThe first thing every watch owner must understand is that no w</p>
          </div>
        </div>
      </div>
      <div className='max-w-7xl mx-auto h-[720px] mb-10 px-2'>
        <iframe width="100%" height="100%" src="https://www.youtube.com/embed/YXCApv8CbzY?si=pSTVmkm-iQnDOu60" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
      </div>
      <div className='max-w-7xl mx-auto px-2'>
        <Image src="/images/payment-method.png" alt="payment-method" width={3000} height={800}/>
      </div>
      <div className='max-w-7xl mx-auto px-2'>
        <h1>Find the Best Watch Price in Bangladesh – 100% Genuine Watches</h1>
        <p>Welcome to <Link href='/' className='font-semibold text-blue-800'>WatchShop BD</Link>, your ultimate destination for premium timepieces in Bangladesh. Whether you're looking for a sophisticated accessory for a formal event, a casual watch for everyday wear, or a special gift for a loved one, we have the perfect collection to meet your needs. Our goal is to bring you a diverse range of high-quality, authentic watches from renowned international brands, offering unparalleled value, style, and reliability.</p>
        <Link href='/' className='font-semibold text-blue-800'>The Best Place to Find Your Ideal Watch</Link>
        <p>At WatchShop BD, we understand that a <Link href="/best-deal" className='font-semibold'>watch</Link> is more than just a tool for telling time. It is a statement of personal style, a reflection of your character, and often a lifelong companion. That's why we take great pride in offering a wide variety of watches, ensuring that everyone can find the perfect timepiece, whether you're a connoisseur of fine watches or just beginning to explore the world of horology.</p>
        
        <h2 className='text-2xl font-semibold mt-8'>Dive into Adventure with Premium Divers Watches</h2>
        <p className='mt-4'>Discover the perfect blend of functionality and style with premium divers' watches from renowned brands like Omega, Oris, Seiko, Citizen, TAG Heuer, Tudor, Longines, and Casio G-shock. Engineered for underwater exploration, these timepieces offer water resistance up to impressive depths, luminous dials for low-light visibility, and rugged durability for extreme conditions. Ideal for professional divers and enthusiasts alike, our collection features watches renowned for precision and innovation. Elevate your adventures with a diver's watch that's built to perform and designed to impress. The <Link href="/best-deal" className='font-semibold text-blue-800'>top 10 watch brands in Bangladesh</Link> are available now at WatchShop BD.</p>
        
        <h2 className='text-2xl font-semibold mt-8'>Luxury Watches and Premium Brands</h2>
        <p className='mt-4'>For those seeking luxury and exclusivity, explore collections from Rado, Tissot, Hamilton, Tudor, Oris, Frederique Constant, and many more. These brands represent the pinnacle of Swiss-made craftsmanship and timeless elegance. Whether it's the intricate details of a RADO or the bold designs of TISSOT, our premium and luxury watch selection offers something extraordinary for watch connoisseurs. On the other hand, unlike most brands, the <Link href='' className='font-semibold text-blue-800'>Seiko watch price in Bangladesh</Link> has spread much more conveniently, accessible for a wide range of customers.</p>
        
        <h2 className='text-2xl font-semibold mt-8'>Sports Watches and Durable Timepieces</h2>
        <p className='mt-4'>Our sports watch and top brand watch collections include shock-resistant models like G-Shock G-Steel, rugged dive watches, and more designed for active lifestyles. These timepieces combine reliability, durability, and cutting-edge design. Perfect for outdoor adventures, sports, or everyday wear, these <span className='font-semibold'>Watch Shop BD</span> watches offer unparalleled functionality.</p>
        
        <h2 className='text-2xl font-semibold mt-8'>More Than Just Watches</h2>
        <p className='mt-4'>At WatchShop BD, we're more than a watch retailer. Explore our range of men's and ladies' fashion, gift items, and special deals for every occasion.</p>
        
        <h2 className='text-2xl font-semibold mt-8'>Affordable and Stylish Watch Options</h2>
        <p className='mt-4'>At <Link href='/' className='font-semibold text-blue-800'>WatchShop BD</Link>, we believe that style and quality should be accessible to everyone. Our collection includes a wide range of affordable yet stylish watches that don't compromise on quality or design. Whether you're looking for a classic timepiece or a modern smartwatch, we have options to suit every budget.</p>
        
        <h3 className='text-xl font-semibold mt-6'>Watch for Men: Style, Functionality, and Durability</h3>
        <p className='mt-2'>Our men's watch collection combines style, functionality, and durability. From sleek dress watches to rugged sports models, each timepiece is designed to complement the modern man's lifestyle. Features like water resistance, chronograph functions, and premium materials ensure that our watches are as practical as they are stylish.</p>
        
        <h3 className='text-xl font-semibold mt-6'>Ladies Watch Collection: Elegance and Sophistication</h3>
        <p className='mt-2'>Discover our exquisite collection of ladies' watches that blend elegance with modern design. From delicate minimalist pieces to bold statement watches, our collection features timepieces that reflect your unique style. Many of our women's watches also include practical features like date displays and water resistance.</p>
        
        <h2 className='text-2xl font-semibold mt-8'>Why Choose WatchShop BD?</h2>
        <div className='space-y-6 mt-6'>
          <div className='flex items-start gap-4'>
            <div className='bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1 font-medium'>1</div>
            <div>
              <h4 className='font-semibold'>Diverse Selection</h4>
              <p className='text-gray-700'>From luxury to budget-friendly, we offer the widest selection of authentic watches in Bangladesh.</p>
            </div>
          </div>
          <div className='flex items-start gap-4'>
            <div className='bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1 font-medium'>2</div>
            <div>
              <h4 className='font-semibold'>Authenticity Guaranteed</h4>
              <p className='text-gray-700'>Every watch we sell is 100% genuine, sourced directly from authorized dealers and manufacturers.</p>
            </div>
          </div>
          <div className='flex items-start gap-4'>
            <div className='bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1 font-medium'>3</div>
            <div>
              <h4 className='font-semibold'>Competitive Pricing</h4>
              <p className='text-gray-700'>We offer the most competitive prices in Bangladesh, with regular promotions and discounts.</p>
            </div>
          </div>
          <div className='flex items-start gap-4'>
            <div className='bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1 font-medium'>4</div>
            <div>
              <h4 className='font-semibold'>Expert Customer Service</h4>
              <p className='text-gray-700'>Our knowledgeable team is always ready to assist you in finding the perfect watch.</p>
            </div>
          </div>
          <div className='flex items-start gap-4'>
            <div className='bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1 font-medium'>5</div>
            <div>
              <h4 className='font-semibold'>Secure and Convenient Shopping</h4>
              <p className='text-gray-700'>Enjoy a seamless online shopping experience with secure payment options and fast delivery across Bangladesh.</p>
            </div>
          </div>
        </div>
        
        <h2 className='text-2xl font-semibold mt-12'>Shop with Confidence at WatchShop BD</h2>
        <p className='mt-4'>Your satisfaction is our top priority. We offer a comprehensive warranty on all our watches, easy returns, and excellent after-sales service. Whether you're shopping for yourself or looking for the perfect gift, you can trust WatchShop BD to provide quality, style, and value.</p>
        <p className='mt-4'>Explore our collections today and discover why we're the preferred destination for watch enthusiasts across Bangladesh. Experience the perfect blend of tradition and innovation with every timepiece from WatchShop BD.</p>
      </div>
    </div>
  )
}
