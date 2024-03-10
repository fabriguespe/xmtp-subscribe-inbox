import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Client } from "@xmtp/xmtp-js";

export const ExploreContainer = ({ client }) => {
  const [loading, setLoading] = useState(false);
  const [explore, setExplore] = useState([
    {
      avatarLogoUrl:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAP1BMVEVHcEyKNtmRMtOHONuKNtmVMtGSMdKLNNeONNaEOd1+EtaZWd6BI9h+PeLg0PX////38/2ncuLGp+yRRtp+PeJQ5l+/AAAADnRSTlMAL3WVvAj//9z/////aK5o48AAAAEFSURBVHgBdNKBqoUgDIDhUmvNlvOo7/+sd9MzOxH3BwL4GJPRcrc6H4J36/Jq8/sIAPz2NGc0cr927IaDMbzNCAGP/+aUbdaZdYoniUmX2makg3Qmzp/YVdH/GBTmzJwqYkMvaCYaBUr8yFe1yV2MCCgyEyHGxKdYW+05VJMMcdZ1JNiky1YWlqoiTPRLUKoiBZIiIWF+4MkZ+s58JtQXt4F+YCIAEKwsFfqie2IsnHCYPGj9YgQg4EwSttE6jlBZj6bLVAzH+WCviccyRDTz/fAg6dFSVbsHNQed6VRStef0AmgIXczC/BWmTT2WWTB8zWmX0hy0fTN/k1/erZeX/saLlB0A6s8aTMH9zwwAAAAASUVORK5CYII=",
      username: "Polygon",
      address: "0xEA4D8abb6EAe16d2cE21b36E4049136313D5d283",
      description: "Subscribe to Web3 Developers community.",
    },
    {
      avatarLogoUrl: "https://xmtp.org/img/builtWithXmtp/snapshot.jpg",
      username: "Snapshot",
      address: "0xEA4D8abb6EAe16d2cE21b36E4049136313D5d283",
      description: "Subscribe to Web3 Developers community.",
    },
    {
      avatarLogoUrl: "https://xmtp.org/img/logo-paragraph.png",
      username: "Paragraph",
      address: "0xEA4D8abb6EAe16d2cE21b36E4049136313D5d283",
      description: "Subscribe to Web3 Developers community.",
    },
    {
      avatarLogoUrl: "https://opensea.io/static/images/logos/opensea-logo.svg",
      username: "OpenSea",
      address: "0xEA4D8abb6EAe16d2cE21b36E4049136313D5d283",
      description: "Subscribe to Web3 Developers community.",
    },
  ]);

  const styles = {
    subscriptionContainer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "10px",
      borderBottom: "1px solid #ccc",
    },

    notificationTitle: {
      fontSize: "14px",
      fontWeight: "bold",
      margin: "0px", // Add some space between the title and the time
      textDecoration: "none",
      color: "black",
    },
    subscriptionAvatar: {
      borderRadius: "50%",
      width: "40px", // Adjusted width
      height: "40px", // Adjusted height to maintain aspect ratio
      objectFit: "cover",
      display: "block",
      overflow: "hidden",
    },
    subscriptionText: {
      marginLeft: "0px",
      flexGrow: 1,
      maxWidth: "50%", // Limit the text width to ensure it doesn't push other elements too wide
    },
    subscriptionButton: {
      backgroundColor: "black",
      color: "white",
      border: "none",
      borderRadius: "5px",
      padding: "5px 10px",
      cursor: "pointer",
      // You might want to adjust padding or font size here if the button is too large
    },

    username: {
      margin: "0px",
      fontSize: "14px",
      fontWeight: "bold",
      marginBottom: "4px", // Add some space between the username and the description
    },
    description: {
      marginTop: "0px",
      fontSize: "12px",
      color: "#666", // A lighter color for the description
    },

    notificationAvatar: {
      borderRadius: "50%",
      width: "50px", // Adjusted width to match notificationAvatar
      height: "50px", // Adjusted height to maintain aspect ratio
      objectFit: "cover",
      display: "block",
      overflow: "hidden",
    },
  };

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        return provider.getSigner();
      } catch (error) {
        console.error("User rejected request", error);
      }
    } else {
      console.error("Metamask not found");
    }
  };

  // Define the handleClick function
  const handleClick = async (senderAddress) => {
    try {
      // Set loading to true
      setLoading(true);
      // Get the subscriber
      let wallet = await connectWallet();
      let client = await Client.create(wallet, { env: "production" });

      // Refresh the consent list to make sure your application is up-to-date with the
      await client.contacts.refreshConsentList();

      // Get the consent state of the subscriber
      let state = client.contacts.consentState(senderAddress);

      // If the state is unknown or blocked, allow the subscriber
      if (state === "unknown" || state === "denied") {
        state = "allowed";
        await client.contacts.allow([senderAddress]);
      } else if (state === "allowed") {
        state = "denied";
        await client.contacts.deny([senderAddress]);
      }

      // Set loading to false
      setLoading(false);
    } catch (error) {
      // Log the error
      console.log(error);
    }
  };

  return (
    <>
      {explore.map((item, index) => (
        <div key={index} style={styles.subscriptionContainer}>
          <img
            src={item.avatarLogoUrl}
            style={styles.subscriptionAvatar}
            alt={`${item.username} Avatar`}
          />
          <div style={styles.subscriptionText}>
            <p style={styles.username}>{item.username}</p>
            <p style={styles.description}>{item.description}</p>
          </div>
          <button
            style={styles.subscriptionButton}
            onClick={() => handleClick(item.address)}>
            Subscribe
          </button>
        </div>
      ))}
    </>
  );
};
