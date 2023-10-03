import { ERC721ABI, NFT_CONTRACT_ADDRESS } from "@/components/constants";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useContractRead } from "wagmi";
interface ListedNftsProps {
  projectID: number;
  // projectID?: React.Reac/tNode; // Change the type of projectID to match your data type
}

interface NFTData {
  image: string;
  name: string;
  description: string;
  // Add more properties if needed
}
const ListedNfts: React.FC<ListedNftsProps> = ({ projectID }) => {
  const [nftData, setNftData] = useState<NFTData | null>(null); // Use NFTData type for nftData initially

  const { data, isError, error } = useContractRead({
    address: NFT_CONTRACT_ADDRESS,
    abi: ERC721ABI,
    functionName: "tokenURI",
    args: [projectID ? projectID.toString() : ""],
  });

  const { data: Ownerof, error: projectIderor } = useContractRead({
    address: NFT_CONTRACT_ADDRESS,
    abi: ERC721ABI,
    functionName: "ownerOf",
    args: [projectID ? projectID.toString() : ""],
  });

  useEffect(() => {
    // if
    if (!isError) {
      if (data) {
        // Make an Axios GET request to the data URL and update the state with the fetched data
        axios
          .get(data ? data?.toString() : "")
          .then((response) => {
            console.log("Response", response);
            setNftData(response.data);
          })
          .catch((error) => {
            console.log("Data .. ", data);
            console.error("Error fetching data:", error);
          });
      }
    } else {
      setNftData(null);
    }
  }, [data]);

  useEffect(() => {
    console.log("NFT : ", nftData);
  }, [nftData]);

  return (
    <>
      {nftData !== null && (
        <div className="flex flex-col justify-center items-center m-4">
          <div className="!z-5 relative rounded-[20px] max-w-[500px] max-h-[500px] bg-clip-border shadow-3xl shadow-shadow-500 flex flex-col w-full !p-4 3xl:p-![18px] bg-white outline-dashed undefined">
            <div className="h-full w-full">
              <div className="relative w-full">
                <img
                  src={nftData ? nftData?.image : "Loading..."}
                  className="mb-3 h-40 w-full rounded-xl 3xl:h-full 3xl:w-full "
                  alt=""
                />
              </div>
              <div className="mb-3 flex items-center justify-between px-1 md:items-start">
                <div className="mb-2">
                  <p className="text-lg font-bold text-navy-700">
                    {" "}
                    {nftData ? nftData?.name : "Loading..."}{" "}
                  </p>
                  <p className="text-lg mt-1 font-medium text-gray-600 md:mt-2">
                    {nftData ? nftData?.description : "Loading..."}
                  </p>
                  <p className="mt-1 text-sm font-medium text-gray-600 md:mt-2 ">
                    Owned By{" "}
                    {Ownerof ? Ownerof?.toString().slice(0, 8) : "Loading.."}...
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ListedNfts;
