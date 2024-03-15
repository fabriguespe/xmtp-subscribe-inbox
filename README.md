# Subscribe Inbox - Concept

This propotype shows the possibilities of building a notification focused inbox using concepts like subscribing and content types.

## Tabs

The demo consists of 4 tabs:

- **Notifications**: Inbox that renders only messages with Notification Content Type.
- **Subscriptions**: From the notification content types received, extracts the metadata and lists the senders.
- **Explore**: Fix list of recommendations to subscribe on XMTP
- **Messages**: Conventional XMTP inbox.

## Notifications

Each notification is sent via a Notification Content Type. The **Notification Content Type** class requires the following props for initialization:

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

Metadata within SendNotification.js is crucial for defining the context and appearance of notifications sent via the XMTP network.
Here's a breakdown of the metadata fields and their significance:

- `type`: Specifies the nature of the notification, helping the receiving client understand how to process it.
- `version`: Indicates the version of the notification format, ensuring compatibility between different clients.
- `name`: The sender's name, providing a human-readable identifier for the source of the notification.
- `website`: A URL to the sender's website, offering subscriber a way to learn more about the sender or the notification context.
- `description`: A brief description of the notification or the sender, adding context to the notification content.
- `avatarLogoUrl`: A URL to an image representing the sender, enhancing the visual presentation of the notification.

These metadata fields are set when creating a new conversation with the XMTP client, as shown in the snippet below:

```javascript
const conversation = await client.conversations.newConversation(subscriber, {
  conversationId:
    "notification_v1" /*may not be needed, currently mandatory field*/,
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

This metadata enriches the notification, making it more informative and visually appealing to the subscriber.

## Universal Allow/Block Prefs

[XIP-42](https://community.xmtp.org/t/xip-42-universal-allow-and-block-preferences/544) establishes `allow` and `block` permission preferences, enabling users to explicitly specify which contacts should be able to reach them and which should be blocked across all inbox apps.

**Tutorials**:

- [Broadcast Tutorial](/docs/tutorials/portable-consent/broadcast)
- [Subscribe Tutorial](/docs/tutorials/portable-consent/subscribe)

**Resources**:

- [Allow/block](/docs/build/user-consent)
- [Spam](/docs/build/spam)
- [Warpcast Thread](https://warpcast.com/0xdesigner/0x52fa0e7d)
