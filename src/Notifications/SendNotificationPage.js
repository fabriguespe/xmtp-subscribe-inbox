import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Client } from "@xmtp/xmtp-js";
import {
  NotificationContentType,
  NotificationContentTypeCodec,
} from "./NotificationContentType";

const SendNotificationPage = ({}) => {
  const [recipient, setRecipient] = useState(
    "0x829510E9b6a3b6e8DCf906e846d3bFB6B9FB1D89",
  );
  const [subject, setSubject] = useState("New DAO Proposal from ENS");
  const [url, setUrl] = useState(
    "https://xmtp.org/img/builtWithXmtp/snapshot.jpg",
  );
  const [avatarLogoUrl, setAvatarLogoUrl] = useState(
    "https://xmtp.org/img/builtWithXmtp/snapshot.jpg",
  );
  const [body, setBody] = useState(
    "A new proposal has been submitted. Click here to vote.",
  );
  const [name, setName] = useState("ENS");

  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      maxWidth: "80%",
      margin: "0 auto",
    },
    formField: {
      display: "block", // Each field will be a block element, appearing on a new line
      marginBottom: "10px", // Adds some space below each field
      width: "100%", // Makes the input span the full width of its container
    },
    textArea: {
      display: "block",
      marginBottom: "10px",
      width: "100%", // Makes the textarea span the full width of its container
      height: "100px", // Sets a fixed height for the textarea
    },
    button: {
      marginTop: "10px", // Adds some space above the button
    },
  };

  const sendNotification = async () => {
    const privateKey =
      "0x8069f97da6262ede2eecc0948c428ed59c53aae98124f490d6c04aa2bd624040";
    const wallet = new ethers.Wallet(privateKey);
    const client = await Client.create(wallet, { env: "production" });
    client.registerCodec(new NotificationContentTypeCodec());

    const conversation = await client.conversations.newConversation(recipient, {
      conversationId: "notification",
      metadata: {
        type: "notification",
        name: "notibot",
        website: "https://xmtp.org",
        avatar: "https://xmtp.org/img/favi.png",
      },
    });

    const notification = {
      subject,
      url,
      avatarLogoUrl,
      body,
      name,
    };

    await conversation.send(notification, {
      contentType: NotificationContentType,
    });

    alert("Notification sent!");
  };

  return (
    <div style={styles.container}>
      <h2>Send Notification</h2>
      <input
        style={styles.formField}
        type="text"
        placeholder="Recipient Address"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
      />
      <input
        style={styles.formField}
        type="text"
        placeholder="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      />
      <input
        style={styles.formField}
        type="text"
        placeholder="URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <input
        style={styles.formField}
        type="text"
        placeholder="Avatar Logo URL"
        value={avatarLogoUrl}
        onChange={(e) => setAvatarLogoUrl(e.target.value)}
      />
      <textarea
        style={styles.textArea}
        placeholder="Body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <input
        style={styles.formField}
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button style={styles.button} onClick={sendNotification}>
        Send
      </button>
    </div>
  );
};

export default SendNotificationPage;
