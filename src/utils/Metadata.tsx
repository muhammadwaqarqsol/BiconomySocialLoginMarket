import axios, { AxiosRequestConfig } from "axios";
const JWT = process.env.NEXT_PUBLIC_JWT;
async function metaData(
  nftTitle: string,
  NftDescription: string,
  IpfsHash: string
) {
  try {
    const data = JSON.stringify({
      pinataOptions: {
        CidVersion: 1,
      },
      pinataMetaData: {
        name: `${nftTitle}`,
      },
      pinataContent: {
        name: nftTitle,
        description: NftDescription,
        image: `https://ipfs.io/ipfs/${IpfsHash}`,
      },
    });

    const config: AxiosRequestConfig = {
      method: "POST",
      url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JWT}`,
      },
      data: data,
    };

    const MetadataRes = await axios(config);
    return { IpfsHash: MetadataRes.data.IpfsHash, status: MetadataRes.status };
  } catch (error) {
    console.error("Error in metaData function:", error);
  }
}
export default metaData;
