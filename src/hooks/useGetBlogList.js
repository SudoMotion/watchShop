import { useState, useEffect } from 'react';
import { getBlogList } from '@/stores/blogAPI';

/** Items per page sent to `/api/blog` (first item is featured layout; grid shows the rest). */
export const BLOG_LIST_PER_PAGE = 7;

function normalizeBlogListResult(result) {
  if (!result || typeof result !== 'object') {
    return { blogs: [], lastPage: 1 };
  }
  const raw = result.data;
  const blogs = Array.isArray(raw) ? raw : Array.isArray(raw?.data) ? raw.data : [];
  const lastPage =
    result.last_page ??
    result.lastPage ??
    raw?.last_page ??
    1;
  return { blogs, lastPage: Number(lastPage) || 1 };
}

export function useGetBlogList(currentPage) {
  const page = Math.max(1, Number(currentPage) || 1);
  const [blogs, setBlogs] = useState([]);
  const [lastPage, setLastPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    (async () => {
      const payload = await getBlogList({
        page,
        per_page: BLOG_LIST_PER_PAGE,
      });
      if (cancelled) return;
      const normalized = normalizeBlogListResult(payload);
      setBlogs(normalized.blogs);
      setLastPage(normalized.lastPage);
      setIsLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [page]);

  return { blogs, lastPage, isLoading };
}
