import React, { useState, useEffect } from "react";

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
          <button style={styles.subscriptionButton}>Subscribe</button>
        </div>
      ))}
    </div>
  );
};
