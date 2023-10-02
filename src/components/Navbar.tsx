import { useAppSelector } from "@/GlobalRedux/store";
import Link from "next/link";
import React, { useEffect } from "react";
import { ERC721ABI, NFT_CONTRACT_ADDRESS } from "./constants";
import { useContractRead } from "wagmi";
import { useRouter } from "next/router";
import { removeAccount } from "@/GlobalRedux/Features/smartslice";

const Navbar = () => {
  const router = useRouter();
  const address = useAppSelector(
    (state) => state.smartAccountReducer.value.smartAccountaddress
  );

  const smartAccount = useAppSelector(
    (state) => state.smartReducer.value.smartAccount
  );

  const sdkref = useAppSelector((state) => state.sdkRefReducer.value.sdkref);

  const { data, error } = useContractRead({
    address: NFT_CONTRACT_ADDRESS,
    abi: ERC721ABI,
    functionName: "balanceOf",
    args: [address],
  });

  async function logout() {
    await sdkref?.logout();
    sdkref?.hideWallet();
    removeAccount();
    window.localStorage.clear();
    await router.push("/");
    setTimeout(() => {
      router.reload();
    }, 500);
  }

  function copyAddress() {
    navigator.clipboard
      .writeText(address)
      .then(function () {
        alert("Address copied to clipboard: " + address);
      })
      .catch(function (err) {
        console.error("Unable to copy address: ", err);
      });
  }

  useEffect(() => {
    console.log(data);
    console.log(address);
  });
  if (!address && smartAccount) {
    return null;
  }

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
          <div>
            {address ? (
              <p className="text-xl justify-center items-center bg-purple-300 rounded-3xl p-2">
                Owned : {data?.toString()}
              </p>
            ) : null}
          </div>
          <div
            className="text-xl justify-center items-center bg-purple-300 rounded-3xl p-2"
            onClick={copyAddress}
          >
            Address {address.toString().slice(0, 8)}...
          </div>
          <div>
            <button
              onClick={logout}
              className=" right-0 m-3 rounded-lg bg-gradient-to-r from-green-400 to-blue-500 px-4 py-2 font-medium transition-all hover:from-green-500 hover:to-blue-600"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
