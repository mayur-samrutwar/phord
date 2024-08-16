import React, { useState } from "react";
import { useReadContracts } from "wagmi";
import abi from "../contracts/abi/hello.json";

export default function Test() {
  const contractAddress = "0xd9145CCE52D386f254917e481eB44e9943F39138";

  function handleRead() {
    const result = useReadContracts({
      contracts: [
        {
          address: contractAddress,
          abi: abi,
          functionName: "getMessage",
        },
      ],
    });

    console.log(result);
  }

  return (
    <div>
      <button onClick={handleRead}>Update Message</button>
    </div>
  );
}
