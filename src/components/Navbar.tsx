import { useAppSelector } from "@/GlobalRedux/store";
import Link from "next/link";
import React from "react";
import { ERC721ABI, NFT_CONTRACT_ADDRESS } from "./constants";
import { useContractRead } from "wagmi";

const Navbar = () => {
  const address = useAppSelector(
    (state) => state.smartAccountReducer.value.smartAccountaddress
  );
  const smartAccount = useAppSelector(
    (state) => state.smartReducer.value.smartAccount
  );

  const { data, error } = useContractRead({
    address: NFT_CONTRACT_ADDRESS,
    abi: ERC721ABI,
    functionName: "tokenURI",
    args: [address],
  });

  return (
    <header className="text-gray-600 body-font">
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        <nav className="md:mr-auto md:ml-4 md:py-1 md:pl-4  md:border-gray-400	flex flex-wrap items-center text-base justify-center">
          <a className="mr-5 hover:text-gray-900">
            <Link href="/mintnft">Mint Nft</Link>
          </a>
          <a className="mr-5 hover:text-gray-900">
            <Link href="/mynfts">My Nfts</Link>
          </a>
          <a className="mr-5 hover:text-gray-900">
            <Link href="/nftlisting">Listed Nfts</Link>
          </a>
        </nav>
        <div className="flex flex-row gap-6 justify-center items-center rounded-lg ">
          {/* <div>
            {smartAccount ? (
              <p className="text-xl justify-center items-center bg-purple-300 rounded-3xl p-2">
                Owned : {data?.toString()}
              </p>
            ) : null}
          </div> */}
          {/* <ConnectKitButton showBalance /> */}
        </div>
      </div>
    </header>
  );
};
export default Navbar;
