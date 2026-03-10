const Pagination = ({ page, setPage, pages }) => {
  return (
    <div className="flex gap-2 mt-5">
      {Array.from({ length: pages }, (_, i) => (
        <button
          key={i}
          onClick={() => setPage(i + 1)}
          className={`px-3 py-1 border ${
            page === i + 1 ? "bg-blue-500 text-white" : ""
          }`}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
};

export default Pagination;