import "@biconomy/web3-auth/dist/src/style.css";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ReduxProviders } from "@/GlobalRedux/provider";
export default function App({ Component, pageProps }: AppProps) {
  return (
    <ReduxProviders>
      <Component {...pageProps} />
    </ReduxProviders>
  );
}
