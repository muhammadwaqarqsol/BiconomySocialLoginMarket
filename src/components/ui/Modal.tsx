import React, { ChangeEvent, useState, useEffect } from "react";
import { isAddress } from "viem";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ERC721ABI, NFT_CONTRACT_ADDRESS } from "../constants";
import { ethers } from "ethers";
import {
  IHybridPaymaster,
  PaymasterMode,
  SponsorUserOperationDto,
} from "@biconomy/paymaster";
import { useAppSelector } from "@/GlobalRedux/store";
interface nftData {
  tokenId: string; // Change the type of projectID to match your data type
}
export const Modal: React.FC<nftData> = ({ tokenId }) => {
  const smartAccount = useAppSelector(
    (state) => state.smartReducer.value.smartAccount
  );
  const address = useAppSelector(
    (state) => state.smartAccountReducer.value.smartAccountaddress
  );
  const [showModal, setShowModal] = useState(false);
  const [showaddress, setAddress] = useState("");
  const [error, setError] = useState(false);
  const [status, setStatus] = useState(false);

  const handletransfer = async () => {
    setStatus(true);
    console.log("smart Account in add nft: ", smartAccount);
    const readProvider = smartAccount.provider;
    const contract = new ethers.Contract(
      NFT_CONTRACT_ADDRESS,
      ERC721ABI,
      readProvider
    );
    try {
      const populatedTxn = await contract.populateTransaction.transferFrom(
        address,
        showaddress,
        tokenId
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
        setStatus(false);
      }
    } catch (err) {
      console.error(err);
      console.log(err);
      setStatus(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (isAddress(value)) {
      setAddress(e.target.value);
      console.log(showaddress);
      setError(false);
    } else {
      setError(true);
    }
  };

  useEffect(() => {
    if (status == true) {
      setStatus(false); //   setShowModal(false)
      setTimeout(() => {
        setShowModal(false);
      }, 3000); // 3000 milliseconds = 3 seconds
    }
  }, [status]);

  return (
    <>
      <button
        className="linear rounded-[20px] bg-gray-300 px-4 py-2 text-base font-medium text-black transition duration-200 hover:bg-green-200 active:bg-yellow-200"
        type="button"
        onClick={() => setShowModal(true)}
      >
        Transfer NFT
      </button>
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-sm">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-3xl font-semibold">NFT transfer</h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto flex justify-center items-center flex-col">
                  <div className="md:flex md:items-center mb-6">
                    <div className="md:w-1/3">
                      <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                        Recepient Address
                      </label>
                    </div>
                    <div className="md:w-2/3">
                      <input
                        onChange={handleChange}
                        name="Description"
                        className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                        type="text"
                        placeholder="Address"
                        required
                      />
                    </div>
                  </div>
                  {error ? (
                    <p className="text-red-400">Not an EVM address</p>
                  ) : (
                    <></>
                  )}
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="linear rounded-[20px] bg-red-400 px-4 py-2 text-base font-medium text-black transition duration-200 hover:bg-grey-200"
                    type="button"
                    disabled={status}
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                  <button
                    className="ml-5 linear rounded-[20px] bg-green-300 px-4 py-2 text-base font-medium text-black transition duration-200 hover:bg-green-200 active:bg-yellow-200"
                    type="button"
                    onClick={() => handletransfer()}
                    disabled={!status}
                  >
                    {status ? "Please Wait" : "confirm Transfer"}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        pauseOnFocusLoss
        pauseOnHover={false}
        theme="light"
      />
    </>
  );
};
