import { useState, useEffect } from 'react';
import { getBlogList } from '@/stores/blogAPI';

/** Items per page sent to `/api/blog` (first item is featured layout; grid shows the rest). */
export const BLOG_LIST_PER_PAGE = 7;

function normalizeBlogListResult(result) {
  if (!result || typeof result !== 'object') {
    return { blogs: [], lastPage: 1 };
  }
  let raw = result.data;
  if (!Array.isArray(raw) && raw && typeof raw === 'object' && Array.isArray(raw.data)) {
    raw = raw.data;
  }
  const blogs = Array.isArray(raw) ? raw : [];
  const lastPage =
    result.last_page ??
    result.lastPage ??
    (raw && typeof raw === 'object' && !Array.isArray(raw) ? raw.last_page : null) ??
    1;
  return { blogs, lastPage: Number(lastPage) || 1 };
}

export function useGetBlogList(currentPage, options = {}) {
  const page = Math.max(1, Number(currentPage) || 1);
  const perPage = options.perPage ?? BLOG_LIST_PER_PAGE;
  const [blogs, setBlogs] = useState([]);
  const [lastPage, setLastPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    (async () => {
      const payload = await getBlogList({
        page,
        per_page: perPage,
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
  }, [page, perPage]);

  return { blogs, lastPage, isLoading };
}
