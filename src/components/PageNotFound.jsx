import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    
    <div className="min-h-screen flex flex-col items-center justify-center bg-orange-100 backdrop-blur-sm ">
      <h1 className="text-6xl font-bold text-orange-700 mb-4">404</h1>
      <p className="text-xl text-orange-800 mb-6">Oops! Page not found 🍂</p>
      <Link
        to="/"
        className="px-6 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition"
      >
        Go to Home
      </Link>
    </div>
  );
};

export default PageNotFound;
