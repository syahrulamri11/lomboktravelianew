"use client";
import { Card, ListboxItem } from "@nextui-org/react";
import { Listbox } from "@nextui-org/react";

const Layout = ({ children }) => {
  const handleLogout = async (event) => {
    event.preventDefault();
    const response = await fetch(`/api/logout`, {
      method: "POST",
    });
    if (response.ok) {
      location.reload();
    }
  };
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between max-w-screen-xl mx-auto gap-4 p-4 min-h-screen">
      <div className="sm:w-1/4">
        <Card className="sticky top-20 p-2">
          <Listbox aria-label="Actions">
            <ListboxItem key="account" href="/settings/account">
              Account
            </ListboxItem>
            {/* <ListboxItem key="copy">Orders</ListboxItem>
            <ListboxItem key="copy">Favorites</ListboxItem>
            <ListboxItem key="copy">Reviews</ListboxItem> */}
            <ListboxItem
              key="logout"
              className="text-danger"
              color="danger"
              onClick={handleLogout}
            >
              Logout
            </ListboxItem>
          </Listbox>
        </Card>
      </div>
      <div className="sm:w-3/4">{children}</div>
    </div>
  );
};

export default Layout;
