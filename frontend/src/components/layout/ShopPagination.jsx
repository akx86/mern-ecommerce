import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ShopPagination = ({ currentPage, totalPages, onPageChange }) => {
  if (!totalPages || totalPages <= 1 || isNaN(totalPages)) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="w-full flex justify-center mt-10 mb-6">
      <Pagination>
        <PaginationContent className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-full px-4 py-1 shadow-lg">
          
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault(); 
                if (currentPage > 1) onPageChange(currentPage - 1);
              }}
              className={`transition-all duration-200 rounded-full ${
                currentPage <= 1 
                ? "pointer-events-none opacity-30 text-zinc-500" 
                : "cursor-pointer text-zinc-300 hover:bg-white/10 hover:text-white"
              }`}
            />
          </PaginationItem>

          {pages.map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                href="#"
                isActive={page === currentPage} 
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(page);
                }}
                className={`rounded-full w-9 h-9 flex items-center justify-center transition-all duration-200 border border-transparent ${
                  page === currentPage 
                  ? "bg-cyan-600 text-white shadow-[0_0_15px_rgba(8,145,178,0.4)] hover:bg-cyan-500 hover:text-white scale-110 font-bold" 
                  : "text-zinc-400 hover:bg-white/10 hover:text-white hover:border-white/10"
                }`}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage < totalPages) onPageChange(currentPage + 1);
              }}
              className={`transition-all duration-200 rounded-full ${
                currentPage >= totalPages 
                ? "pointer-events-none opacity-30 text-zinc-500" 
                : "cursor-pointer text-zinc-300 hover:bg-white/10 hover:text-white"
              }`}
            />
          </PaginationItem>

        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default ShopPagination;