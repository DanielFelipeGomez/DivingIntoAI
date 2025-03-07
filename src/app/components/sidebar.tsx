"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, FileSearch, TicketCheck, Bomb } from "lucide-react";

export default function Sidebar() {
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    {
      text: "Code Review",
      route: "/code",
      icon: <FileSearch className="h-5 w-5" />,
    },
    {
      text: "Tickets Dashboard",
      route: "/review",
      icon: <TicketCheck className="h-5 w-5" />,
    },
    {
      text: "Panic",
      route: "/panic",
      icon: <Bomb className="h-5 w-5" />,
    },
  ];

  return (
    <div
      className={cn(
        "border-r p-4 flex flex-col gap-3 transition-all duration-300 h-screen",
        isMenuCollapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex items-center gap-2 mb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMenuCollapsed(!isMenuCollapsed)}
        >
          <Menu className="w-6 h-6" />
        </Button>
        {!isMenuCollapsed && (
          <span className="font-semibold text-lg">DivingIntoAI</span>
        )}
      </div>

      {menuItems.map((item) => (
        <Button
          key={item.route}
          variant={
            pathname === item.route ||
            (item.route === "/review" && pathname === "/review")
              ? "default"
              : "ghost"
          }
          className={cn(
            "flex items-center gap-2 justify-start",
            isMenuCollapsed && "justify-center"
          )}
          onClick={() => router.push(item.route)}
        >
          {item.icon}
          {!isMenuCollapsed && <span>{item.text}</span>}
        </Button>
      ))}
    </div>
  );
}
