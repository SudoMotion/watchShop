
import ProductCard2 from '@/component/ProductCard2';
import ProductFilter from '@/component/ProductFilter';
import { getProductsByBrand } from '@/stores/ProductAPI';
import React from 'react'

export async function generateStaticParams() {
  const brandSlugs = [
    // Core watch brands
    'seiko',
    'tissot',
    'citizen',
    'rado',
    'orient',
    'fossil',
    'emporio-armani',
    'omega',
    'pagani-design',
    'titan',
    'casio',
    'casio-edifice',
    'casio-g-shock',
    'longines',
    'oris',
    'tag-heuer',
    'tommy-hilfiger',
    'daniel-klein-dk',
    'hamilton',
    'victorinox',
    'mido',
    'michael-kors-mk',
    'hugo-boss',
    'guess',
    'fastrack',
    'certina',
    'frederique-constant',
    'mathey-tissot',
    'police',
    'curren',
    'naviforce',
    'timex',
    'olevs',
    'tudor',
    'omax',
    'casio-pro-trek',
    'qq',
    'santa-barbara-prc',
    'movado',
    'invicta',

    // Accessories / fashion brands present in API
    'watch-organizer-box',
    'fossil-watch-strap',
    'watch-winder',
    'watch-strap',
    'perfume',
    'wallet',
    'sunglass',
    'ties',
    'cufflinks',
    'bentley',
    'poedagar',
    'creed',
    'mens',
    'ladies',
    'limited-edition',
    'oliya',
    'ferrari',
    'sholder-bag',
    'jaguar',
    'maserati',
    'arabian-oud',
    'montblanc',
    'dunhill',
    'dior',
    'giorgio-armani',
  ];

  return brandSlugs.map((slug) => ({ brandId: slug }));
}

export default async function page({ params }) {
  const { brandId } = await params;
  const products = await getProductsByBrand(brandId);
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/d1c02dd7-cbd9-4eee-9fc7-69ffe71fb03e',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'brand/[brandId]/page.js:page',message:'brand page data',data:{brandId,productsIsNull:products==null,hasBrand:products?.brand!=null,hasBrandProduct:products?.brand?.product!=null,productItemsLen:Array.isArray(products)?products.length:(products?.data??products?.products??[]).length},timestamp:Date.now(),hypothesisId:'H1'})}).catch(()=>{});
  // #endregion
  const productItems = Array.isArray(products)
    ? products
    : products?.data ?? products?.products ?? products?.brand?.product ?? [];
  const safeItems = Array.isArray(productItems) ? productItems : [];

  return (
    <div>
      <div className="py-16 flex items-center justify-center" style={{backgroundImage: "url('/images/brand-banner.webp')",}}>
        <div className="text-5xl font-bold bg-gray-400/40 text-white rounded-2xl backdrop-blur-md p-5">
          <span className="capitalize">{brandId}</span>
        </div>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-3 mt-2 md:mt-4 px-2'>
        <ProductFilter brandId={brandId} />
        <div className="md:col-span-2 lg:col-span-3 xl:col-span-4 max-h-screen overflow-y-auto">
          {/* Products will be loaded here */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {safeItems.map((product, index) => (
              <ProductCard2 item={product} key={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
