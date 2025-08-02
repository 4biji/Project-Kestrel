
"use client";

import { Button } from "./ui/button";
import { Plus } from "lucide-react";

export function FirstAidButton() {
  const openFirstAidLink = () => {
    window.open("https://www.themodernapprentice.com/first_aid.htm", "_blank", "noopener,noreferrer");
  };

  return (
    <Button
      variant="destructive"
      className="h-full w-full aspect-square flex flex-col items-center justify-center text-lg space-y-2 bg-red-600 hover:bg-red-700"
      onClick={openFirstAidLink}
    >
      <div className="relative w-12 h-12">
        <div className="absolute top-1/2 left-0 w-full h-2 bg-white -translate-y-1/2 rounded-full"></div>
        <div className="absolute top-0 left-1/2 w-2 h-full bg-white -translate-x-1/2 rounded-full"></div>
      </div>
      <span className="font-bold">First Aid</span>
    </Button>
  );
}
