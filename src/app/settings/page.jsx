"use client";
import { Card } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { FaPersonDrowning } from "react-icons/fa6";

const Settings = () => {
  const router = useRouter();
  return (
    <Card className="p-4 h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <Card
          className="min-h-40 p-4 flex justify-center items-center"
          isPressable={true}
          onPress={() => {
            router.push("/settings/account");
          }}
        >
          <FaPersonDrowning />
          <p>Account Settings</p>
        </Card>
        {/* <Card className="min-h-40 p-4 flex justify-center items-center">
          <FaPersonDrowning />
          <p>Other Settings</p>
        </Card>
        <Card className="min-h-40 p-4 flex justify-center items-center">
          <FaPersonDrowning />
          <p>Different Settings</p>
        </Card> */}
      </div>
    </Card>
  );
};

export default Settings;
