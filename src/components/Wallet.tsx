"use client";
import { useEffect, useRef, useState, Fragment } from "react";
import SocialLogin from "@biconomy/web3-auth";
import { ethers } from "ethers";
import { ChainId } from "@biconomy/core-types";
import {
  ERC721ABI,
  NFT_CONTRACT_ADDRESS,
  bundler,
  paymaster,
} from "./constants";
import MintNft from "./MintNft";
import {
  BiconomySmartAccount,
  BiconomySmartAccountConfig,
} from "@biconomy/account";
import { DEFAULT_ENTRYPOINT_ADDRESS } from "@biconomy/account";
import PagesModal from "./ui/PagesModal";

export default function Wallet() {
  const [isOpen, setIsOpen] = useState(false);
  const sdkRef = useRef<SocialLogin | null>(null);
  const [interval, enableInterval] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [, setProvider] = useState<ethers.providers.Web3Provider>();
  const [smartAccount, setSmartAccount] = useState<BiconomySmartAccount>();
  // login() function
  async function login() {
    console.log("Interval", interval);
    console.log("sdk", sdkRef);
    if (!sdkRef.current) {
      const socialLoginSDK = new SocialLogin();
      const signature1 = await socialLoginSDK.whitelistUrl(
        "https://biconomy-social-login-git-main-muhammad-waqar-uit.vercel.app"
      );
      const signature2 = await socialLoginSDK.whitelistUrl(
        "http://localhost:3000/"
      );
      await socialLoginSDK.init({
        chainId: ethers.utils.hexValue(ChainId.POLYGON_MUMBAI).toString(),
        network: "testnet",
        whitelistUrls: {
          "https://biconomy-social-login-git-main-muhammad-waqar-uit.vercel.app":
            signature1,
          "http://localhost:3000/": signature2,
        },
      });
      sdkRef.current = socialLoginSDK;
    }
    if (!sdkRef.current?.provider) {
      sdkRef.current?.showWallet();
      enableInterval(true);
    } else {
      console.log("hello");
      setupSmartAccount();
    }
  }
  // setupSmartAccount() function
  async function setupSmartAccount() {
    try {
      // If the SDK hasn't fully initialized, return early
      if (!sdkRef.current?.provider) return;

      // Hide the wallet if currently open
      sdkRef.current.hideWallet();

      // Start the loading indicator
      setLoading(true);

      // Initialize the smart account
      let web3Provider = new ethers.providers.Web3Provider(
        sdkRef.current?.provider
      );
      setProvider(web3Provider);
      const config: BiconomySmartAccountConfig = {
        signer: web3Provider.getSigner(),
        rpcUrl:
          "https://polygon-mumbai.g.alchemy.com/v2/Mh7MEm0SLywtlNh1_bcuroflDlQ3wYpu",
        entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
        chainId: ChainId.POLYGON_MUMBAI,
        bundler: bundler,
        paymaster: paymaster,
      };
      const smartAccount = new BiconomySmartAccount(config);
      await smartAccount.init();

      // Save the smart account to a state variable
      setSmartAccount(smartAccount);
    } catch (e) {
      console.error(e);
    }

    setLoading(false);
  }

  async function logOut() {
    // Log out of the smart account
    await sdkRef.current?.logout();

    // Hide the wallet
    sdkRef.current?.hideWallet();

    window.localStorage.clear();
    // Reset state and stop the interval if it was started
    setSmartAccount(undefined);
    enableInterval(false);
  }

  useEffect(() => {
    let configureLogin: NodeJS.Timeout | undefined;
    if (interval) {
      configureLogin = setInterval(() => {
        if (!!sdkRef.current?.provider) {
          setupSmartAccount();
          clearInterval(configureLogin);
        }
      }, 1000);
    }
  }, [interval]);
  return (
    <Fragment>
      {/* Logout Button */}
      {smartAccount && (
        <>
          <div className="flex flex-row justify-start items-center">
            <div>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="absolute  m-3 rounded-lg bg-gradient-to-r from-green-400 to-blue-500 px-4 py-2 font-medium transition-all hover:from-green-500 hover:to-blue-600"
              >
                Navigate to Pages
              </button>
              {isOpen && <PagesModal isOpen={isOpen} />}
            </div>
          </div>
          <button
            onClick={logOut}
            className="absolute right-0 m-3 rounded-lg bg-gradient-to-r from-green-400 to-blue-500 px-4 py-2 font-medium transition-all hover:from-green-500 hover:to-blue-600 "
          >
            Logout
          </button>
        </>
      )}

      <div className="m-auto flex h-screen flex-col items-center justify-center gap-10">
        {!smartAccount && !loading && (
          <h1 className=" text-4xl text-gray-500 font-bold tracking-tight lg:text-5xl">
            Sign In To NFTrops
          </h1>
        )}

        {/* Login Button */}
        {!smartAccount && !loading && (
          <button
            onClick={login}
            className="mt-10 rounded-lg bg-gradient-to-r from-green-400 to-blue-500 px-4 py-2 font-medium  transition-colors hover:from-green-500 hover:to-blue-600"
          >
            Login
          </button>
        )}

        {/* Loading state */}
        {loading && <p>Loading account details...</p>}

        {smartAccount && (
          <Fragment>
            {" "}
            <MintNft smartAccount={smartAccount} />
          </Fragment>
        )}
      </div>
    </Fragment>
  );
}
