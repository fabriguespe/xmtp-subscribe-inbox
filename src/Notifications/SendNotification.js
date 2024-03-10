import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Client } from "@xmtp/xmtp-js";
import {
  NotificationContentType,
  NotificationContentTypeCodec,
  Notification,
} from "./NotificationContentType";

const SendNotification = ({}) => {
  const [subscriber, setSubscriber] = useState(
    "0x829510E9b6a3b6e8DCf906e846d3bFB6B9FB1D89",
  );
  const [subject, setSubject] = useState("Your domain is about to expire");
  const [subjectUrl, setSubjectUrl] = useState(
    "https://app.ens.domains/thegeneralstore.eth",
  );
  const [body, setBody] = useState(
    "A new proposal has been submitted. Click here to vote.",
  );
  const [name, setName] = useState("ENS");
  const [avatarLogoUrl, setAvatarLogoUrl] = useState(
    "https://ens.domains/static/favicon-6305d6ce89910df001b94e8a31eb08f5.ico",
  );
  const [url, setUrl] = useState("https://ens.domains");

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
      "0x1eb5d5ff8f3ec2aea57248eaf24d7d7527bd0997cebcedf32d96aa1ada7d871f";
    //0xEA4D8abb6EAe16d2cE21b36E4049136313D5d283
    const wallet = new ethers.Wallet(privateKey);
    const client = await Client.create(wallet, { env: "production" });
    client.registerCodec(new NotificationContentTypeCodec());

    const conversation = await client.conversations.newConversation(
      subscriber,
      {
        conversationId: "notification_v1",
        metadata: {
          type: "notification",
          version: "v1",
          name: "Notibot",
          website: "https://xmtp.org",
          description: "A bot that sends notifications to users.",
          avatarLogoUrl: "https://xmtp.org/img/favi.png",
        },
      },
    );

    const notification = new Notification(
      subject,
      url,
      subjectUrl,
      avatarLogoUrl,
      body,
      name,
    );

    await conversation.send(notification, {
      contentType: NotificationContentType,
    });

    alert("Notification sent!");
  };

  return (
    <div style={styles.container}>
      <h2>Send Notification</h2>
      <h3>Subscriber</h3>
      <input
        style={styles.formField}
        type="text"
        placeholder="Subscriber address"
        value={subscriber}
        onChange={(e) => setSubscriber(e.target.value)}
      />
      <h3>Notification</h3>
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
        value={subjectUrl}
        onChange={(e) => setSubjectUrl(e.target.value)}
      />
      <textarea
        style={styles.textArea}
        placeholder="Body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <h3>Sender</h3>
      <input
        style={styles.formField}
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
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
      <button style={styles.button} onClick={sendNotification}>
        Send
      </button>
    </div>
  );
};

export default SendNotification;
