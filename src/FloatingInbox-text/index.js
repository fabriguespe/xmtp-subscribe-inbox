import React, { useState, useEffect } from "react";
import { Client } from "@xmtp/xmtp-js";
import { ethers } from "ethers";
import { ConversationContainer } from "./ConversationContainer";
import { NotificationContentTypeCodec } from "../NotificationContentType";

export function FloatingInbox({
  wallet,
  env,
  isPWA = false,
  onLogout,
  isContained = false,
  isConsent = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isOnNetwork, setIsOnNetwork] = useState(false);
  const [client, setClient] = useState();
  const [isConnected, setIsConnected] = useState(false);
  const [activeTab, setActiveTab] = useState("notifications");

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  useEffect(() => {
    const initialIsOpen =
      isPWA ||
      isContained ||
      localStorage.getItem("isWidgetOpen") === "true" ||
      false;
    const initialIsOnNetwork =
      localStorage.getItem("isOnNetwork") === "true" || false;
    const initialIsConnected =
      (localStorage.getItem("isConnected") && wallet === "true") || false;

    setIsOpen(initialIsOpen);
    setIsOnNetwork(initialIsOnNetwork);
    setIsConnected(initialIsConnected);
  }, []);

  const [selectedConversation, setSelectedConversation] = useState(null);
  const [signer, setSigner] = useState();

  const styles = {
    FloatingLogo: {
      position: "fixed",
      bottom: "20px",
      right: "20px",
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      backgroundColor: "white",
      display: "flex",
      alignItems: "center",
      border: "1px solid #ccc",
      justifyContent: "center",
      cursor: "pointer",
      transition: "transform 0.3s ease",
      padding: "5px",
    },
    uContainer: {
      position: isContained ? "relative" : isPWA ? "relative" : "fixed",
      bottom: isContained ? "0px" : isPWA ? "0px" : "80px",
      right: isContained ? "0px" : isPWA ? "0px" : "20px",
      width: isContained ? "100%" : isPWA ? "100%" : "300px",
      height: isContained ? "100%" : isPWA ? "100vh" : "400px",
      border: isContained ? "0px" : isPWA ? "0px" : "1px solid #ccc",
      backgroundColor: "#f9f9f9",
      borderRadius: isContained ? "0px" : isPWA ? "0px" : "10px",
      zIndex: "1000",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
    },
    logoutBtn: {
      position: "absolute",
      top: "10px",
      textDecoration: "none",
      color: "#000",
      left: "5px",
      background: "transparent",
      border: "none",
      fontSize: isPWA == true ? "12px" : "10px",
      cursor: "pointer",
    },
    widgetHeader: {
      padding: "2px",
    },
    label: {
      fontSize: "10px",
      textAlign: "center",
      marginTop: "5px",
      cursor: "pointer",
      display: "block",
    },
    activeTabColor: {
      backgroundColor: "black",
    },
    conversationHeader: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "none",
      border: "none",
      width: "auto",
      margin: "0px",
    },
    conversationHeaderH4: {
      margin: "0px",
      padding: "4px",
      fontSize: isPWA == true ? "20px" : "14px", // Increased font size
    },
    backButton: {
      border: "0px",
      background: "transparent",
      cursor: "pointer",
      fontSize: isPWA == true ? "20px" : "14px", // Increased font size
    },
    widgetContent: {
      flexGrow: 1,
      overflowY: "auto",
    },
    xmtpContainer: {
      display: "flex",
      justifyContent: "center",
      flexDirection: "column",
      alignItems: "center",
      height: "100%",
    },
    btnXmtp: {
      backgroundColor: "#f0f0f0",
      display: "flex",
      alignItems: "center",
      textDecoration: "none",
      color: "#000",
      justifyContent: "center",
      border: "1px solid grey",
      padding: isPWA == true ? "20px" : "10px",
      borderRadius: "5px",
      fontSize: isPWA == true ? "20px" : "14px",
    },
    tabsList: {
      display: "flex",
      justifyContent: "space-around",
      alignItems: "center",
      width: "100%",
      backgroundColor: "rgb(31, 41, 55)", // Example background color
      borderBottom: "1px solid #ccc",
    },
    tabTrigger: {
      flex: 1,
      padding: "10px 0",
      cursor: "pointer",
      border: "none",
      backgroundColor: "transparent",
      fontSize: "10px", // Example font size
      fontWeight: "bold",
      color: "#fff", // Example text color
      outline: "none",
    },

    subscriptionContainer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "10px",
      borderBottom: "1px solid #ccc",
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

    //Notis
    notificationContainer: {
      display: "flex",
      alignItems: "center",
      padding: "10px",
      borderBottom: "1px solid #ccc",
    },
    notificationAvatar: {
      borderRadius: "50%",
      width: "50px", // Adjusted width to match subscriptionAvatar
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
      // If there's a button in the notification, style it similarly to subscriptionButton
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
    if (wallet) {
      setSigner(wallet);
      setIsConnected(true);
    }
    if (client && !isOnNetwork) {
      setIsOnNetwork(true);
    }
    if (signer && isOnNetwork && isConnected) {
      initXmtpWithKeys();
    }
  }, [wallet, isOnNetwork, isConnected]);

  useEffect(() => {
    localStorage.setItem("isOnNetwork", isOnNetwork.toString());
    localStorage.setItem("isWidgetOpen", isOpen.toString());
    localStorage.setItem("isConnected", isConnected.toString());
  }, [isOpen, isConnected, isOnNetwork]);

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        await window.ethereum.enable();
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        setSigner(signer);
        console.log("Your address", await getAddress(signer));
        setIsConnected(true);
      } catch (error) {
        console.error("User rejected request", error);
      }
    } else {
      console.error("Metamask not found");
    }
  };

  const getAddress = async (signer) => {
    try {
      //ethers
      if (signer && typeof signer.getAddress === "function") {
        return await signer.getAddress();
      }
      //viem
      else if (signer && typeof signer.getAddresses === "function") {
        const [address] = await signer.getAddresses();
        return address;
      }
      return null;
    } catch (e) {
      console.log(e);
    }
  };

  const [isWalletCreated, setIsWalletCreated] = useState(false);

  const createNewWallet = async () => {
    const newWallet = ethers.Wallet.createRandom();
    console.log("Your address", newWallet.address);
    setSigner(newWallet);
    setIsConnected(true);
    setIsWalletCreated(true); // Set isWalletCreated to true when a new wallet is created
  };

  const openWidget = () => {
    setIsOpen(true);
  };

  const closeWidget = () => {
    setIsOpen(false);
  };

  if (typeof window !== "undefined") {
    window.FloatingInbox = {
      open: openWidget,
      close: closeWidget,
    };
  }
  const handleLogout = async () => {
    setIsConnected(false);
    const address = await getAddress(signer);
    wipeKeys(address);
    console.log("wipe", address);
    setSigner(null);
    setIsOnNetwork(false);
    setClient(null);
    setSelectedConversation(null);
    localStorage.removeItem("isOnNetwork");
    localStorage.removeItem("isConnected");
    if (typeof onLogout === "function") {
      onLogout();
    }
  };
  const initXmtpWithKeys = async function () {
    if (!signer) {
      handleLogout();
      return;
    }
    let address = await getAddress(signer);
    let keys = loadKeys(address);
    const clientOptions = {
      env: env ? env : getEnv(),
    };
    if (!keys) {
      keys = await Client.getKeys(signer, {
        ...clientOptions,
        skipContactPublishing: true,
        persistConversations: false,
      });
      storeKeys(address, keys);
    }
    const xmtp = await Client.create(null, {
      ...clientOptions,
      privateKeyOverride: keys,
    });

    xmtp.registerCodec(new NotificationContentTypeCodec());

    setClient(xmtp);
    setIsOnNetwork(!!xmtp.address);
    if (isConsent) {
      //Refresh consent
      await xmtp.contacts.refreshConsentList();
    }
  };

  return (
    <>
      {!isPWA && !isContained && (
        <div
          onClick={isOpen ? closeWidget : openWidget}
          className={
            "FloatingInbox " +
            (isOpen ? "spin-clockwise" : "spin-counter-clockwise")
          }
          style={styles.FloatingLogo}>
          💬
        </div>
      )}
      {isOpen && (
        <div
          style={styles.uContainer}
          className={" " + (isOnNetwork ? "expanded" : "")}>
          {isConnected && (
            <button style={styles.logoutBtn} onClick={handleLogout}>
              Logout
            </button>
          )}
          {isConnected && isOnNetwork && (
            <div style={styles.widgetHeader}>
              <div style={styles.conversationHeader}>
                {isOnNetwork && selectedConversation && (
                  <button
                    style={styles.backButton}
                    onClick={() => {
                      setSelectedConversation(null);
                    }}>
                    ←
                  </button>
                )}
                <h4 style={styles.conversationHeaderH4}>Inbox</h4>
              </div>
            </div>
          )}
          {isConnected}
          <div style={styles.widgetContent}>
            {!isConnected && (
              <div style={styles.xmtpContainer}>
                <button style={styles.btnXmtp} onClick={connectWallet}>
                  Connect Wallet
                </button>
                <div style={styles.label} onClick={createNewWallet}>
                  or create new one
                </div>
              </div>
            )}
            {isConnected && !isOnNetwork && (
              <div style={styles.xmtpContainer}>
                <button style={styles.btnXmtp} onClick={initXmtpWithKeys}>
                  Connect to XMTP
                </button>
                {isWalletCreated && (
                  <button style={styles.label}>
                    Your addess: {signer.address}
                  </button>
                )}
              </div>
            )}
            {isConnected && isOnNetwork && client && (
              <>
                <div style={styles.tabsList}>
                  <button
                    style={{
                      ...styles.tabTrigger,
                      ...(activeTab === "notifications"
                        ? styles.activeTabColor
                        : {}),
                    }}
                    onClick={() => handleTabClick("notifications")}>
                    Notifications
                  </button>
                  <button
                    style={{
                      ...styles.tabTrigger,
                      ...(activeTab === "subscriptions"
                        ? styles.activeTabColor
                        : {}),
                    }}
                    onClick={() => handleTabClick("subscriptions")}>
                    Following
                  </button>
                  <button
                    style={{
                      ...styles.tabTrigger,
                      ...(activeTab === "explore" ? styles.activeTabColor : {}),
                    }}
                    onClick={() => handleTabClick("explore")}>
                    Explore
                  </button>
                  <button
                    style={{
                      ...styles.tabTrigger,
                      ...(activeTab === "conversations"
                        ? styles.activeTabColor
                        : {}),
                    }}
                    onClick={() => handleTabClick("conversations")}>
                    Messages
                  </button>
                </div>
                <div style={styles.widgetContent}>
                  {activeTab === "notifications" && (
                    <>
                      <div style={styles.notificationContainer}>
                        <img
                          alt="Avatar"
                          style={styles.notificationAvatar}
                          src="/placeholder.svg"
                        />
                        <div style={styles.notificationText}>
                          <p style={styles.notificationTitle}>
                            Vote on this DAO proposal
                          </p>
                          <p style={styles.notificationTime}>
                            2 hours ago by <b>@snapshot.eth</b>
                          </p>
                        </div>
                      </div>
                      <div style={styles.notificationContainer}>
                        <img
                          alt="Avatar"
                          style={styles.notificationAvatar}
                          src="/placeholder.svg"
                        />
                        <div style={styles.notificationText}>
                          <p style={styles.notificationTitle}>
                            Your bridge has completed
                          </p>

                          <p style={styles.notificationTime}>
                            2 hours ago by <b>@polygon.eth</b>
                          </p>
                        </div>
                      </div>
                      <div style={styles.notificationContainer}>
                        <img
                          alt="Avatar"
                          style={styles.notificationAvatar}
                          src="/placeholder.svg"
                        />
                        <div style={styles.notificationText}>
                          <p style={{ fontSize: "14px", fontWeight: "bold" }}>
                            Mint this exclusive NFT
                          </p>
                          <p style={styles.notificationTime}>
                            1 hours ago by <b>@zora</b>
                          </p>
                        </div>
                      </div>
                      <div style={styles.notificationContainer}>
                        <img
                          alt="Avatar"
                          style={styles.notificationAvatar}
                          src="/placeholder.svg"
                        />
                        <div style={styles.notificationText}>
                          <p style={styles.notificationTitle}>
                            Alice has requested you money
                          </p>
                          <p style={styles.notificationTime}>
                            2 hours ago by <b>@alice.eth</b>
                          </p>
                        </div>
                      </div>
                      <div style={styles.notificationContainer}>
                        <img
                          alt="Avatar"
                          style={styles.notificationAvatar}
                          src="/placeholder.svg"
                        />
                        <div style={styles.notificationText}>
                          <p style={styles.notificationTitle}>
                            Your ENS domain is expiring soon
                          </p>
                          <p style={styles.notificationTime}>
                            Now <b>@ens</b>
                          </p>
                        </div>
                      </div>
                      <div style={styles.notificationContainer}>
                        <img
                          alt="Avatar"
                          style={styles.notificationAvatar}
                          src="/placeholder.svg"
                        />
                        <div style={styles.notificationText}>
                          <p style={styles.notificationTitle}>
                            You received a $10 USD bid for your NFT
                          </p>
                          <p style={styles.notificationTime}>
                            2 hours ago by <b>@opensea</b>
                          </p>
                        </div>
                      </div>
                      <div style={styles.notificationContainer}>
                        <img
                          alt="Avatar"
                          style={styles.notificationAvatar}
                          src="/placeholder.svg"
                        />
                        <div style={styles.notificationText}>
                          <p style={styles.notificationTitle}>
                            A new blog post is available
                          </p>
                          <p style={styles.notificationTime}>
                            2 hours ago by <b>@mirror</b>
                          </p>
                        </div>
                      </div>
                      <div style={styles.notificationContainer}>
                        <img
                          alt="Avatar"
                          style={styles.notificationAvatar}
                          src="/placeholder.svg"
                        />
                        <div style={styles.notificationText}>
                          <p style={styles.notificationTitle}>
                            Read the latest XMTP newsletter
                          </p>
                          <p style={styles.notificationTime}>
                            2 hours ago by <b>@paragraph</b>
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                  {activeTab === "subscriptions" && (
                    <>
                      <div style={styles.subscriptionContainer}>
                        <img
                          alt="Avatar"
                          style={styles.notificationAvatar}
                          src="/placeholder.svg"
                        />
                        <div style={styles.subscriptionText}>
                          <p style={styles.username}>@web3devs</p>
                          <p style={styles.description}>
                            Subscribe to Web3 Developers community.
                          </p>
                        </div>
                        <button style={styles.subscriptionButton}>
                          Subscribe
                        </button>
                      </div>
                    </>
                  )}
                  {activeTab === "explore" && (
                    <>
                      <div style={styles.subscriptionContainer}>
                        <img
                          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAP1BMVEVHcEyKNtmRMtOHONuKNtmVMtGSMdKLNNeONNaEOd1+EtaZWd6BI9h+PeLg0PX////38/2ncuLGp+yRRtp+PeJQ5l+/AAAADnRSTlMAL3WVvAj//9z/////aK5o48AAAAEFSURBVHgBdNKBqoUgDIDhUmvNlvOo7/+sd9MzOxH3BwL4GJPRcrc6H4J36/Jq8/sIAPz2NGc0cr927IaDMbzNCAGP/+aUbdaZdYoniUmX2makg3Qmzp/YVdH/GBTmzJwqYkMvaCYaBUr8yFe1yV2MCCgyEyHGxKdYW+05VJMMcdZ1JNiky1YWlqoiTPRLUKoiBZIiIWF+4MkZ+s58JtQXt4F+YCIAEKwsFfqie2IsnHCYPGj9YgQg4EwSttE6jlBZj6bLVAzH+WCviccyRDTz/fAg6dFSVbsHNQed6VRStef0AmgIXczC/BWmTT2WWTB8zWmX0hy0fTN/k1/erZeX/saLlB0A6s8aTMH9zwwAAAAASUVORK5CYII="
                          style={styles.subscriptionAvatar}
                          alt="Snapshot Avatar"
                        />
                        <div style={styles.subscriptionText}>
                          <p style={styles.username}>Polygon</p>
                          <p style={styles.description}>
                            Subscribe to Web3 Developers community.
                          </p>
                        </div>
                        <button style={styles.subscriptionButton}>
                          Subscribe
                        </button>
                      </div>
                      <div style={styles.subscriptionContainer}>
                        <img
                          src="https://xmtp.org/img/builtWithXmtp/snapshot.jpg"
                          style={styles.subscriptionAvatar}
                          alt="Snapshot Avatar"
                        />
                        <div style={styles.subscriptionText}>
                          <p style={styles.username}>Snapshot</p>
                          <p style={styles.description}>
                            Subscribe to Web3 Developers community.
                          </p>
                        </div>
                        <button style={styles.subscriptionButton}>
                          Subscribe
                        </button>
                      </div>
                      <div style={styles.subscriptionContainer}>
                        <img
                          src="https://xmtp.org/img/logo-paragraph.png"
                          style={styles.subscriptionAvatar}
                          alt="Snapshot Avatar"
                        />
                        <div style={styles.subscriptionText}>
                          <p style={styles.username}>Paragraph</p>
                          <p style={styles.description}>
                            Subscribe to Web3 Developers community.
                          </p>
                        </div>
                        <button style={styles.subscriptionButton}>
                          Subscribe
                        </button>
                      </div>

                      <div style={styles.subscriptionContainer}>
                        <img
                          src="https://opensea.io/static/images/logos/opensea-logo.svg"
                          style={styles.subscriptionAvatar}
                          alt="Snapshot Avatar"
                        />
                        <div style={styles.subscriptionText}>
                          <p style={styles.username}>OpenSea</p>
                          <p style={styles.description}>
                            Subscribe to Web3 Developers community.
                          </p>
                        </div>
                        <button style={styles.subscriptionButton}>
                          Subscribe
                        </button>
                      </div>
                    </>
                  )}
                  {activeTab === "conversations" && (
                    <ConversationContainer
                      isPWA={isPWA}
                      client={client}
                      isConsent={isConsent}
                      isContained={isContained}
                      selectedConversation={selectedConversation}
                      setSelectedConversation={setSelectedConversation}
                    />
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

const ENCODING = "binary";

export const getEnv = () => {
  // "dev" | "production" | "local"
  return typeof process !== "undefined" && process.env.REACT_APP_XMTP_ENV
    ? process.env.REACT_APP_XMTP_ENV
    : "production";
};
export const buildLocalStorageKey = (walletAddress) => {
  return walletAddress ? `xmtp:${getEnv()}:keys:${walletAddress}` : "";
};

export const loadKeys = (walletAddress) => {
  const val = localStorage.getItem(buildLocalStorageKey(walletAddress));
  return val ? Buffer.from(val, ENCODING) : null;
};

export const storeKeys = (walletAddress, keys) => {
  localStorage.setItem(
    buildLocalStorageKey(walletAddress),
    Buffer.from(keys).toString(ENCODING),
  );
};

export const wipeKeys = (walletAddress) => {
  localStorage.removeItem(buildLocalStorageKey(walletAddress));
};
