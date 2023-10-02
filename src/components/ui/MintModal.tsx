import React, { useState, Fragment, useEffect } from "react";
import ImageUploader from "../../utils/ImageUploader";
import metaData from "../../utils/Metadata";
import { BiconomySmartAccount, SmartAccount } from "@biconomy/account";
import { ethers } from "ethers";
import { NFT_CONTRACT_ADDRESS, ERC721ABI } from "@/components/constants";
import {
  IHybridPaymaster,
  PaymasterMode,
  SponsorUserOperationDto,
} from "@biconomy/paymaster";
import Link from "next/link";
import { useAppSelector } from "@/GlobalRedux/store";

interface MintModalProps {
  selectedImage: File | null | undefined;
  getNftDetails: {
    NftName: string;
    Description: string;
  };
  isFormValid: boolean;
  setSelectedImage: React.Dispatch<
    React.SetStateAction<File | null | undefined>
  >;
  setNftDetails: React.Dispatch<
    React.SetStateAction<{ NftName: string; Description: string }>
  >;
  smartAccount: BiconomySmartAccount;
  smartContractAddress: String;
}

export const MintModal: React.FC<MintModalProps> = ({
  getNftDetails,
  selectedImage,
  isFormValid,
  setNftDetails,
  setSelectedImage,
  smartAccount,
  smartContractAddress,
}: MintModalProps) => {
  const useraddress = useAppSelector(
    (state) => state.smartAccountReducer.value.smartAccountaddress
  );
  const [showModal, setShowModal] = useState(false);
  const [isError, setError] = useState(false);
  const [MetadataStatus, setMetadataStatus] = useState(false);
  const [ImageStatus, setImageStatus] = useState(false);
  const [Mintstatus, setMintstatus] = useState<boolean>(false);
  const [tokenUri, setTokenUri] = useState<string>("");

  const handleUpload = async () => {
    const uploadImages = await ImageUploader(
      selectedImage,
      getNftDetails.NftName
    );
    if (uploadImages?.status === 200) {
      setImageStatus(true);
    }
    const metadatares = await metaData(
      getNftDetails.NftName,
      getNftDetails.Description,
      uploadImages?.IpfshashImage
    );
    if (metadatares?.status === 200) {
      setMetadataStatus(true);
    }
    let TokenUri = `https://ipfs.io/ipfs/${metadatares?.IpfsHash}`;
    setTokenUri(TokenUri);
  };

  // const handleMint = async () => {
  //   setMintstatus(false);
  //   const contract = new ethers.Contract(
  //     NFT_CONTRACT_ADDRESS,
  //     ERC721ABI,
  //     smartAccount.provider
  //   );
  //   try {
  //     const minTx = await contract.populateTransaction.createToken(
  //       smartContractAddress,
  //       tokenUri
  //     );
  //     console.log(minTx.data);
  //     const tx1 = {
  //       to: NFT_CONTRACT_ADDRESS,
  //       data: minTx.data,
  //     };
  //     console.log("here before userop");
  //     let userOp = await smartAccount.buildUserOp([tx1]);
  //     console.log("USER OPERATION CONSOLE", { userOp });

  //     const biconomyPaymaster =
  //       smartAccount.paymaster as IHybridPaymaster<SponsorUserOperationDto>;
  //     console.log(biconomyPaymaster);
  //     console.log(smartAccount);
  //     let paymasterServiceData: SponsorUserOperationDto = {
  //       mode: PaymasterMode.SPONSORED,
  //       calculateGasLimits: true,
  //     };
  //     console.log("Paymaster", biconomyPaymaster);
  //     const paymasterAndDataResponse =
  //       await biconomyPaymaster.getPaymasterAndData(
  //         userOp,
  //         paymasterServiceData
  //       );

  //     console.log("response paymaster", paymasterAndDataResponse);

  //     userOp.paymasterAndData = paymasterAndDataResponse.paymasterAndData;
  //     console.log("useropcondirmed");
  //     const userOpResponse = await smartAccount.sendUserOp(userOp);
  //     console.log("Just a debug check");
  //     console.log("userOpHash", userOpResponse);

  //     // Wait for the transaction to be mined and get the receipt
  //     const { receipt } = await userOpResponse.wait(1);
  //     console.log("txHash", receipt.transactionHash);

  //     // Check if the receipt is available and then set mintstatus to false
  //     if (userOpResponse) {
  //       setMintstatus(true);
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     console.log(err);
  //     setError(true);
  //     setMintstatus(false); // Set mintstatus to false in case of an error
  //   }
  // };

  // async function handleUpload() {
  //   try {
  //     console.log("smart Account in add nft: ", smartAccount);

  //     // Create an Ethers Contract instance for USDC
  //     const readProvider = smartAccount.provider;
  //     console.log("READ Provider : ", readProvider);
  //     // make contract instance
  //     const nftContract = new ethers.Contract(
  //       NFT_CONTRACT_ADDRESS,
  //       ERC721ABI,
  //       readProvider
  //     );

  //     // Create the calldata for our UserOperation
  //     const populatedTransferTxn =
  //       await nftContract.populateTransaction.createToken(
  //         smartContractAddress,
  //         tokenUri
  //       );

  //     console.log("Populate :: ", populatedTransferTxn.data);
  //     const calldata = populatedTransferTxn.data;
  //     // Build the UserOperation
  //     const userOp = await smartAccount.buildUserOp([
  //       {
  //         to: NFT_CONTRACT_ADDRESS,
  //         data: calldata,
  //       },
  //     ]);

  //     console.log("USER OP : ", userOp);

  //     // Get the paymaster fee quote from Biconomy
  //     const biconomyPaymaster =
  //       smartAccount.paymaster as IHybridPaymaster<SponsorUserOperationDto>;

  //     let paymasterServiceData: SponsorUserOperationDto = {
  //       mode: PaymasterMode.SPONSORED,
  //     };
  //     console.log("Check Payment service..", paymasterServiceData);
  //     const paymasterAndDataResponse =
  //       await biconomyPaymaster.getPaymasterAndData(
  //         userOp,
  //         paymasterServiceData
  //       );

  //     userOp.paymasterAndData = paymasterAndDataResponse.paymasterAndData;
  //     console.log("check...", paymasterAndDataResponse);

  //     const userOpResponse = await smartAccount.sendUserOp(userOp);
  //     console.log("userOpHash", userOpResponse);
  //     const { receipt } = await userOpResponse.wait(1);
  //     console.log("txHash..", receipt);
  //     console.log(Number(receipt.logs[2]?.data), "HEX TO decimal");
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  const handleMint = async () => {
    setMintstatus(false);
    console.log("smart Account in add nft: ", smartAccount);
    const readProvider = smartAccount.provider;
    const contract = new ethers.Contract(
      NFT_CONTRACT_ADDRESS,
      ERC721ABI,
      readProvider
    );
    try {
      const populatedTxn = await contract.populateTransaction.createToken(
        smartContractAddress,
        tokenUri
      );

      const calldata = populatedTxn.data;
      const tx1 = {
        to: NFT_CONTRACT_ADDRESS,
        data: calldata,
      };

      console.log("here before userop");
      let userOp = await smartAccount.buildUserOp([tx1]);
      console.log("userop", { userOp });
      const biconomyPaymaster =
        smartAccount.paymaster as IHybridPaymaster<SponsorUserOperationDto>;
      console.log(biconomyPaymaster);
      console.log(smartAccount);
      let paymasterServiceData: SponsorUserOperationDto = {
        mode: PaymasterMode.SPONSORED,
      };
      console.log("Hello");
      const paymasterAndDataResponse =
        await biconomyPaymaster.getPaymasterAndData(
          userOp,
          paymasterServiceData
        );
      console.log("Hello2");

      userOp.paymasterAndData = paymasterAndDataResponse.paymasterAndData;
      console.log("Hello3");
      const userOpResponse = await smartAccount.sendUserOp(userOp);
      console.log("Hello4");
      console.log("userOpHash", userOpResponse);
      const { receipt } = await userOpResponse.wait(1);
      console.log("txHash", receipt.transactionHash);
      if (userOpResponse) {
        setMintstatus(true);
      }
    } catch (err) {
      console.error(err);
      console.log(err);
      setMintstatus(false);
    }
  };

  function cancelAll() {
    setShowModal(false);
    setTokenUri("");
    setMintstatus(false);
    setMetadataStatus(false);
    setImageStatus(false);
    setSelectedImage(null);
    setError(false);
    setNftDetails({ NftName: "", Description: "" });
  }

  useEffect(() => {
    const modalTimeout = setTimeout(() => {
      setShowModal(false);
      setTokenUri("");
      setMintstatus(false);
      setMetadataStatus(false);
      setImageStatus(false);
      setSelectedImage(null);
      setNftDetails({ NftName: "", Description: "" });
    }, 3000);
  }, [Mintstatus === false]);

  useEffect(() => {
    if (tokenUri !== "" && Mintstatus === false) {
      handleMint();
    }
  }, [tokenUri, Mintstatus]);

  return (
    <Fragment>
      {useraddress ? (
        <button
          disabled={!isFormValid || showModal}
          className="bg-purple-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg disabled:bg-slate-200"
          type="button"
          onClick={() => {
            setShowModal(true);
            handleUpload();
          }}
        >
          Mint NFT
        </button>
      ) : (
        <></>
      )}
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div>
              {/*content*/}
              <div className="p-10 border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-center justify-center p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-3xl font-semibold">Minting Process</h3>
                </div>
                {/*body*/}
                <div className="flex flex-col">
                  <div className="flex flex-row justify-center items-center">
                    {ImageStatus ? (
                      <>
                        {" "}
                        <div className="flex flex-row justify-center items-center">
                          <img src="svgtick.svg" className="h-8" />
                          <p className="text-green-400  hover:cursor-default focus:outline-nonefont-medium rounded text-sm px-5 py-2.5 text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center">
                            Success
                          </p>
                        </div>
                        <div>Uploading Image to Ipfs Done!.</div>
                      </>
                    ) : (
                      <>
                        <div className="flex flex-row justify-center items-center">
                          <svg
                            aria-hidden="true"
                            role="status"
                            className="inline mr-3 w-4 h-4 text-white animate-spin"
                            viewBox="0 0 100 101"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                              fill="#E5E7EB"
                            ></path>
                            <path
                              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                              fill="currentColor"
                            ></path>
                          </svg>
                          <p className="text-black  hover:cursor-default focus:outline-nonefont-medium rounded text-sm px-5 py-2.5 text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center">
                            Loading...
                          </p>
                        </div>
                        <div>Uploading Image to Ipfs</div>
                      </>
                    )}
                  </div>
                  <div className="flex flex-row justify-center items-center">
                    {MetadataStatus ? (
                      <>
                        {" "}
                        <div className="flex flex-row justify-center items-center">
                          <img src="svgtick.svg" className="h-8" />
                          <p className="text-green-400  hover:cursor-default focus:outline-nonefont-medium rounded text-sm px-5 py-2.5 text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center">
                            Success
                          </p>
                        </div>
                        <div>Uploading MetaData to Ipfs Done!.</div>
                      </>
                    ) : (
                      <>
                        <div className="flex flex-row justify-center items-center">
                          <svg
                            aria-hidden="true"
                            role="status"
                            className="inline mr-3 w-4 h-4 text-white animate-spin"
                            viewBox="0 0 100 101"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                              fill="#E5E7EB"
                            ></path>
                            <path
                              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                              fill="currentColor"
                            ></path>
                          </svg>
                          <p className="text-black  hover:cursor-default focus:outline-nonefont-medium rounded text-sm px-5 py-2.5 text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center">
                            Loading...
                          </p>
                        </div>
                        <div>Uploading MetaData to Ipfs</div>
                      </>
                    )}
                  </div>

                  <div className="flex flex-row justify-center items-center">
                    {isError ? (
                      <>
                        <div className="flex flex-row justify-center items-center">
                          <img src="cancel.svg" className="h-8" />
                          <p className="text-red-400  hover:cursor-default focus:outline-nonefont-medium rounded text-sm px-5 py-2.5 text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center">
                            Erro on Transaction
                          </p>
                        </div>
                        <div>
                          "Something went wrong sorry for inconvenience!"
                        </div>
                      </>
                    ) : Mintstatus ? (
                      <>
                        {" "}
                        <div className="flex flex-row justify-center items-center">
                          <img src="svgtick.svg" className="h-8" />
                          <p className="text-green-400  hover:cursor-default focus:outline-nonefont-medium rounded text-sm px-5 py-2.5 text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center">
                            Success
                          </p>
                        </div>
                        <div>Transaction Confirm Check Your NFT!.</div>
                      </>
                    ) : (
                      <>
                        <div className="flex flex-row justify-center items-center">
                          <svg
                            aria-hidden="true"
                            role="status"
                            className="inline mr-3 w-4 h-4 text-white animate-spin"
                            viewBox="0 0 100 101"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                              fill="#E5E7EB"
                            ></path>
                            <path
                              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                              fill="currentColor"
                            ></path>
                          </svg>
                          <p className="text-black  hover:cursor-default focus:outline-nonefont-medium rounded text-sm px-5 py-2.5 text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center">
                            Loading...
                          </p>
                        </div>
                        <div>Minting NFT for You Wait!.</div>
                      </>
                    )}
                  </div>

                  {Mintstatus && MetadataStatus && ImageStatus && (
                    <div className="flex justify-center items-center">
                      <Link href="/mynfts" className="text-blue-300 underline">
                        Go to My NFT
                      </Link>
                    </div>
                  )}
                  {isError && (
                    <div className="flex justify-center items-center">
                      <button
                        className="bg-red-500 hover:bg-red-200 text-white font-bold py-2 px-4 rounded-lg disabled:bg-slate-200"
                        onClick={cancelAll}
                      >
                        Close
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </Fragment>
  );
};
