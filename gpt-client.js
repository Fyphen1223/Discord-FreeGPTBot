const gpt = require("./gpt-api-client.js");
const axios = require("axios");

class gpts {
  add(channelId, model) {
    this[channelId] = new channelGpt(channelId, model);
    return;
  }
}

class channelGpt {
  constructor(channelId, model) {
    this.channelId = channelId;
    this.model = model;
  }
  history = null;
  generate = async function (message) {
    let input = message.content;
    if (message.attachments) {
      for (const attachment of message.attachments.values()) {
        if (attachment.contentType.startsWith("text/plain")) {
          const res = await axios.get(attachment.url);
          input = res.data;
          this.history = `${this.history || " "} User: ${input} You: `;
          const text = await gpt.generate(this.history, this.model);
          this.history = `${this.history}${text}`;
          return text;
        }
      }
    }
    this.history = `${
      this.history ||
      "System: From now on, you have to answer questions from users."
    } User: ${input} You: `;
    const text = await gpt.generate(this.history, this.model);
    this.history = `${this.history}${text}`;
    return text;
  };
}

module.exports = { gpts, channelGpt };
