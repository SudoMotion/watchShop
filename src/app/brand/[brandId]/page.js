import { productList } from '@/_lib/productList';
import ProductCard2 from '@/component/ProductCard2';
import ProductFilter from '@/component/ProductFilter';
import { getProductsByBrand } from '@/stores/ProductAPI';
import React from 'react'

function brandToSlug(name) {
  return name.toLowerCase().replace(/\s+/g, '-');
}

const navBrandNames = [
  "Seiko", "Tissot", "Citizen", "Rado", "Fossil", "Emporio Armani", "Orient", "Omega",
  "Pagani Design", "Titan", "Casio", "Casio Edifice", "Casio G-Shock", "Longines", "Oris",
  "TAG Heuer", "Tommy Hilfiger", "Daniel Klein (DK)", "Hamilton", "Victorinox",
  "West End Watch", "Swatch", "Mido", "Michael Kors (MK)", "Hugo Boss", "Guess", "Fastrack",
  "Certina", "Frederique Constant", "Mathey Tissot", "Police", "Curren", "Naviforce", "Timex",
  "Olevs", "Tudor", "Omax", "Casio Pro Trek", "Q&Q", "Santa Barbara PRC", "Movado", "Invicta",
  "Louis Cardin", "Oliya",
];

export async function generateStaticParams() {
  const fromProductList = productList.map((p) => p.brand);
  const allNames = [...new Set([...fromProductList, ...navBrandNames])];
  return allNames.map((brand) => ({
    brandId: brandToSlug(brand),
  }));
}

export default async function page({ params }) {
  const { brandId } = await params;
  const data = productList;
  const products = await getProductsByBrand(brandId);
  console.log(products)
  return (
    <div>
      <div className="py-24 flex items-center justify-center" style={{backgroundImage: "url('/images/brand-banner.webp')",}}>
        <div className="text-5xl font-bold bg-gray-400/40 text-white rounded-2xl backdrop-blur-md p-5">
          <span className="capitalize">{brandId}</span>
        </div>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-3 mt-2 md:mt-4 px-2'>
        <ProductFilter/>
        <div className="md:col-span-2 lg:col-span-3 xl:col-span-4 max-h-screen overflow-y-auto">
          {/* Products will be loaded here */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {data.map((product, index) => (
              <ProductCard2 item={product} key={index}/>
            ))}
            {data.map((product, index) => (
              <ProductCard2 item={product} key={index}/>
            ))}

            {data.map((product, index) => (
              <ProductCard2 item={product} key={index}/>
            ))}
            {data.map((product, index) => (
              <ProductCard2 item={product} key={index}/>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
