import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Client } from "@xmtp/xmtp-js";

export const SubscriptionsContainer = ({ client }) => {
  const [loading, setLoading] = useState(false);
  const [subscriptions, setSubscriptions] = useState([]);

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

  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true);
      try {
        const allConversations = await client.conversations.list();

        const filteredConversations = allConversations.filter(
          (conversation) =>
            conversation?.context?.conversationId === "notification_v1",
        );
        setSubscriptions(filteredConversations);

        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch conversations:", error);
      }
    };

    if (client) {
      fetchConversations();
    }
  }, [client]);

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
  const handleClick = async (senderAddress, state, index) => {
    try {
      // Get the subscriber
      let wallet = await connectWallet();
      let client = await Client.create(wallet, { env: "production" });

      // Refresh the consent list to make sure your application is up-to-date with the
      await client.contacts.refreshConsentList();

      // If the state is unknown or blocked, allow the subscriber
      if (state === "unknown" || state === "denied") {
        state = "allowed";
        await client.contacts.allow([senderAddress]);
      } else if (state === "allowed") {
        state = "denied";
        await client.contacts.deny([senderAddress]);
      }

      // Use functional update to ensure we're working with the most current state
      setSubscriptions((currentExplore) =>
        currentExplore.map((item, itemIndex) =>
          itemIndex === index ? { ...item, status: state } : item,
        ),
      );
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", fontSize: "small" }}>
        Loading subscriptions...
      </div>
    );
  }

  return (
    <div>
      {subscriptions.map((subscription, index) => (
        <div key={index} style={styles.subscriptionContainer}>
          <img
            alt="Avatar"
            style={styles.notificationAvatar}
            src={subscription.context?.metadata?.avatarLogoUrl}
          />
          <div style={styles.subscriptionText}>
            <a
              target="_blank"
              rel="noreferrer"
              href={subscription.context?.metadata?.website}
              style={styles.notificationTitle}>
              {subscription.context?.metadata?.name}
            </a>
            <p style={styles.description}>
              {subscription.context?.metadata?.description}
            </p>
          </div>
          <button
            style={styles.subscriptionButton}
            onClick={() =>
              handleClick(
                subscription.peerAddress,
                subscription.consentState,
                index,
              )
            }
            disabled={loading}>
            {"allowed" === "allowed" ? "Unsubscribe" : "Subscribe"}
          </button>
        </div>
      ))}
    </div>
  );
};
