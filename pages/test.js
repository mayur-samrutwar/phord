import React, { useState } from "react";
import { useReadContracts } from "wagmi";
import abi from "../contracts/abi/hello.json";

export default function Test() {
  const contractAddress = "0xcF74CAd27c2203668611C1B32366a8772a7d1d5e";
  const [message, setMessage] = useState("");

  const { data, isError, isLoading } = useReadContracts({
    contracts: [
      {
        address: contractAddress,
        abi: abi,
        functionName: "getMessage",
      },
    ],
  });

  function handleRead() {
    console.log("clicked");
    console.log(data);
    if (data && data[0]) {
      setMessage(data[0].result);
    }
  }

  return (
    <div>
      <button onClick={handleRead}>Update Message</button>
      {isLoading && <p>Loading...</p>}
      {isError && <p>Error reading contract</p>}
      {message && <p>Message: {message}</p>}
    </div>
  );
}