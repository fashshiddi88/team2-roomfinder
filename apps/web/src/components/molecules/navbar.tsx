"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "../atomics/logo";
import AuthButtons from "../atomics/auth-button";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = ["Find a Property", "Rental Guides", "Download Mobile App"];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Logo />

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-8">
            <div className="flex items-baseline space-x-8">
              {menuItems.map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  {item}
                </a>
              ))}
              <Button className="bg-gray-800 hover:bg-gray-700 text-white">
                Become a Tenant
              </Button>
            </div>
            <AuthButtons />
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
            {menuItems.map((item) => (
              <a
                key={item}
                href="#"
                className="block px-3 py-2 text-base font-medium text-gray-900 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
              >
                {item}
              </a>
            ))}
            <Button className="w-full mt-2 bg-gray-800 hover:bg-gray-700 text-white">
              Become a Tourist
            </Button>
            <div className="pt-3 border-t border-gray-200 mt-3">
              <div className="flex flex-col space-y-2">
                <a href="/login">
                  <Button variant="ghost" className="w-full justify-start">
                    Sign In
                  </Button>
                </a>
                <a href="/register">
                  <Button className="w-full">Sign Up</Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
