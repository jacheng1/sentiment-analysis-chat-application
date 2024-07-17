import React, { Component } from "react";

class ChatMessage extends Component {
  render() {
    const { position = "left", message, readableTimestamp } = this.props; // extract 'position', 'message' from component's props

    const isRight = position.toLowerCase() === "right"; // convert 'position' to lowercase, check if it is 'right'

    const align = isRight ? "text-right" : "text-left"; // if 'isRight' is true, set 'align' to 'text-right'
    const justify = isRight ? "justify-content-end" : "justify-content-start"; // if 'isRight' is true, set 'justify' to 'justify-content-end'

    // define object to contain inline styles for message box
    const messageBoxStyles = {
      maxWidth: "70%",
      alignSelf: isRight ? "flex-end" : "flex-start",
    };

    // define object to contain inline styles for message
    const messageStyles = {
      fontWeight: 500,
      lineHeight: 1.4,
      whiteSpace: "pre-wrap",
    };

    // define object to contain inline styles for timestamp
    const timestampStyles = {
      fontSize: "0.75rem",
      fontWeight: 350,
      lineHeight: "normal",
      whiteSpace: "pre-wrap",
      marginTop: "0.25rem",
    };

    // generate chat message bubble
    return (
      <div className={`w-100 my-1 d-flex flex-column ${justify}`}>
        <div
          className={`bg-light rounded border border-gray p-2`}
          style={messageBoxStyles}
        >
          <span
            className={`d-block text-secondary ${align}`}
            style={messageStyles}
          >
            {message}
          </span>
        </div>
        <div className={`text-muted ${align}`} style={timestampStyles}>
          {readableTimestamp}
        </div>
      </div>
    );
  }
}

export default ChatMessage;
