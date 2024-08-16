import React, { useState, useEffect } from "react";
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import abi from "../contracts/abi/hello.json";

export default function Test() {
  const contractAddress = "0xcF74CAd27c2203668611C1B32366a8772a7d1d5e";
  const [message, setMessage] = useState("");
  const [newMessage, setNewMessage] = useState("");

  const { data: readData, error: readError, isLoading: readIsLoading, refetch } = useReadContract({
    address: contractAddress,
    abi: abi,
    functionName: "getMessage",
  });

  const { writeContract, data: writeData } = useWriteContract();

  const { isLoading: writeIsLoading, isSuccess: writeIsSuccess } = useWaitForTransactionReceipt({
    hash: writeData?.hash,
  });

  useEffect(() => {
    if (readData) {
      setMessage(readData);
    }
  }, [readData]);

  function handleRead() {
    refetch();
  }

  function handleWrite() {
    if (writeContract) {
      writeContract({
        address: contractAddress,
        abi: abi,
        functionName: "updateMessage",
        args: [newMessage],
      });
    }
  }

  useEffect(() => {
    if (writeIsSuccess) {
      handleRead();
      setNewMessage("");
    }
  }, [writeIsSuccess]);

  return (
    <div>
      <button onClick={handleRead}>Read Message</button>
      {readIsLoading && <p>Loading...</p>}
      {readError && <p>Error reading contract: {readError.message}</p>}
      {message && <p>Current Message: {message}</p>}

      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Enter new message"
      />
      <button onClick={handleWrite} disabled={!writeContract || writeIsLoading}>
        {writeIsLoading ? "Updating..." : "Update Message"}
      </button>
      {writeIsSuccess && <p>Message updated successfully!</p>}
    </div>
  );
}