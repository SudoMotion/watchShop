"use client";
export const Pagination = ({ currentPage, lastPage, onPageChange }) => {
    const banglaNumbers = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    const convertToBangla = (number) =>
      number.toString().split('').map(n => banglaNumbers[n] || n).join('');
  
    const getPages = () => {
      const pages = [];
  
      // Case 1: Show all pages if total page <= 6
      if (lastPage <= 6) {
        for (let i = 1; i <= lastPage; i++) {
          pages.push(i);
        }
        return pages;
      }
  
      // Always include 1 and last
      pages.push(1);
  
      // Calculate left/right boundaries
      let left = currentPage - 1;
      let right = currentPage + 1;
  
      // Make sure within valid range
      if (currentPage <= 3) {
        left = 2;
        right = 4;
      } else if (currentPage >= lastPage - 2) {
        left = lastPage - 3;
        right = lastPage - 1;
      }
  
      if (left > 2) {
        pages.push('...');
      }
  
      for (let i = left; i <= right; i++) {
        if (i > 1 && i < lastPage) {
          pages.push(i);
        }
      }
  
      if (right < lastPage - 1) {
        pages.push('...');
      }
  
      pages.push(lastPage);
  
      // Enforce max 6 page buttons (between prev/next)
      if (pages.length > 6) {
        const filtered = [];
        let ellipsisAdded = false;
        for (let i = 0; i < pages.length; i++) {
          if (pages[i] === '...') {
            if (!ellipsisAdded) {
              filtered.push(pages[i]);
              ellipsisAdded = true;
            } else {
              // Replace second ellipsis with a real page number
              const prev = typeof pages[i - 1] === 'number' ? pages[i - 1] : 1;
              filtered.push(prev + 1);
            }
          } else {
            filtered.push(pages[i]);
          }
        }
        return filtered.slice(0, 6); // Ensure 6 items between prev/next
      }
  
      return pages;
    };
  
    const visiblePages = getPages();
    return (
      <div className="flex justify-center items-center gap-1 mt-4">
        {/* Previous */}
        <button
          onClick={() => onPageChange(Number(currentPage) - 1)}
          disabled={currentPage == 1}
          className={`h-10 w-10 border border-gray-500 rounded text-gray-600 hover:bg-gray-100 disabled:opacity-50 ${currentPage == 1 ? 'cursor-not-allowed' : ''}`}
        >
          ‹
        </button>
  
        {/* Pages */}
        {visiblePages.map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            disabled={page === '...'}
            className={`h-10 w-10 border border-gray-600 rounded ${
              page === Number(currentPage) ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100'
            } ${page === '...' ? 'cursor-default' : ''}`}
          >
            {typeof page === 'number' ? convertToBangla(page) : '...'}
          </button>
        ))}
  
        {/* Next */}
        <button
          onClick={() => onPageChange(Number(currentPage) + 1)}
          disabled={currentPage == lastPage}
          className={`h-10 w-10 border rounded text-gray-600 hover:bg-gray-100 disabled:opacity-50 border-gray-500 ${currentPage == lastPage ? 'cursor-not-allowed' : ''}`}
        >
          ›
        </button>
      </div>
    );
  };
  