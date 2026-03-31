import { getHome } from './HomeAPI';

export const getHomeData = async () => {
  const data = await getHome();
  return data;
};

export const getSliders = async () => {
  const {sliders} = await getHome() || {};
  return sliders || [];
};

export const getMobileSliders = async () => {
  const data = await getHome();
  return data?.mobile_sliders || [];
};

export const getTopBrands = async () => {
  const data = await getHome();
  return data?.top_brands || [];
};

export const getBrands = async () => {
  const data = await getHome();
  return data?.brands || [];
};

export const getCategories = async () => {
  const data = await getHome();
  return data?.categories || [];
};

export const getBanners = async () => {
  const data = await getHome();
  return data?.banners || [];
};

export const getCoupon = async () => {
  const data = await getHome();
  return data?.coupon || null;
};

export const getDiscountProducts = async () => {
  const data = await getHome();
  return data?.discount_products || [];
};

export const getLadiesProducts = async () => {
  const data = await getHome();
  return data?.ladies_products || [];
};

export const getMensProducts = async () => {
  const data = await getHome();
  return data?.mens_products || [];
};

export const getNewArrival = async () => {
  const data = await getHome();
  return data?.new_arrival || [];
};

export const getTopBanner = async () => {
  const data = await getHome();
  return data?.top_banner || null;
};

export const getTrendingBanners = async () => {
  const data = await getHome();
  return data?.trending_banners || [];
};

export const getTrustContents = async () => {
  const data = await getHome();
  return data?.trust_contents || [];
};

export const getTwoBanners = async () => {
  const data = await getHome();
  return data?.two_banners || [];
};

export const getBlogs = async () => {
  const data = await getHome();
  return data?.blogs || [];
};

export default {
  getHomeData,
  getSliders,
  getMobileSliders,
  getTopBrands,
  getBrands,
  getCategories,
  getBanners,
  getCoupon,
  getDiscountProducts,
  getLadiesProducts,
  getMensProducts,
  getNewArrival,
  getTopBanner,
  getTrendingBanners,
  getTrustContents,
  getTwoBanners,
  getBlogs,
};
