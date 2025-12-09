import { Link, useRouter } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/slice/authSlice";
import { logoutUser } from "../api/user.api";

const NavBar = () => {
  const queryClient = useQueryClient();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    const success = await logoutUser();
    if (success) {
      dispatch(logout());
      queryClient.removeQueries(["currentUser"]); //clear cached user
      router.navigate({ to: "/" });
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {isAuthenticated ? 
            <Link
              to="/dashboard"
            className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition "
            >
              Cut.it
            </Link> : 
            <Link
              to="/"
              className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition"
            >
              Cut.it
            </Link>
          }
         
          {!isAuthenticated && (
            <div className="flex items-center space-x-6">
              <Link
                to="/login"
                // className={({isActive}) => `text-lg transition hover:text-blue-600 ${isActive ? "text-blue-600 font-bold underline" : "text-gray-700 font-medium"}  `}
                className="text-lg px-2 transition text-gray-700 font-medium hover:text-blue-600"
                activeProps={{
                  className: "!text-blue-600 font-bold underline",
                }}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-lg px-2 transition text-gray-700 font-medium hover:text-blue-600"
                activeProps={{
                  className: "!text-blue-600 font-bold underline",
                }}
              >
                Register
              </Link>
            </div>
          )}

          {isAuthenticated && (
            <div className="flex items-center space-x-6">
              <Link
                to="/dashboard"
                className="text-lg font-medium text-gray-700 hover:text-blue-600 transition"
              >
                Home
              </Link>
              <Link
                to="/analytic"
                className="text-lg font-medium text-gray-700 hover:text-blue-600 transition"
              >
                Analytics
              </Link>
              <button
                onClick={handleLogout}
                className="text-lg font-medium text-red-600 hover:text-red-800 transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
