import axios from "axios";
import React, { useEffect, useState } from "react";
import { useContractRead } from "wagmi";
import { Modal } from "@/components/ui/Modal";
import { ERC721ABI, NFT_CONTRACT_ADDRESS } from "@/components/constants";
import { useAppSelector } from "@/GlobalRedux/store";
interface ListedNftsProps {
  projectID: number;
}

interface NFTData {
  image: string;
  name: string;
  description: string;
  nftTokenId: string;
}

const OwnedListedNfts: React.FC<ListedNftsProps> = ({ projectID }) => {
  const address = useAppSelector(
    (state) => state.smartAccountReducer.value.Accountaddress
  );
  const [nftData, setNftData] = useState<NFTData | null>(null); // Use NFTData type for nftData initially

  const { data, error } = useContractRead({
    address: NFT_CONTRACT_ADDRESS,
    abi: ERC721ABI,
    functionName: "tokenURI",
    args: [projectID ? projectID.toString() : ""],
  });

  const {
    data: Ownerof,
    isError,
    error: projectIderor,
  } = useContractRead({
    address: NFT_CONTRACT_ADDRESS,
    abi: ERC721ABI,
    functionName: "ownerOf",
    args: [projectID ? projectID.toString() : ""],
  });

  const ownerString: string = Ownerof as string;

  useEffect(() => {
    if (!isError && Ownerof) {
      // Check if Ownerof is not undefined or null
      const ownerLowercase = ownerString.toLowerCase(); // Convert to lowercase
      if (ownerLowercase === address.toLowerCase()) {
        if (data) {
          axios
            .get(data ? data.toString() : "")
            .then((response) => {
              const currentData = response.data;
              const updateNftData = {
                ...currentData,
                nftTokenId: projectID,
              };
              setNftData(updateNftData);
            })
            .catch((error) => {
              console.error("Error fetching data:", error);
            });
        }
      }
    }
  }, [data, projectID]);

  return (
    <>
      {nftData && (
        <div className="flex flex-col justify-center items-center m-4">
          <div className="!z-5 relative rounded-[20px] max-w-[500px] max-h-[500px] bg-clip-border shadow-3xl shadow-shadow-500 flex flex-col w-full !p-4 3xl:p-![18px] bg-white outline-dashed undefined group">
            <div className="h-full w-full">
              <div className="relative w-full">
                <img
                  src={nftData ? nftData?.image : "Loading..."}
                  className="mb-3 h-40 w-full rounded-xl 3xl:h-full 3xl:w-full"
                  alt=""
                />
              </div>
              <div className="mb-3 flex items-center justify-between px-1 md:items-start">
                <div className="mb-2">
                  <p className="text-lg font-bold text-navy-700">
                    {nftData ? nftData?.name : "Loading..."}
                  </p>
                  <p className="text-lg mt-1 font-medium text-gray-600 md:mt-2">
                    {nftData ? nftData?.description : "Loading..."}
                  </p>
                  <p className="mt-1 text-sm font-medium text-gray-600 md:mt-2">
                    By You
                  </p>
                </div>
                <div className="group-hover:text-purple-400 bg-slate-300 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                  {address}
                </div>
              </div>
              <div className="flex items-center justify-between md:items-center lg:justify-between ">
                <Modal tokenId={nftData ? nftData?.nftTokenId : "Loading..."} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OwnedListedNfts;
