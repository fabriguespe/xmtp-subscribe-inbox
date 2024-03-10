import React from "react";
import { ethers } from "ethers";

export const PayOrRequestCurrencyPreviewCard = ({ message, isSelf }) => {
  if (!message) return null;

  const styles = {
    frame: {
      border: "1px solid #ccc",
      borderRadius: "8px",
      padding: "20px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      maxWidth: "300px",
      margin: "auto",
    },
    icon: {
      fontSize: "48px",
      marginBottom: "20px",
    },
    amount: {
      fontSize: "24px",
      fontWeight: "bold",
      marginBottom: "10px",
    },
    memo: {
      marginBottom: "20px",
    },
    payButton: {
      backgroundColor: "#4CAF50",
      color: "white",
      padding: "10px 20px",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
    },
  };

  const currencyRequest = message.content;
  const receiver = message.senderAddress;
  const amount = currencyRequest.amount;
  const tokenSymbol = currencyRequest.token;
  const memo = currencyRequest.memo;

  const sendTransaction = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const receiver = "0x829510E9b6a3b6e8DCf906e846d3bFB6B9FB1D89"; // Replace with a valid receiver address
      const transactionParameters = {
        to: receiver, // Required except during contract publications.
        from: await signer.getAddress(), // must match user's active address.
        value: "0x0", // Only required to send ether to the recipient from the initiating external account.
        gas: "0x76c0", // 30400
        gasPrice: "0x9184e72a000", // 10000000000000
        data: "0x", // Optional, but can be used for a simple message or transaction data
      };

      // Prompt MetaMask to confirm the transaction
      await provider.send("eth_sendTransaction", [transactionParameters]);
    } catch (error) {
      console.error("Error during transaction:", error);
    }
  };
  return (
    <div style={styles.frame}>
      <div style={styles.icon}>💰</div>
      <div style={styles.amount}>{`${amount} ${tokenSymbol}`}</div>
      <div style={styles.memo}>{memo}</div>
      <button style={styles.payButton} onClick={sendTransaction}>
        Pay
      </button>
    </div>
  );
};
