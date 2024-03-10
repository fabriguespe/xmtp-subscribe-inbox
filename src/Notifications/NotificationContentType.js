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
  constructor(subject, url, avatarLogoUrl, body, name) {
    this.subject = subject;
    this.url = url;
    this.avatarLogoUrl = avatarLogoUrl;
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
    const { subject, url, avatarLogoUrl, body, name } = notification;
    return {
      type: NotificationContentType,
      parameters: {},
      content: new TextEncoder().encode(
        JSON.stringify({ subject, url, avatarLogoUrl, body, name }),
      ),
    };
  }

  decode(encodedContent) {
    const decodedContent = new TextDecoder().decode(encodedContent.content);
    const { subject, url, avatarLogoUrl, body, name } =
      JSON.parse(decodedContent);
    return new Notification(subject, url, avatarLogoUrl, body, name);
  }

  fallback(notification) {
    return `Can’t display notification content types. Notification was ${JSON.stringify(
      notification,
    )}`;
  }
}
