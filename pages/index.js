import React, { Component } from "react";
import Layout from "../components/Layout";
import Chat from "../components/Chat";

class IndexPage extends Component {
  state = { user: null, fadeIn: false }; // set initial state of component w/ 'user' property initialized to null

  // event handler 'handleKeyUp' with event object 'event'
  handleKeyUp = (event) => {
    // check if key released was key code 13 ('Enter')
    if (event.keyCode === 13) {
      const user = event.target.value; // retrieve value of input field where event occurred

      this.setState({ user, fadeIn: true }); // set state with entered 'user' value

      console.log("Current user: ", user);
      console.log("Fade-in effect triggered.");
    }
  };

  render() {
    const { user, fadeIn } = this.state; // extract 'user' property from component state

    // define variable to contain CSS styles for input element
    const nameInputStyles = {
      background: "transparent",
      color: "#999",
      border: 0,
      borderBottom: "1px solid #666",
      borderRadius: 0,
      fontSize: "3rem",
      fontWeight: 500,
      boxShadow: "none !important",
    };

    // generate landing page
    return (
      <Layout pageTitle="Sentiment Analysis Chat">
        <main className="container-fluid position-absolute h-100 bg-dark">
          <div className="row position-absolute w-100 h-100">
            <section className="col-md-6 d-flex flex-row flex-wrap align-items-center align-content-center px-5">
              <div className="px-5 mx-5">
                <span
                  className={`d-block w-100 h1 text-light ${fadeIn ? "fade-in" : ""}`}
                  style={{ marginTop: -50 }}
                >
                  {user ? (
                    <span>
                      <span style={{ color: "#999" }}>Welcome,</span>
                      {" " + user + "."}
                    </span>
                  ) : (
                    `What is your name?`
                  )}
                </span>
                {!user && (
                  <input
                    type="text"
                    className="form-control mt-3 px-3 py-2"
                    onKeyUp={this.handleKeyUp}
                    autoComplete="off"
                    style={nameInputStyles}
                  />
                )}
              </div>
            </section>
            <section className="col-md-6 position-relative d-flex flex-wrap h-100 align-items-start align-content-between bg-white px-0">
              {user && <Chat activeUser={user} />}
            </section>
          </div>
        </main>
      </Layout>
    );
  }
}

export default () => <IndexPage />;
