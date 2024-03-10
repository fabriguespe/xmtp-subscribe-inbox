import React, { useState, useEffect } from "react";
import { NotificationContentType } from "./NotificationContentType";

export const NotificationsContainer = ({ client }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const styles = {
    //Notis
    notificationContainer: {
      display: "flex",
      alignItems: "center",
      padding: "10px",
      borderBottom: "1px solid #ccc",
    },
    notificationAvatar: {
      borderRadius: "50%",
      width: "50px", // Adjusted width to match notificationAvatar
      height: "50px", // Adjusted height to maintain aspect ratio
      objectFit: "cover",
      display: "block",
      overflow: "hidden",
    },
    notificationText: {
      marginLeft: "10px",
      flexGrow: 1,
      maxWidth: "calc(100% - 60px)", // Adjusted to ensure text doesn't push other elements too wide, considering avatar width and some padding
    },
    notificationButton: {
      // If there's a button in the notification, style it similarly to notificationButton
      backgroundColor: "black",
      color: "white",
      border: "none",
      borderRadius: "5px",
      padding: "5px 10px",
      cursor: "pointer",
    },

    notificationTitle: {
      fontSize: "14px",
      fontWeight: "bold",
      margin: "0px", // Add some space between the title and the time
      textDecoration: "none",
      color: "black",
    },
    notificationTime: {
      fontSize: "12px",
      color: "#666",
    },
    notificationUsername: {
      backgroundColor: "black",
      color: "white",
      border: "none",
      borderRadius: "5px",
      padding: "5px 10px",
      cursor: "pointer",
    },
  };

  useEffect(() => {
    let isMounted = true;
    let stream;
    const fetchAndStreamConversations = async () => {
      setLoading(true);
      let notificationArray = [];
      const allConversations = await client.conversations.list();
      await Promise.all(
        allConversations.map(async (conversation) => {
          const initialMessages = await conversation?.messages();
          notificationArray.push(
            ...initialMessages
              .filter((message) =>
                message.contentType.sameAs(NotificationContentType),
              )
              .map((message) => ({
                content: message.content,
                sent: message.sent,
              })),
          );
        }),
      );
      notificationArray.sort((a, b) => new Date(b.sent) - new Date(a.sent));
      setNotifications(notificationArray);
      setLoading(false);

      stream = await client.conversations.streamAllMessages();
      for await (const message of stream) {
        if (message.contentType.sameAs(NotificationContentType)) {
          const newNotification = {
            content: message.content,
            sent: message.sent,
          };
          if (isMounted) {
            setNotifications((prevNotifications) => {
              const updatedNotifications = [
                ...prevNotifications,
                newNotification,
              ];
              return updatedNotifications.sort(
                (a, b) => new Date(b.sent) - new Date(a.sent),
              );
            });
          }
        }
      }
    };

    fetchAndStreamConversations();

    return () => {
      isMounted = false;
      if (stream) {
        stream.return();
      }
    };
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", fontSize: "small" }}>
        Loading notifications...
      </div>
    );
  }

  return (
    <>
      {notifications.map((notification, index) => (
        <div key={index} style={styles.notificationContainer}>
          <img
            alt="Avatar"
            style={styles.notificationAvatar}
            src={notification.content.avatarLogoUrl}
          />
          <div style={styles.notificationText}>
            <a
              target="_blank"
              rel="noreferrer"
              href={notification.content.url}
              style={styles.notificationTitle}>
              {notification.content.subject}
            </a>
            <p style={styles.notificationTime}>
              {`${new Date(notification.sent).getHours()}:${String(
                new Date(notification.sent).getMinutes(),
              ).padStart(2, "0")}`}{" "}
              ago by <b>{notification.content.name}</b>
            </p>
          </div>
        </div>
      ))}
    </>
  );
};
