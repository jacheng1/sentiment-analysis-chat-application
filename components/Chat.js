import React, { Component, Fragment } from "react";
import axios from "axios";
import Pusher from "pusher-js";
import ChatMessage from "../components/ChatMessage";

const SAD_EMOJI = [55357, 56864]; // variable for sad emoji betw. sentiment scores 55357 & 56864
const NEUTRAL_EMOJI = [55357, 56848]; // variable for neutral emoji betw. sentiment scores 55357 & 56848
const HAPPY_EMOJI = [55357, 56832]; // variable for happy emoji betw. sentiment scores 55357 & 56832

class Chat extends Component {
  state = { chats: [] }; // set initial state of component w/ 'chats' initialized to empty array; stores chat messages

  // React method that is called once component is mounted
  componentDidMount() {
    // initialize new Pusher instance using .env variables
    this.pusher = new Pusher(process.env.PUSHER_APP_KEY, {
      cluster: process.env.PUSHER_APP_CLUSTER,
      encrypted: true,
    });

    this.channel = this.pusher.subscribe("chat-room"); // subscribe to 'chat-room' channel w/ Pusher instance; allows component to receive real-time messages sent to this channel

    // binds a handler function to 'new-message' event on Pusher channel
    this.channel.bind("new-message", ({ chat = null }) => {
      const { chats } = this.state; // extract 'chats' array from component state

      chat && chats.push(chat); // if 'chat' has a value, push it to 'chats' array

      this.setState({ chats }); // update component state with modified 'chats' array
    });

    // binds a handler function to 'connected' event
    this.pusher.connection.bind("connected", () => {
      axios
        .post("http://localhost:3000/messages") // send POST request to '/messages' endpoint via Axios
        .then((response) => {
          // handle response by Axios

          const chats = response.data.messages; // extract 'messages' data from response
          this.setState({ chats }); // set state with modified 'chats' value; re-render and re-display messages
        })
        .catch((error) => {
          console.error("Error; cannot fetch message(s): ", error); // log fetch error
        });
    });
  }

  // React lifecycle method that is called before component is removed from DOM
  componentWillUnmount() {
    this.pusher.disconnect(); // disconnect Pusher connection; cleanup to avoid memory leaks
  }

  // event handler 'handleKeyUp' with event object 'event'
  handleKeyUp = (event) => {
    const value = event.target.value; // retrieve value of input field where event occurred

    // check if key code 13 ('Enter') is pressed, & shift key is not being held down
    if (event.keyCode === 13 && !event.shiftKey) {
      const { activeUser: user } = this.props; // extract 'activeUser' property from component's props and rename to 'user'

      const chat = { user, message: value, timestamp: +new Date() }; // create a 'chat' object w/ fields

      event.target.value = ""; // reset input field to empty string

      axios
        .post("http://localhost:3000/message", chat) // send 'chat' object to server via POST request to '/message' endpoint w/ Axios
        .catch((error) => {
          console.error("Error; cannot send message(s): ", error); // log send error
        });
    }
  };

  // generate 3 div's:
  // div 1: top tab w/ username
  // div 2: chat history
  // div 3: bottom chat message input field
  render() {
    return (
      this.props.activeUser && (
        <Fragment>
          <div
            className="border-bottom border-gray w-100 d-flex align-items-center bg-white"
            style={{ height: 90 }}
          >
            <h2 className="text-dark mb-0 mx-4 px-2">
              {this.props.activeUser}
            </h2>
          </div>
          <div
            className="px-4 pb-4 w-100 d-flex flex-row flex-wrap align-items-start align-content-start position-relative"
            style={{ height: "calc(100% - 180px)", overflowY: "scroll" }}
          >
            {this.state.chats.map((chat, index) => {
              // map over 'chats' array stored in the component's state
              
              const previous = Math.max(0, index - 1); // calculate index of previous chat message
              const previousChat = this.state.chats[previous]; // retrieve previous chat message from index of 'chats' array
              const position =
                chat.user === this.props.activeUser ? "right" : "left"; // if 'user' matches 'activeUser', set 'position' to 'right' side

              const isFirst = previous === index; // check if current message is the first message
              const inSequence = chat.user === previousChat.user; // check if current message is part of a sequence from the same user
              const hasDelay =
                Math.ceil(
                  (chat.timestamp - previousChat.timestamp) / (1000 * 60),
                ) > 1; // check if a delay exceeds 1 minute betw. current and previous messages

              const mood =
                chat.sentiment > 0
                  ? HAPPY_EMOJI
                  : chat.sentiment === 0
                    ? NEUTRAL_EMOJI
                    : SAD_EMOJI; // set mood to appropriate emoji depending on sentiment score of a chat message

              // render scrollable chat history
              return (
                <Fragment key={index}>
                  {(isFirst || !inSequence || hasDelay) && (
                    <div
                      className={`d-block w-100 font-weight-bold text-dark mt-4 pb-1 px-1 text-${position}`}
                      style={{ fontSize: "0.9rem" }}
                    >
                      <span className="d-block" style={{ fontSize: "1.6rem" }}>
                        {String.fromCodePoint(...mood)}{" "}
                        {/* render determined mood emoji */}
                      </span>
                      <span>{chat.user || "Anonymous"}</span>{" "}
                      {/* render name of user, or "Anonymous" if none */}
                    </div>
                  )}
                  <ChatMessage message={chat.message} position={position} />{" "}
                  {/* render chat message */}
                </Fragment>
              );
            })}
          </div>
          <div
            className="border-top border-gray w-100 px-4 d-flex align-items-center bg-light"
            style={{ minHeight: 90 }}
          >
            <textarea
              className="form-control px-3 py-2"
              onKeyUp={this.handleKeyUp}
              placeholder="Enter a chat message:"
              style={{ resize: "none" }}
            ></textarea>
          </div>
        </Fragment>
      )
    );
  }
}

export default Chat;
