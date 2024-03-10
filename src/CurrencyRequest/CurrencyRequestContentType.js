import { ContentTypeId } from "@xmtp/xmtp-js";

export const CurrencyRequestContentType = new ContentTypeId({
  authorityId: "evmmo.io",
  typeId: "currency-request",
  versionMajor: 0,
  versionMinor: 1,
});

export class CurrencyRequest {
  constructor(amount, chainId, token, from, to, memo) {
    this.amount = amount;
    this.chainId = chainId;
    this.token = token;
    this.from = from;
    this.to = to;
    this.memo = memo;
  }
}

export class CurrencyRequestContentTypeCodec {
  get contentType() {
    return CurrencyRequestContentType;
  }
  encode(req) {
    const { amount, chainId, token, from, to, memo } = req;
    return {
      type: CurrencyRequestContentType,
      parameters: {},
      content: new TextEncoder().encode(
        JSON.stringify({ amount, chainId, token, from, to, memo }),
      ),
    };
  }

  decode(encodedContent) {
    const decodedContent = new TextDecoder().decode(encodedContent.content);
    const { amount, chainId, token, from, to, memo } =
      JSON.parse(decodedContent);
    return new CurrencyRequest(amount, chainId, token, from, to, memo);
  }

  fallback(content) {
    return `Can’t display currency request content types. Request parameters: ${JSON.stringify(
      content,
    )}`;
  }
}
