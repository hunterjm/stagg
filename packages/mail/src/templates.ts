export namespace confirm {
    export interface Discord {
        jwt: string
        username: string
        discord: {
            id: string
            avatar: string
            tag: string
        }
    }
    export const discord = ({ jwt, username, discord }:Discord) => {
        return `
        <!DOCTYPE html>
        <html lang="en">
          <body
            style="
              font-family: sans-serif;
              padding: 0 24px;
              max-width: 768px;
              margin: 0 auto;
              text-align: center;
            "
          >
            <header>
              <a href="https://stagg.co">
                <img
                  alt="Stagg.co"
                  src="https://i.imgur.com/TOViUqV.png"
                  style="
                    display: inline-block;
                    width: 25vw;
                    height: 25vw;
                    max-width: 96px;
                    max-height: 96px;
                    border-radius: 50%;
                    border: 1px solid #aaa;
                    box-shadow: 0 10px 10px -5px rgba(0, 0, 0, 0.75);
                  "
                />
              </a>
            </header>
            <main>
              <h3 style="font-size: 20px; text-align: center;">
                Connect your Discord account to enjoy the full suite of features
              </h3>
              <div>
                <div
                  style="
                    display: flex;
                    align-items: center;
                    flex-wrap: wrap;
                    border: 1px solid #aaa;
                    border-radius: 12px;
                    display: block;
                    height: 55px;
                    padding: 12px 24px 12px 12px;
                    text-align: center;
                    margin: auto;
                    max-width: 24em;
                  "
                >
                  <div
                    style="
                      display: inline-block;
                      position: relative;
                      height: 55px;
                      width: 55px;
                      background: url('https://i.imgur.com/eqcjZoH.png');
                      background-size: cover;
                    "
                  >
                    <img
                      alt="Discord avatar"
                      src="https://cdn.discordapp.com/avatars/${discord.id}/${discord.avatar}.webp"
                      style="
                        display: block;
                        margin: 9px auto;
                        width: 32px;
                        height: 32px;
                        border-radius: 50%;
                        border: 1px solid rgba(255, 255, 255, 0.5);
                      "
                    />
                  </div>
                  <div
                    style="
                      display: inline-block;
                      font-size: 22px;
                      position: relative;
                      top: 0;
                    "
                  >
                    <div
                      style="
                        display: block;
                        margin-top: -32px;
                        position: relative;
                        top: -20px;
                      "
                    >
                      ${discord.tag}
                    </div>
                  </div>
                </div>
        
                <div
                  style="
                    display: block;
                    text-align: center;
                    margin: auto;
                    max-height: 24em;
                  "
                >
                  <img
                    alt="arrows"
                    src="https://i.imgur.com/Oi4p8NY.png"
                    style="display: block; margin: 16px auto; width: 46px;"
                  />
                </div>
        
                <div
                  style="
                    display: flex;
                    align-items: center;
                    flex-wrap: wrap;
                    border: 1px solid #aaa;
                    border-radius: 12px;
                    display: block;
                    height: 55px;
                    padding: 12px 24px 12px 12px;
                    text-align: center;
                    margin: auto;
                    max-width: 24em;
                  "
                >
                  <div
                    style="
                      display: inline-block;
                      position: relative;
                      height: 55px;
                      width: 55px;
                    "
                  >
                    <img
                      alt="Activision account"
                      src="https://i.imgur.com/Birm17c.png"
                      style="
                        display: inline-block;
                        position: relative;
                        height: 55px;
                        width: 55px;
                      "
                    />
                  </div>
                  <div
                    style="
                      display: inline-block;
                      font-size: 22px;
                      position: relative;
                      top: 0;
                    "
                  >
                    <div
                      style="
                        display: block;
                        margin-top: -32px;
                        position: relative;
                        top: -20px;
                      "
                    >
                      ${username} 
                    </div>
                  </div>
                </div>
              </div>
        
              <p style="font-size: 16px;">
                Click the button below to connect your Discord account with your Stagg
                profile; if you did not make this request just ignore this email.
              </p>
              <div
                style="
                  text-align: center;
                  margin: 50px 0;
                  color: rgba(255, 255, 255, 0.9);
                "
              >
                <a
                  href="https://stagg.co/mail?t=${jwt}"
                  style="
                    box-shadow: 0 10px 10px -5px rgba(0, 0, 0, 0.75);
                    text-decoration: none;
                    text-align: center;
                    background: #007bff;
                    color: inherit;
                    font-size: 20px;
                    padding: 6px 32px;
                    outline: none;
                    border: 1px solid #0069d9;
                    border-radius: 4px;
                  "
                >
                  Confirm Discord
                </a>
              </div>
            </main>
            <footer>
              <p style="font-size: 12px; color: #aaa; line-height: 1.8rem;">
                This automated email was sent as a result of a user action at
                <a href="https://stagg.co">Stagg.co</a> or other provided platform(s);
                if you did not create this request simply disregard and no furher emails
                will be sent.
              </p>
            </footer>
          </body>
        </html>
        `
    }
}
