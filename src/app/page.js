import HeroSlider from '@/component/HeroSlider';
import RecomendedProducts from '@/component/Recomended-Products';
import SecoundaryProductSlider from '@/component/SecoundaryProductSlider';
import HomeSeoExpandable from '@/component/HomeSeoExpandable';
import SectionArea from '@/component/SectionArea';
import { getHomePageSeo } from '@/lib/homeMeta';
import { getBannerContent } from '@/stores/HomeAPI';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import DynamicSection from '@/component/DynamicSection';
import { getNotice, getSections } from '@/stores/sectionsAPI';
import BannerSection from '@/component/BannerSection';
import HomeMagazineSection from '@/component/HomeMagazineSection';
import HomeCmsBannerGrid from '@/component/HomeCmsBannerGrid';
import { bannerSectionTitle } from '@/lib/bannerSlides';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const seo = await getHomePageSeo();
  if (!seo) return {};

  return {
    ...(seo.meta_title ? { title: { absolute: seo.meta_title } } : {}),
    ...(seo.meta_description ? { description: seo.meta_description } : {}),
    ...(seo.meta_keywords ? { keywords: seo.meta_keywords } : {}),
    ...(seo.canonical_url ? { alternates: { canonical: seo.canonical_url } } : {}),
    openGraph: {
      ...(seo.meta_title ? { title: seo.meta_title } : {}),
      ...(seo.meta_description ? { description: seo.meta_description } : {}),
      ...(seo.canonical_url ? { url: seo.canonical_url } : {}),
    },
  };
}

export default async function page() {
  const bannerResponse = await getBannerContent();
  const seo = await getHomePageSeo();
  const bannersByType =
    bannerResponse?.banners_by_type ??
    bannerResponse?.data?.banners_by_type ??
    {};
  const stickyBanner = bannersByType?.sticky_banner ?? [];
  const gifBanner = bannersByType?.gif_banner ?? [];
  const recommendedBannerList = bannersByType?.recommended_banner ?? [];
  const newArrivalBanners = bannersByType?.new_arrival_banner ?? [];
  const trendingNow12Banners = bannersByType?.trending_now_1_2_banner ?? [];
  const limitedEditionBanners = bannersByType?.limited_edition_banner ?? [];
  const dealBanners = bannersByType?.deal_banner ?? [];

  const recommendedSectionTitle = bannerSectionTitle(recommendedBannerList, 'Recommended');
  const newArrivalSectionTitle = bannerSectionTitle(newArrivalBanners, 'New Arrival');
  const limitedEditionSectionTitle = bannerSectionTitle(limitedEditionBanners, 'Limited Edition');
  const dealSectionTitle = bannerSectionTitle(dealBanners, 'Deals');

  const sectionsResponse = await getSections();
  const sections = sectionsResponse?.sections ?? [];
  const firstSection = sections.slice(0, 1);
  const secondSection = sections.slice(1, 2);
  const thirdSection = sections.slice(2, 3);
  const fourthSection = sections.slice(3, 4);
  const remainingSections = sections.slice(4);
  const {notices :notice} = await getNotice();
  return (
    <div>
      <HeroSlider/>
      <DynamicSection/>
      
      <BannerSection data={stickyBanner} gifBanner={gifBanner}/>
      <div className='py-5 bg-black text-white px-2'>
        <div className='max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between'>
          <p>Important</p>
          <div>
            {
              notice?.map((item, index)=>(
                <Link className='hover:underline transition-all duration-200' key={index} href={item?.page_link ?? '#'}>{item?.name}</Link>
              ))
            }
          </div>
          <Link href="#" className='text-blue-500 hover:text-blue-700 transition-all duration-200'>More</Link>
        </div>
      </div>
      <SectionArea sections={firstSection} />
      <div className='grid grid-cols-1 md:grid-cols-2 px-2'>
        <SecoundaryProductSlider data={recommendedBannerList} />
        <RecomendedProducts sectionTitle={recommendedSectionTitle} />
      </div>
      <HomeCmsBannerGrid title={newArrivalSectionTitle} banners={newArrivalBanners} columns={2} />
      <SectionArea sections={secondSection} className="py-0 md:py-0" />
      <HomeCmsBannerGrid title="Trending Now" banners={trendingNow12Banners} columns={2} />
      <SectionArea sections={thirdSection} className="py-0 md:py-0" />
      <HomeCmsBannerGrid title={limitedEditionSectionTitle} banners={limitedEditionBanners} columns={2} />
      <SectionArea sections={fourthSection} className="py-0 md:py-0" />
      <SectionArea sections={remainingSections} className="py-0 md:py-0" />
      <HomeCmsBannerGrid title={dealSectionTitle} banners={dealBanners} columns={2} />
      <HomeMagazineSection />
      <div className='max-w-7xl mx-auto mb-10 px-2'>
        <div className="relative w-full overflow-hidden rounded-lg bg-black aspect-21/9">
          <iframe className="absolute inset-0 h-full w-full" src="https://www.youtube.com/embed/YXCApv8CbzY?si=pSTVmkm-iQnDOu60" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
        </div>
      </div>
      <div className='max-w-7xl mx-auto px-2'>
        <Image src="/images/payment-method.png" alt="payment-method" width={3000} height={800}/>
      </div>
      {seo?.content ? (
        <section className="home-cms-content max-w-7xl mx-auto px-2 py-8">
          <div
            className="prose prose-sm sm:prose-base max-w-none prose-headings:font-semibold"
            dangerouslySetInnerHTML={{ __html: seo.content }}
          />
        </section>
      ) : null}
      {!seo?.content && seo?.long_description ? (
        <section className="max-w-7xl mx-auto px-2 py-8 text-sm text-gray-700 leading-relaxed">
          {seo.long_description}
        </section>
      ) : null}
      <HomeSeoExpandable />
    </div>
  )
}
