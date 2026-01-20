import { Link } from "react-router-dom";
import {
  HomeIcon,
  Squares2X2Icon,
  InformationCircleIcon,
  ArrowRightEndOnRectangleIcon,
} from "@heroicons/react/24/solid";
import { MapPinIcon } from "@heroicons/react/24/solid";

const Navbar = () => {
  return (
    <>
      {/* Mobile Navbar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-yellow-300 border-t-4 border-black shadow-[0_-4px_0_#000] sm:hidden">
        <div className="flex justify-around items-center py-2">
          <NavItem to="/" color="text-red-600">
            <HomeIcon className="w-6 h-6 drop-shadow-[1px_1px_0_#000]" />
            Home
          </NavItem>

          <NavItem to="/location" color="text-blue-600">
            <MapPinIcon className="w-6 h-6 drop-shadow-[1px_1px_0_#000]" />
            Lokasi
          </NavItem>

          <NavItem to="/food" color="text-green-600">
            <Squares2X2Icon className="w-6 h-6 drop-shadow-[1px_1px_0_#000]" />
            Menu
          </NavItem>

          <NavItem to="/contact" color="text-pink-600">
            <InformationCircleIcon className="w-6 h-6 drop-shadow-[1px_1px_0_#000]" />
            Kontak
          </NavItem>

          <NavItem to="/login" color="text-black">
            <ArrowRightEndOnRectangleIcon className="w-6 h-6 drop-shadow-[1px_1px_0_#000]" />
            Login
          </NavItem>
        </div>
      </div>

      {/* Desktop Navbar */}
      <div className="hidden sm:flex fixed top-0 left-0 right-0 z-50 bg-red-500 border-b-4 border-black shadow-[0_4px_0_#000] px-8 py-3 justify-between items-center">
        <div className="text-2xl font-extrabold tracking-wide text-yellow-300 drop-shadow-[2px_2px_0_#000]">
          🍜 Warung Ceunah
        </div>

        <div className="flex space-x-4">
          <DesktopNav to="/" bg="bg-yellow-300">
            <HomeIcon className="w-5 h-5 drop-shadow-[1px_1px_0_#000]" />
            Home
          </DesktopNav>

          <DesktopNav to="/location" bg="bg-blue-300">
            <MapPinIcon className="w-5 h-5 drop-shadow-[1px_1px_0_#000]" />
            Lokasi
          </DesktopNav>

          <DesktopNav to="/food" bg="bg-green-300">
            <Squares2X2Icon className="w-5 h-5 drop-shadow-[1px_1px_0_#000]" />
            Menu
          </DesktopNav>

          <DesktopNav to="/contact" bg="bg-pink-300">
            <InformationCircleIcon className="w-5 h-5 drop-shadow-[1px_1px_0_#000]" />
            Kontak
          </DesktopNav>

          {/* LOGIN BUTTON */}
          <Link
            to="/login"
            className="ml-4 bg-amber-800 text-yellow-300 font-extrabold px-5 py-2
              border-2 border-black shadow-[3px_3px_0_#000]
              hover:-translate-y-1 hover:shadow-[5px_5px_0_#000]
              transition-all flex items-center space-x-2"
          >
            <ArrowRightEndOnRectangleIcon className="w-5 h-5" />
            <span>Login</span>
          </Link>
        </div>
      </div>
    </>
  );
};

const NavItem = ({ to, children, color }) => (
  <Link
    to={to}
    className={`flex flex-col items-center text-xs font-extrabold ${color}
      hover:-translate-y-1 hover:scale-110 transition-transform`}
  >
    {children}
  </Link>
);

const DesktopNav = ({ to, children, bg }) => (
  <Link
    to={to}
    className={`${bg} text-black font-extrabold px-4 py-2
      border-2 border-black shadow-[3px_3px_0_#000]
      hover:-translate-y-1 hover:shadow-[5px_5px_0_#000]
      transition-all flex items-center space-x-1`}
  >
    {children}
  </Link>
);

export default Navbar;
