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

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

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
        <NavbarItem>
          <Link href="/" legacyBehavior>
            <a className="text-gray-600 hover:text-green-600">Home</a>
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/paket-tour" legacyBehavior>
            <a className="text-gray-600 hover:text-green-600">Paket Tour</a>
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/destinasi" legacyBehavior>
            <a className="text-gray-600 hover:text-green-600">Destinasi</a>
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/gallery" legacyBehavior>
            <a className="text-gray-600 hover:text-green-600">Gallery</a>
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/contact-us" legacyBehavior>
            <a className="text-gray-600 hover:text-green-600">Contact Us</a>
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/login" legacyBehavior>
            <a className="bg-green-600 text-white px-4 py-2 rounded">Login</a>
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="md:hidden" justify="end">
        <NavbarItem>
          <Link href="/login" legacyBehavior>
            <a className="bg-green-600 text-white px-4 py-2 rounded">Login</a>
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu>
        <NavbarMenuItem>
          <Link href="/home" legacyBehavior>
            <a className="text-gray-600 hover:text-green-600">Home</a>
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link href="/paket-tour" legacyBehavior>
            <a className="text-gray-600 hover:text-green-600">Paket Tour</a>
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link href="/destinasi" legacyBehavior>
            <a className="text-gray-600 hover:text-green-600">Destinasi</a>
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link href="/gallery" legacyBehavior>
            <a className="text-gray-600 hover:text-green-600">Gallery</a>
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link href="/contact-us" legacyBehavior>
            <a className="text-gray-600 hover:text-green-600">Contact Us</a>
          </Link>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
};

export default Header;
