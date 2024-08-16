import React, { useState } from "react";
import { useReadContracts } from "wagmi";
import abi from "../contracts/abi/hello.json";

export default function Test() {
  const contractAddress = "0xd9145CCE52D386f254917e481eB44e9943F39138";
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