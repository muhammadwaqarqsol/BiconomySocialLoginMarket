import Link from "next/link";
import React, { useState } from "react";

interface PageModal {
  isOpen: boolean;
}

const PagesModal: React.FC<PageModal> = ({ isOpen }: PageModal) => {
  return (
    isOpen && (
      <div className="absolute ml-16 mt-14 w-36 h-20">
        <div className="bg-gray-300  rounded-xl">
          <ul className="flex flex-col justify-center items-center">
            <li className="underline">
              <Link href="/mynfts">Mint NFT</Link>
            </li>
            <li className="underline">My NFTs</li>
            <li className="underline">Listed NFTs</li>
          </ul>
        </div>
      </div>
    )
  );
};
export default PagesModal;
