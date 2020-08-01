export default `<!DOCTYPE html>
<html lang="en">
<!-- https://jsfiddle.net/035mj4ta/89/ -->

<head>
  <style>
    body {
      font-family: "Open Sans Condensed", Verdana, Arial, Helvetica, sans-serif;
      background: url('https://i.imgur.com/ltrFMNl.jpg') no-repeat center center fixed;
      background-color: #0d121a;
      -webkit-background-size: cover;
      -moz-background-size: cover;
      -o-background-size: cover;
      background-size: cover;
      height: 100%;
      padding: 32px;
    }

    body::before {
      content: '';
      display: block;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.25);
    }

    footer {
      text-align: center;
    }

    footer p {
      font-size: 12px;
      color: #aaa;
      line-height: 1.8rem;
    }

    img.logo {
      display: block;
      width: 25vw;
      height: 25vw;
      margin: 0 auto;
      max-width: 96px;
      max-height: 96px;
      border-radius: 50%;
      border: 1px solid #aaa;
      box-shadow: 0 10px 10px -5px rgba(0, 0, 0, 0.75);
    }

    main {
      text-align: center;
    }

    .box {
      position: relative;
      background: rgba(0, 0, 0, 0.33);
      text-align: center;
      color: white;
      padding: 15px;
      margin: 50px;
    }

    .box::before,
    .box::after {
      content: "";
      position: absolute;
      left: 0;
      right: 0;
      bottom: 100%;
      border-left: 15px solid transparent;
      border-right: 15px solid transparent;
    }

    .box::before {
      border-bottom: 15px solid rgba(0, 0, 0, 0.33);
      border-right: 15px solid rgba(0, 0, 0, 0.33);
    }

    .box::after {
      top: 100%;
      bottom: auto;
      border-left: 15px solid rgba(0, 0, 0, 0.33);
      border-top: 15px solid rgba(0, 0, 0, 0.33);
    }

    .box hr {
      max-width: 320px;
      height: 1px;
      margin: 16px auto;
      background: -webkit-gradient(linear, 0 0, 100% 0, from(rgba(0, 0, 0, 0)), color-stop(0.5, #333333), to(rgba(0, 0, 0, 0)));
      background: -webkit-linear-gradient(left, rgba(0, 0, 0, 0), #333333, rgba(0, 0, 0, 0));
      background: -moz-linear-gradient(left, rgba(0, 0, 0, 0), #333333, rgba(0, 0, 0, 0));
      background: -o-linear-gradient(left, rgba(0, 0, 0, 0), #333333, rgba(0, 0, 0, 0));
      background: linear-gradient(left, rgba(0, 0, 0, 0), #333333, rgba(0, 0, 0, 0));
      border: 0;
    }

    .box hr::after {
      display: block;
      content: '';
      height: 30px;
      background-image: -webkit-gradient(radial, 50% 0%, 0, 50% 0%, 116, color-stop(0%, #cccccc), color-stop(100%, rgba(255, 255, 255, 0)));
      background-image: -webkit-radial-gradient(center top, farthest-side, #cccccc 0%, rgba(255, 255, 255, 0) 100%);
      background-image: -moz-radial-gradient(center top, farthest-side, #cccccc 0%, rgba(255, 255, 255, 0) 100%);
      background-image: -o-radial-gradient(center top, farthest-side, #cccccc 0%, rgba(255, 255, 255, 0) 100%);
      background-image: radial-gradient(farthest-side at center top, #cccccc 0%, rgba(255, 255, 255, 0) 100%);
    }

    .box.small {
      display: inline-block;
      width: 320px;
      height: 280px;
    }

    .box img.weapon {
      display: block;
      width: 75%;
      margin: 0 auto;
    }

    .box h1,
    .box h2,
    .box h3,
    .box h4 {
      margin: 0;
      padding: 0;
    }

    .box h3 {
      color: rgb(93, 121, 130);
    }

    .box h2 {
      color: rgb(82, 150, 255);
    }

    .box .stat {
      display: block;
      position: relative;
      height: 2.5rem;
    }

    .box.small .stat+.stat {
      margin-top: 24px;
    }

    .box .stat h2 {
      position: absolute;
      text-align: left;
      top: 0;
      right: 0;
      width: 49%;
      font-size: 1.75rem;
      margin: -3px 0 0 0;
    }

    .box .stat label {
      display: inline-block;
      position: absolute;
      left: 0;
      top: 0;
      width: 49%;
      color: #ccc;
      font-size: 1rem;
      font-weight: 500;
      text-align: right;
    }

    .box .stat label small {
      color: #888;
      font-size: 0.75rem;
      display: block;
    }
  </style>
</head>

<body>
  <header>
    <img class="logo" alt="Stagg Logo" src="https://i.imgur.com/TOViUqV.png" />
  </header>
  <main>

    <div class="box small">
      <h3 class="color-caption">
        Weapon of Choice
      </h3>
      <hr />
      <h2 class="color-highlight">
        AK-47
      </h2>
      <img class="weapon" alt="AK-47"
        src="https://www.callofduty.com/cdn/app/weapons/mw/icon_cac_weapon_{{weaponId}}.png" />
      <div class="stat">
        <h2>
          18,035
        </h2>
        <label>
          KILLS
          <small>TOTAL NUMBER</small>
        </label>
      </div>
    </div>

    <div class="box small">
      <h3 class="color-caption">
        Victory and Defeat
      </h3>
      <hr />
      <div class="stat">
        <h2>
          1,158
        </h2>
        <label>
          WINS
          <small>TOTAL NUMBER</small>
        </label>
      </div>
      <div class="stat">
        <h2>
          1,210
        </h2>
        <label>
          LOSSES
          <small>TOTAL NUMBER</small>
        </label>
      </div>
      <div class="stat">
        <h2>
          0.96
        </h2>
        <label>
          WIN/LOSS
          <small>RATIO</small>
        </label>
      </div>
    </div>

    <div class="box">
      <h3 class="color-caption">
        Kill or be Killed
      </h3>
      <hr />
      <div class="stat">
        <h2>
          27
        </h2>
        <label>
          KILLSTREAK
          <small>HIGHEST EARNED</small>
        </label>
      </div>
      <div class="stat">
        <h2>
          1,210
        </h2>
        <label>
          LOSSES
          <small>TOTAL NUMBER</small>
        </label>
      </div>
      <div class="stat">
        <h2>
          0.96
        </h2>
        <label>
          WIN/LOSS
          <small>RATIO</small>
        </label>
      </div>
    </div>

  </main>
  <footer>
    <p>
      Provided by Stagg.co
    </p>
  </footer>
</body>

</html>
`