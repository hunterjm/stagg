export default function (token:string) {
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
                  alt="RentSC"
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
                Here's your access code:
              </h3>
              <p style="font-size: 32px; letter-spacing: 8px; font-weight: 600; width: 280px; margin: auto; padding: 16px; border-radius: 10px; background: #eee;">
                ${token}
              </p>
              <p style="font-size: 16px;">
                Enter the access code shown above into a DM or text channel to confirm your Discord account.
              </p>
              <pre style="text-align: center; width: 256px; margin: 12px auto; padding: 8px; border-radius: 4px; background: #eee;">% confirm ${token}</pre>
            </main>
            <footer>
              <p style="font-size: 12px; color: #aaa; line-height: 1.8rem;">
                If you were not expecting this email please
                <a href="https://stagg.co/hijacked?discord=${token}">let us know</a>.
              </p>
            </footer>
          </body>
        </html>
    `
}