import { Link } from "react-router-dom";

export const NotFound = () => {
  return (
    <div className="text-center mt-20">

      <h1 className="text-4xl font-bold">404</h1>
      <p>Page Not Found</p>

      <Link to="/" className="text-indigo-600">
        Go Home
      </Link>

    </div>
  );
};
export default NotFound;