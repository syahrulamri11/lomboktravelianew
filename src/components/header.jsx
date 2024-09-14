"use client";
import Link from "next/link";
import React from "react";
import {
  Navbar,
  NavbarMenuToggle,
  NavbarMenuItem,
  NavbarMenu,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";
import { UserContext } from "@/utils/userContext";
import { useContext } from "react";
import { usePathname } from "next/navigation";
import { DropDownAvatar } from "./dropDownAvatar";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [currentUser, setCurrentUser] = useContext(UserContext);
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/paket-tour", label: "Paket Tour" },
    { href: "/destinasi", label: "Destinasi" },
    { href: "/gallery", label: "Gallery" },
    { href: "/contact-us", label: "Contact Us" },
  ];

  if (currentUser?.role === "admin") {
    navItems.push({ href: "/admin/dashboard", label: "Admin" });
  }

  return (
    <Navbar
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      maxWidth="2xl"
      className="bg-white shadow-md text-black"
    >
      <NavbarContent className="md:hidden" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        />
      </NavbarContent>

      <NavbarContent>
        <NavbarItem>
          <Link href="/" legacyBehavior>
            <a className="text-xl sm:text-2xl font-bold text-green-600">
              Lombok Travelia
            </a>
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="hidden md:flex gap-4" justify="end">
        {navItems.map((item) => (
          <NavbarItem key={item.href}>
            <Link href={item.href} legacyBehavior>
              <a
                className={`${
                  pathname === item.href
                    ? "text-green-600"
                    : "text-gray-600 hover:text-green-600"
                }`}
              >
                {item.label}
              </a>
            </Link>
          </NavbarItem>
        ))}
        <NavbarItem>
          {currentUser ? (
            <DropDownAvatar user={currentUser} />
          ) : (
            <Link href="/login" legacyBehavior>
              <a className="bg-green-600 text-white px-4 py-2 rounded">Login</a>
            </Link>
          )}
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="md:hidden" justify="end">
        <NavbarItem>
          {currentUser ? (
            <DropDownAvatar user={currentUser} />
          ) : (
            <Link href="/login" legacyBehavior>
              <a className="bg-green-600 text-white px-4 py-2 rounded">Login</a>
            </Link>
          )}
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu>
        {navItems.map((item) => (
          <NavbarMenuItem key={item.href}>
            <Link href={item.href} legacyBehavior>
              <a
                className={`${
                  pathname === item.href
                    ? "text-green-600"
                    : "text-gray-600 hover:text-green-600"
                }`}
              >
                {item.label}
              </a>
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
};

export default Header;
