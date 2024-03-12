import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Client } from "@xmtp/xmtp-js";
import {
  CurrencyRequestContentTypeCodec,
  CurrencyRequestContentType,
  CurrencyRequest,
} from "./CurrencyRequestContentType";
import {
  NotificationContentType,
  NotificationContentTypeCodec,
  Notification,
} from "../Notifications/NotificationContentType";

const SendNotification = ({}) => {
  const [amount, setAmount] = useState(1); // State for the amount of money to request
  const [currency, setCurrency] = useState("USDC"); // State for the amount of money to request
  const [memo, setMemo] = useState("Magic castle meal"); // State for the memo of the request

  const [subscriber, setSubscriber] = useState(
    "0x829510E9b6a3b6e8DCf906e846d3bFB6B9FB1D89",
  ); // Updated subject state to use template literals for dynamic values

  const [subjectUrl, setSubjectUrl] = useState(""); // Updated subject state to use template literals for dynamic values

  const [name, setName] = useState("Fabri");
  const [avatarLogoUrl, setAvatarLogoUrl] = useState(
    "https://pbs.twimg.com/profile_images/1714046879304916992/shc67g3Z_400x400.jpg",
  );
  const [url, setUrl] = useState("https://twitter.com/fabriguespe/photo");

  const [subject, setSubject] = useState(
    `${name} has requested you ${amount} in ${currency}`,
  );
  const [body, setBody] = useState(
    `${name} has requested you ${amount} in ${currency}`,
  );

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
    client.registerCodec(new CurrencyRequestContentTypeCodec());
    // Create a CurrencyRequest object. You need to provide additional details like chainId, token, from, and to.
    // For demonstration, using placeholders. Replace them with actual values as needed.
    const request = new CurrencyRequest(
      amount, // This is already defined in your state
      1, // Example chainId, replace with actual
      "ETH", // Example token, replace with actual
      wallet.address, // Sender's address, from the wallet
      subscriber, // Recipient's address
      memo, // Memo from your state
    );

    await conversation.send(request, {
      contentType: CurrencyRequestContentType,
    });

    alert("Notification sent!");
  };

  return (
    <div style={styles.container}>
      <h2>Request Money</h2>
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
        placeholder="Payment URL"
        value={subjectUrl}
        onChange={(e) => setSubjectUrl(e.target.value)}
      />
      <h3>Request currency</h3>
      <input
        style={styles.formField}
        type="text"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <input
        style={styles.formField}
        type="text"
        placeholder="Currency"
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
      />
      <textarea
        style={styles.formField}
        placeholder="Memo"
        value={memo}
        onChange={(e) => setMemo(e.target.value)}
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
