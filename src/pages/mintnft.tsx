import { NFT_CONTRACT_ADDRESS, ERC721ABI } from "@/components/constants";
import { BiconomySmartAccount, SmartAccount } from "@biconomy/account";
import { createPublicClient, http, webSocket } from "viem";
import { polygonMumbai } from "viem/chains";
import { ChangeEvent, Fragment, useEffect, useRef, useState } from "react";
import { MintModal } from "@/components/ui/MintModal";
import { useDispatch } from "react-redux";
import { AppDispatch, useAppSelector } from "@/GlobalRedux/store";
import { login } from "@/GlobalRedux/Features/smartAccountslice";
import PagesModal from "@/components/ui/PageModal";

const transport = webSocket(
  "wss://polygon-mumbai.g.alchemy.com/v2/Mh7MEm0SLywtlNh1_bcuroflDlQ3wYpu"
);

export const publicClient = createPublicClient({
  chain: polygonMumbai,
  transport,
});

const MintNft = () => {
  const smartAccount = useAppSelector(
    (state) => state.smartReducer.value.smartAccount
  );
  const dispatch = useDispatch<AppDispatch>();
  const [isImageSelected, setIsImageSelected] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  //showing user Selected Image
  const [selectedImage, setSelectedImage] = useState<File | null>(); // To store the selected image URL
  //storing input data
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  //IMAGE nft name
  const [getNftDetails, setNftDetails] = useState({
    NftName: "",
    Description: "",
  });
  const [data, setData] = useState<string | undefined>("");
  const [smartContractAddress, setSmartContractAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function getContractAddress() {
    if (
      smartAccount &&
      typeof smartAccount.getSmartAccountAddress === "function"
    ) {
      const smartContractAddress = await smartAccount.getSmartAccountAddress();
      setSmartContractAddress(smartContractAddress);
      localStorage.setItem("address", smartContractAddress);
      dispatch(login(smartContractAddress));
    } else {
      // Handle the case where smartAccount or getSmartAccountAddress is undefined
      console.error(
        "Smart account or getSmartAccountAddress function is not available."
      );
    }
  }

  async function getBalance() {
    if (!smartContractAddress) {
      // Handle the case where smartContractAddress is invalid
      return;
    }

    const data = await publicClient.readContract({
      address: NFT_CONTRACT_ADDRESS,
      abi: ERC721ABI,
      functionName: "balanceOf",
      args: [localStorage.getItem("address")],
    });

    if (!data) {
      return;
    }
    setData(data?.toString());
  }

  useEffect(() => {
    getBalance();
  });
  // // Function to handle removing the selected image
  const handleRemoveImage = () => {
    setSelectedImage(null);
    setIsImageSelected(false);
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file = e.target.files && e.target.files[0];
    if (file) {
      // Set the selected image to the file object
      setSelectedImage(file);
      setIsImageSelected(true);
    } else {
      setSelectedImage(null);
      setIsImageSelected(false);
      console.error("No file selected or invalid file type.");
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setNftDetails({
      ...getNftDetails,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    // Check if both fields are filled
    setIsFormValid(
      getNftDetails.NftName.trim() !== "" &&
        getNftDetails.Description.trim() !== "" &&
        isImageSelected
    );
  }, [getNftDetails, isImageSelected]);

  // Get the address of the smart account when the component loads
  useEffect(() => {
    getContractAddress();
  }, []);

  return (
    <Fragment>
      <div>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <main className="flex justify-center flex-col items-center mt-16">
            <form
              className="flex flex-col justify-center items-center border-dashed h-18 w-30 cursor-pointer rounded-sm border-cyan-700"
              onSubmit={(e) => {
                e.preventDefault();
              }}
              onClick={() => {
                fileInputRef.current?.click();
              }}
            >
              <div
                style={{
                  width: "500px",
                  height: "300px",
                  borderWidth: "2px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div className="image-container border-dashed border-black">
                  {selectedImage && (
                    <div className="flex justify-center flex-col items-center">
                      <img
                        src={URL.createObjectURL(selectedImage)}
                        alt="Selected"
                        className="selected-image"
                        style={{ maxWidth: "500px", maxHeight: "250px" }} // Adjust the size as needed
                      />
                      <button
                        className="bg-red-500 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded-full"
                        onClick={handleRemoveImage}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
                {!selectedImage && (
                  <div className="font-extrabold flex justify-center flex-col">
                    <input
                      type="file"
                      className="input-field"
                      hidden
                      ref={fileInputRef}
                      onChange={handleFileInputChange}
                      accept="image"
                    />
                    <button className="text-black ">
                      Browse Files To Upload
                    </button>
                    <p className="text-black ">Upload Only PNG files</p>
                  </div>
                )}
              </div>
            </form>
            <br></br>
            <br></br>
            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/3">
                <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                  NFT Name
                </label>
              </div>
              <div className="md:w-2/3">
                <input
                  type="text"
                  onChange={handleChange}
                  value={getNftDetails.NftName}
                  name="NftName"
                  placeholder="insert NFT name"
                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 mr-2"
                  required
                />
              </div>
            </div>
            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/3">
                <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                  NFT Description
                </label>
              </div>
              <div className="md:w-2/3">
                <input
                  onChange={handleChange}
                  value={getNftDetails.Description}
                  name="Description"
                  className="bg-gray-200 appearance-none border-2 bisErrororder-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  type="text"
                  placeholder="Description"
                  required
                />
              </div>
            </div>
            <MintModal
              setNftDetails={setNftDetails}
              setSelectedImage={setSelectedImage}
              isFormValid={isFormValid}
              getNftDetails={getNftDetails}
              selectedImage={selectedImage}
              smartAccount={smartAccount}
              smartContractAddress={smartContractAddress}
            />
          </main>
        )}
      </div>
    </Fragment>
  );
};

export default MintNft;
