const Pagination = ({ page, setPage, pages }) => {
  if (!pages || pages <= 1) return null; // ← hide when only 1 page

  return (
    <div className="flex gap-2 mt-6 flex-wrap">
      {/* Prev button */}
      <button
        onClick={() => setPage(page - 1)}
        disabled={page === 1}
        className="px-3 py-1 border rounded disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
      >
        ← Prev
      </button>

      {/* Page numbers */}
      {Array.from({ length: pages }, (_, i) => {
        const p = i + 1;
        // Show first, last, current, and neighbours — hide rest with ellipsis
        const show =
          p === 1 || p === pages || Math.abs(p - page) <= 1;
        const showLeftDots  = p === 2 && page > 4;
        const showRightDots = p === pages - 1 && page < pages - 3;

        if (showLeftDots || showRightDots) {
          return <span key={p} className="px-2 py-1 text-gray-400">…</span>;
        }
        if (!show) return null;

        return (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={`px-3 py-1 border rounded transition ${
              page === p
                ? "bg-blue-500 text-white border-blue-500"
                : "hover:bg-gray-100"
            }`}
          >
            {p}
          </button>
        );
      })}

      {/* Next button */}
      <button
        onClick={() => setPage(page + 1)}
        disabled={page === pages}
        className="px-3 py-1 border rounded disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
      >
        Next →
      </button>
    </div>
  );
};

export default Pagination;