# Subscribe Inbox with XMTP

![xmtp](https://github.com/xmtp/xmtp-quickstart-reactjs/assets/1447073/3f2979ec-4d13-4c3d-bf20-deab3b2ffaa1)

This guide will walk you through the creation of a consent management system. This system will allow users to control their consent preferences for your messages or notifications. By leveraging XMTP, this tutorial offers tools to build a consent management system that respects user preferences and protects their privacy.

## Considerations

Before diving into the code let's consider important aspects while integrating consent features. For example, before making an allow or block action you should synchronize the updated consent list in order to prevent overwriting network consent from another app. For more details head to these sections of our docs:

- [Understand user consent preferences](https://xmtp.org/docs/build/user-consent#understand-user-consent-preferences): This section provides a comprehensive understanding of how user consent preferences are set, including but not limited to, direct actions within the app, settings adjustments, and responses to prompts.
- [Use consent preferences to respect user intent](https://xmtp.org/docs/build/user-consent#use-consent-preferences-to-respect-user-intent): Your app should aim to handle consent preferences appropriately because they are an expression of user intent.
- [Synchronize user consent preferences](https://xmtp.org/docs/build/user-consent#synchronize-user-consent-preferences):All apps that use the user consent feature must adhere to the logic described in this section to keep the consent list on the network synchronized with local app user consent preferences, and vice versa.

## Notifications

Each notification is sent via a Notification Content Type.

### Notification Content Type

The `Notification` class requires the following props for initialization:

- `subject`: The subject or title of the notification.
- `url`: The main URL associated with the notification.
- `subjectUrl`: An additional URL, possibly related to the subject.
- `avatarLogoUrl`: The URL for the avatar or logo image.
- `body`: The main content or body of the notification.
- `name`: The name associated with the notification, such as the sender's name.

These props are essential for creating a new instance of a `Notification` that is render properly in subscribe inboxes.

```jsx
import { ContentTypeId } from "@xmtp/xmtp-js";
import { ContentCodec, EncodedContent } from "@xmtp/xmtp-js";

// Create a unique identifier for the notification content type
export const NotificationContentType = new ContentTypeId({
  authorityId: "your.domain",
  typeId: "notification",
  versionMajor: 1,
  versionMinor: 0,
});

// Define the Notification class
export class Notification {
  constructor(subject, url, subjectUrl, avatarLogoUrl, body, name) {
    this.subject = subject;
    this.url = url;
    this.avatarLogoUrl = avatarLogoUrl;
    this.subjectUrl = subjectUrl;
    this.body = body;
    this.name = name;
  }
}

// Define the NotificationContentTypeCodec class
export class NotificationContentTypeCodec {
  get contentType() {
    return NotificationContentType;
  }

  encode(notification) {
    const { subject, subjectUrl, url, avatarLogoUrl, body, name } =
      notification;
    return {
      type: NotificationContentType,
      parameters: {},
      content: new TextEncoder().encode(
        JSON.stringify({ subject, subjectUrl, url, avatarLogoUrl, body, name }),
      ),
    };
  }

  decode(encodedContent) {
    const decodedContent = new TextDecoder().decode(encodedContent.content);
    const { subject, url, subjectUrl, avatarLogoUrl, body, name } =
      JSON.parse(decodedContent);
    return new Notification(
      subject,
      url,
      subjectUrl,
      avatarLogoUrl,
      body,
      name,
    );
  }

  fallback(notification) {
    return `Can’t display notification content types. Notification was ${JSON.stringify(
      notification,
    )}`;
  }
}
```

If the message is intended to be readed in an inbox then it should only display the body of the message.

```jsx
if (message.contentType.sameAs(NotificationContentType)) {
  content = message.content?.body;
}
```

## Metadata

Metadata within SendNotificationPage.js is crucial for defining the context and appearance of notifications sent via the XMTP network.
Here's a breakdown of the metadata fields and their significance:

- `type`: Specifies the nature of the notification, helping the receiving client understand how to process it.
- `version`: Indicates the version of the notification format, ensuring compatibility between different clients.
- `name`: The sender's name, providing a human-readable identifier for the source of the notification.
- `website`: A URL to the sender's website, offering recipients a way to learn more about the sender or the notification context.
- `description`: A brief description of the notification or the sender, adding context to the notification content.
- `avatarLogoUrl`: A URL to an image representing the sender, enhancing the visual presentation of the notification.

These metadata fields are set when creating a new conversation with the XMTP client, as shown in the snippet below:

```javascript
const conversation = await client.conversations.newConversation(recipient, {
  conversationId: "notification_v1",
  metadata: {
    type: "notification",
    version: "v1",
    name: "Notibot",
    website: "https://xmtp.org",
    description: "A bot that sends notifications to users.",
    avatarLogoUrl: "https://xmtp.org/img/favi.png",
  },
});
```

This metadata enriches the notification, making it more informative and visually appealing to the recipient.

## Universal allow block

Please refer to the XMTP documentation for comprehensive information regarding the implementation.

### Universal Allow/Block Prefs

[XIP-42](https://community.xmtp.org/t/xip-42-universal-allow-and-block-preferences/544) establishes `allow` and `block` permission preferences, enabling users to explicitly specify which contacts should be able to reach them and which should be blocked across all inbox apps.

**Tutorials**:

- [Broadcast Tutorial](/docs/tutorials/portable-consent/broadcast)
- [Subscribe Tutorial](/docs/tutorials/portable-consent/subscribe)
- Building a request inbox in [JavaScript](/docs/tutorials/portable-consent/request-inbox) or [React Rative](/docs/tutorials/portable-consent/request-inbox-rn)

**Resources**:

- [Documentation](/docs/build/user-consent)
- [Spam](/docs/build/spam)
- [Warpcast Thread](https://warpcast.com/0xdesigner/0x52fa0e7d)

## Conclusion

Consent has really evolved through the years. It started with email, then email marketing, and was the wild west until laws like GPDR stepped in. This is new chapter in the history of consent in a new era for privacy, portability, and ownership.
