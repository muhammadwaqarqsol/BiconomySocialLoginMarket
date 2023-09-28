import axios from "axios";
const JWT = process.env.NEXT_PUBLIC_JWT;

async function ImageUploader(ipfsArray: any, fileName: string) {
  const formData = new FormData();
  formData.append("file", ipfsArray);

  const metadata = JSON.stringify({
    name: fileName,
  });
  formData.append("pinataMetadata", metadata);
  const options = JSON.stringify({
    cidVersion: 0,
  });
  formData.append("pinataOptions", options);
  try {
    const res = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        maxBodyLength: Infinity,
        headers: {
          "Content-Type": `multipart/form-data; boundary=${ipfsArray._boundry}`,
          Authorization: `Bearer ${JWT}`,
        },
      }
    );
    const data = res.data;
    return { IpfshashImage: data.IpfsHash, status: res.status };
  } catch (error) {
    console.log(error);
    return null;
  }
}
export default ImageUploader;
