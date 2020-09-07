const imgSize = 'width: 25vw; height: 25vw; max-width: 120px; max-height: 120px;'
export default `
<div style="font-family: sans-serif; padding: 0 24px; max-width: 768px; margin: 0 auto;">
    <div style="display: block; ${imgSize} margin: 0 auto;">
        <a href="https://stagg.co">
            <img alt="StaggBot" src="https://i.imgur.com/XliDTTO.png" style="display: inline-block; ${imgSize} border-radius: 50%; border: 1px solid #aaa; box-shadow: 0 10px 10px -5px;" />
        </a>
    </div>
    <div>
        <p style="font-size: 20px; text-align: center;">Welcome to Stagg!</p>
        <p style="font-size: 16px;">Click the button below to confirm your email address; if you did not make this request just ignore this email.</p>
    </div>
    <div style="text-align: center; margin: 50px 0; color: rgba(255, 255, 255, 0.9);">
        <a href="https://stagg.co/mail?t={jwtToken}" style="box-shadow: 0 10px 10px -5px; text-decoration: none; text-align: center; background: #007bff; color: inherit; font-size: 20px; padding: 6px 32px; outline: none; border: 1px solid #0069d9; border-radius: 4px;">Confirm Email</a>
    </div>
    <p style="font-size: 12px; color: #aaa;">This automated email was sent as a result of a new account creation at <a href="https://stagg.co" style="color: inherit; text-decoration: none;">Stagg.co</a>; if you did not create this request simply disregard and no furher emails will be sent.</p>
</div>
`