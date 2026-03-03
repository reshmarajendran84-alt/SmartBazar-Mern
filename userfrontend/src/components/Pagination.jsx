const Pagination = ({ page, setPage, pages }) => {
  return (
    <div className="flex gap-2 mt-5">
      {[...Array(pages).keys()].map(x => (
        <button key={x} onClick={() => setPage(x +1)}>
          {x +1}
        </button>
      ))}
    </div>
  );
};

export default Pagination;