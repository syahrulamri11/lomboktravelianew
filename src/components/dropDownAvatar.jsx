import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";

export const DropDownAvatar = ({ user }) => {
  const handleLogout = async (event) => {
    event.preventDefault();
    await fetch('/api/logout', { method: 'POST' });
    location.reload(); //Redirect ke home setelah logout
  };


  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Avatar
          isBordered
          as="button"
          className="transition-transform"
          color="success"
          name={user?.nama}
          size="sm"
          src={user?.picture_url || "https://via.placeholder.com/300x300"}
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="Profile Actions" variant="flat">
        <DropdownItem key="profile" className="h-14 gap-2">
          <p className="font-semibold">Signed in as</p>
          <p className="font-semibold">{user?.email}</p>
        </DropdownItem>
        <DropdownItem key="settings" href="/settings">
          Settings
        </DropdownItem>
        <DropdownItem key="logout" color="danger" onClick={handleLogout}>
          Log Out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};