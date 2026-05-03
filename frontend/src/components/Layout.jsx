import { Link, NavLink, useNavigate } from "react-router-dom";
import { Plus, LogOut, User, LayoutDashboard, ShieldCheck, Search } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";

export const Header = ({ searchValue, onSearchChange }) => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((s) => s[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?";

  return (
    <header
      data-testid="app-header"
      className="sticky top-0 z-40 w-full bg-white border-b border-gray-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">
        <Link to="/" data-testid="nav-logo" className="flex items-center gap-2">
          <span className="font-heading text-2xl font-bold tracking-tight text-gray-900">
            hostel<span className="text-orange-500">Kart</span>
          </span>
        </Link>

        {onSearchChange && (
          <div className="hidden md:flex flex-1 max-w-xl ml-6">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                data-testid="header-search-input"
                value={searchValue || ""}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search books, cycles, furniture…"
                className="w-full h-10 pl-10 pr-3 rounded-md border border-gray-300 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>
        )}

        <div className="flex-1" />

        {user ? (
          <>
            <Button
              data-testid="nav-create-listing"
              onClick={() => navigate("/create")}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              <Plus className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Post Ad</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  data-testid="nav-user-menu-trigger"
                  className="rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <Avatar className="h-9 w-9 border border-gray-200">
                    <AvatarFallback className="bg-orange-100 text-orange-700 font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span data-testid="nav-user-name" className="font-medium text-gray-900">
                      {user.name}
                    </span>
                    <span className="text-xs text-gray-500">{user.email}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem data-testid="nav-dashboard-link" onClick={() => navigate("/dashboard")}>
                  <LayoutDashboard className="h-4 w-4 mr-2" /> Dashboard
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem data-testid="nav-admin-link" onClick={() => navigate("/admin")}>
                    <ShieldCheck className="h-4 w-4 mr-2" /> Admin Panel
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem data-testid="nav-logout" onClick={logout}>
                  <LogOut className="h-4 w-4 mr-2" /> Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <Button
              data-testid="nav-login-btn"
              variant="ghost"
              onClick={() => navigate("/login")}
              className="text-gray-700"
            >
              <User className="h-4 w-4 mr-1" /> Log in
            </Button>
            <Button
              data-testid="nav-signup-btn"
              onClick={() => navigate("/signup")}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              Sign up
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export const Layout = ({ children, searchValue, onSearchChange }) => (
  <div className="min-h-screen bg-white flex flex-col font-body text-gray-800">
    <Header searchValue={searchValue} onSearchChange={onSearchChange} />
    <main className="flex-1 w-full">{children}</main>
    <footer className="border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-500">
        <span>© {new Date().getFullYear()} hostelKart — by students, for students.</span>
        <span className="flex items-center gap-1">
          <NavLink to="/" className="hover:text-orange-500">Browse</NavLink>
          <span>·</span>
          <NavLink to="/dashboard" className="hover:text-orange-500">Dashboard</NavLink>
        </span>
      </div>
    </footer>
  </div>
);
