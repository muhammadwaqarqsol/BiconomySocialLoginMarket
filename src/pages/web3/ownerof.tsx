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

export const OwnedListedNfts: React.FC<ListedNftsProps> = ({ projectID }) => {
  const address = useAppSelector(
    (state) => state.smartAccountReducer.value.smartAccountaddress
  );
  const [nftData, setNftData] = useState<NFTData | null>(null); // Use NFTData type for nftData initially

  const { data, error } = useContractRead({
    address: NFT_CONTRACT_ADDRESS,
    abi: ERC721ABI,
    functionName: "tokenURI",
    args: [projectID.toString()],
  });

  const {
    data: Ownerof,
    isError,
    error: projectIderor,
  } = useContractRead({
    address: NFT_CONTRACT_ADDRESS,
    abi: ERC721ABI,
    functionName: "ownerOf",
    args: [projectID.toString()],
  });

  const ownerString: string = Ownerof as string;

  useEffect(() => {
    if (!isError) {
      console.log(typeof ownerString);
      console.log(typeof address);
      console.log(ownerString);
      console.log(address);
      ownerString.replace(/[^\w]/g, "");
      address.replace(/[^\w]/g, "");
      console.log(ownerString.trim() === address.trim());
      if (ownerString.toLowerCase() === address.toLowerCase()) {
        if (data) {
          axios
            .get(data?.toString())
            .then((response) => {
              const currentData = response.data;
              const updateNftData: any = {
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
  }, [data]);

  return (
    <>
      {nftData && (
        <div className="flex flex-col justify-center items-center m-4">
          <div className="!z-5 relative rounded-[20px] max-w-[500px] max-h-[500px] bg-clip-border shadow-3xl shadow-shadow-500 flex flex-col w-full !p-4 3xl:p-![18px] bg-white outline-dashed undefined">
            <div className="h-full w-full">
              <div className="relative w-full">
                <img
                  src={nftData?.image}
                  className="mb-3 h-40 w-full rounded-xl 3xl:h-full 3xl:w-full"
                  alt=""
                />
              </div>
              <div className="mb-3 flex items-center justify-between px-1 md:items-start">
                <div className="mb-2">
                  <p className="text-lg font-bold text-navy-700">
                    {" "}
                    {nftData?.name}{" "}
                  </p>
                  <p className="text-lg mt-1 font-medium text-gray-600 md:mt-2">
                    {nftData?.description}
                  </p>
                  <p className="mt-1 text-sm font-medium text-gray-600 md:mt-2">
                    By You
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between md:items-center lg:justify-between ">
                <Modal tokenId={nftData?.nftTokenId} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
