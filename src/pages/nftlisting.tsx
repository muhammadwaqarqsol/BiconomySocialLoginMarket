import React, { useEffect } from "react";
import  ListedNfts from "./web3/listednfts";
import { NFT_CONTRACT_ADDRESS, ERC721ABI } from "@/components/constants";
import { useContractRead } from "wagmi";
const NftListing = () => {
  const isConnected = true;
  const { data } = useContractRead({
    address: NFT_CONTRACT_ADDRESS,
    abi: ERC721ABI,
    functionName: "_tokenIds",
  });

  useEffect(() => {
    console.log("Data", Number(data));
  });
  const totaltokens = Number(data);

  if (!totaltokens) {
    return (
      <>
        {isConnected ? (
          <div className="justify-center items-center flex flex-col">
            <img src="error.png" />
            <p className="text-3xl font-bold italic text-purple-500">
              Nothing to show
            </p>
          </div>
        ) : (
          <p className="justify-center items-center text-5xl flex flex-col text-purple-500">
            Connect First
          </p>
        )}
      </>
    );
  }

  return (
    <div>
      {isConnected ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-5">
          {Array.from(Array(totaltokens).keys()).map((i) => {
            return <ListedNfts projectID={i + 1} />;
          })}
        </div>
      ) : (
        <div className="flex justify-center items-center text-2xl text-red-500 rounded-lg">
          Connect wallet First
        </div>
      )}
    </div>
  );
};

export default NftListing;
