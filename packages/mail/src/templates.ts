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
            <div class="wrapper" style="font-family: sans-serif;padding: 0 24px;max-width: 768px;margin: 0 auto;">
                <div class="logo-wrapper" style="display: block;margin: 0 auto;width: 25vw;height: 25vw;max-width: 120px;max-height: 120px;">
                    <a href="https://stagg.co">
                        <img class="logo" alt="Stagg.co" src="https://i.imgur.com/TOViUqV.png" style="display: inline-block;width: 25vw;height: 25vw;max-width: 120px;max-height: 120px;border-radius: 50%;border: 1px solid #aaa;box-shadow: 0 10px 10px -5px rgba(0, 0, 0, 0.75);">
                    </a>
                </div>
                <div class="accts-wrapper" style="text-align: center;">
                    <p class="headline" style="font-size: 20px;text-align: center;">Connect your Discord account to enjoy our full suite of features</p>
                    <div>
                        <span class="acct-link-wrapper" style="border: 1px solid #aaa;border-radius: 12px;display: block;height: 55px;padding: 12px 24px 12px 12px;text-align: center;margin: auto;max-width: 24em;">
                            <span class="acct-link-icon discord" style="display: inline-block;position: relative;height: 55px;width: 55px;">
                                <img alt="Discord avatar background" src="https://i.imgur.com/eqcjZoH.png" style="display: inline-block;height: 55px;width: 55px;position: absolute;top: 0;left: 0;z-index: 0;">
                                <img alt="Discord avatar" src="https://cdn.discordapp.com/avatars/${discord.id}/${discord.avatar}.webp" style="display: inline-block;position: absolute;top: 10px;left: 11px;z-index: 1; width: 32px;height: 32px;border-radius: 50%;border: 1px solid rgba(255, 255, 255, 0.5);">
                            </span>
                            <span class="acct-link-username" style="display: inline-block;position: relative;top: -0.9em;font-size: 22px;">
                                ${discord.tag}
                            </span>
                        </span>
                        <span class="acct-link-arrow-wrapper" style="display: block;text-align: center;margin: auto;max-width: 24em;">
                            <img alt="arrows" src="https://i.imgur.com/xhRVi0n.png" style="width: 46px;position: relative;top: 16px;transform: rotate(-90deg);margin-bottom: 24px;">
                        </span>
                        <span class="acct-link-wrapper" style="border: 1px solid #aaa;border-radius: 12px;display: block;height: 55px;padding: 12px 24px 12px 12px;text-align: center;margin: auto;max-width: 24em;">
                            <span class="acct-link-icon" style="display: inline-block;position: relative;height: 55px;width: 55px;">
                                <img alt="Activision account" src="https://i.imgur.com/Birm17c.png" style="display: inline-block;position: relative;height: 55px;width: 55px;">
                            </span>
                            <span class="acct-link-username" style="display: inline-block;position: relative;top: -0.9em;font-size: 22px;">
                                ${username}
                            </span>
                        </span>
                    </div>
                    <p style="font-size: 16px;">Click the button below to connect your Discord account with your Stagg profile; if you did not make this request just ignore this email.</p>
                </div>
                <div class="cta-wrapper" style="text-align: center;margin: 50px 0;color: rgba(255, 255, 255, 0.9);">
                    <a href="https://stagg.co/mail?t=${jwt}" class="cta-button" style="box-shadow: 0 10px 10px -5px rgba(0, 0, 0, 0.75);text-decoration: none;text-align: center;background: #007bff;color: inherit;font-size: 20px;padding: 6px 32px;outline: none;border: 1px solid #0069d9;border-radius: 4px;">
                        Confirm Discord
                    </a>
                </div>
                <p class="fine-print" style="font-size: 12px;color: #aaa;">
                    This automated email was sent as a result of a user action at <a href="https://stagg.co">Stagg.co</a> or other provided platform(s);
                    if you did not create this request simply disregard and no furher emails will be sent.
                </p>
            </div>
        `
    }
}
