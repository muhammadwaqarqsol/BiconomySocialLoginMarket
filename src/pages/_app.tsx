import "@biconomy/web3-auth/dist/src/style.css";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ReduxProviders } from "@/GlobalRedux/provider";
import { WagmiConfig, configureChains, createConfig } from "wagmi";
import { polygonMumbai } from "viem/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import Navbar from "@/components/Navbar";

const { publicClient, webSocketPublicClient } = configureChains(
  [polygonMumbai],
  [
    alchemyProvider({ apiKey: String(process.env.NEXT_PUBLIC_ALCHEMY || "") }),
    publicProvider(),
  ]
);

const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={config}>
      <ReduxProviders>
        <Navbar />
        <Component {...pageProps} />
      </ReduxProviders>
    </WagmiConfig>
  );
}
