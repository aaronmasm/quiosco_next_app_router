import Link from "next/link";

type ProductsPaginationProps = {
  page: number;
  totalPages: number;
};

export default function ProductsPagination({
  page,
  totalPages,
}: ProductsPaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="flex justify-center py-10">
      {page > 1 && (
        <Link
          href={`/admin/products?page=${page - 1}`}
          className="inline-flex items-center justify-center rounded-md border
          border-gray-300 bg-white px-3.5 py-2 text-sm font-medium text-gray-700
          shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2
          focus:ring-gray-300 focus:ring-offset-2 transition-colors"
          aria-label="Siguiente página"
          title="Siguiente página"
        >
          &laquo;
        </Link>
      )}

      {pages.map((currentPage) => (
        <Link
          key={currentPage}
          href={`/admin/products?page=${currentPage}`}
          className={`inline-flex items-center justify-center rounded-md border
          border-gray-300 bg-white px-3.5 py-2 
          text-sm ${
            page === currentPage
              ? "font-black ring-2 ring-amber-400 ring-offset-2"
              : "font-medium focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
          } 
          text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none transition-colors`}
          aria-label={`Pagina ${currentPage}`}
          aria-current={page === currentPage ? "page" : undefined}
          title={`Pagina ${currentPage}`}
        >
          {currentPage}
        </Link>
      ))}

      {page < totalPages && (
        <Link
          href={`/admin/products?page=${page + 1}`}
          className="inline-flex items-center justify-center rounded-md border
          border-gray-300 bg-white px-3.5 py-2 text-sm font-medium text-gray-700
          shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2
          focus:ring-gray-300 focus:ring-offset-2 transition-colors"
          aria-label="Siguiente página"
          title="Siguiente página"
        >
          &raquo;
        </Link>
      )}
    </nav>
  );
}
