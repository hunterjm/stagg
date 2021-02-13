import { Model } from '@stagg/api'
import styled from 'styled-components'

export * as Barracks from './Barracks'

export interface ReportLazyLoadProps {
    accountIdentifier: {
        unoId?:string
        accountId?:string
        uno?:string
        xbl?:string
        psn?:string
        battle?:string
    }
}

export interface ReportAccountProps {
    _propsLoader?: any
    account: Model.Account.CallOfDuty
}

export const commaNum = (num:Number) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
export const commaToFixed = (num:Number, decimals:number=0) => {
    const rounded = num.toFixed(decimals)
    const [wholes, decs] = rounded.split('.')
    const commaWholes = wholes.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    if (!decs) {
        return commaWholes
    }
    return `${commaWholes}.${decs}`
}

export const CommandWrapper = styled.pre`
  position: absolute;
  top: -4em;
  right: 1.2em;
  background: #333;
  padding: 6px 18px;
  border-radius: 4px;
  color: #eee;

  i.icon-content_copy {
    float: right;
    position: relative;
    right: -9px;
    cursor: pointer;
    padding-left: 8px;
    border-left: 1px solid white;
    :hover {
      color: #5658dd;
    }
  }
`

export const BarracksWrapper = styled.div`
  position: relative;
  margin: auto;
  min-width: 800px;
  max-width: 800px;
  font-family: "Open Sans Condensed", Verdana, Arial, Helvetica, sans-serif;
  .box {
    position: relative;
    background: rgba(0, 0, 0, 0.33);
    text-align: center;
    color: white;
    padding: 0 15px 15px;
    margin: 8px;
  }

  .box.small {
    position: relative;
    display: inline-block;
    width: 216px;
    height: 200px;
    margin-bottom: 16px;
  }

  .box .content.inline {
    display: inline-block;
    width: 245px;
  }

  .box .content.hide-top h3,
  .box .content.hide-top hr {
    opacity: 0;
  }

  .box.small .content {
    display: block;
  }

  /* .box.small .content::after {
    content: '';
    display: block;
    width: 150px;
    height: 150px;
    position: relative;
    z-index: 0;
    top: -180px;
    background-position: center center;
    background-repeat: no-repeat; 
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
  }
  .box.small:nth-of-type(2) .content.watch::after {
    background-image: url('https://i.imgur.com/FWWCuTG.png')
  }
  .box.small:nth-of-type(3) .content.knives::after {
    background-image: url('https://i.imgur.com/RD5Hf8r.png')
  } */
  /* killstreak: https://i.imgur.com/2WubQyT.png */
  /* bullets: https://i.imgur.com/hD9oqq6.png */
  /* crosshair: https://i.imgur.com/zup8Jkv.png */
  /* knives: https://i.imgur.com/RD5Hf8r.png */
  /* watch: https://i.imgur.com/FWWCuTG.png */
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

  .box img.weapon {
    display: block;
    width: 75%;
    margin: 0 auto;
  }

  .box img.rank {
    display: block;
    width: 40%;
    margin: 16px auto;
  }

  .box h1,
  .box h2,
  .box h3,
  .box h4 {
    margin: 0;
    padding: 0;
  }

  .box h3 {
    font-size: 1.1rem;
    color: rgb(93, 121, 130);
  }

  .box h2 {
    font-size: 1.5rem;
    color: rgb(82, 150, 255);
  }

  .box .stat {
    display: block;
    position: relative;
    height: 2.5rem;
  }

  .box.small .stat+.stat {
    margin-top: 14px;
  }

  .box .stat h2 {
    position: absolute;
    text-align: left;
    top: 0;
    right: 0;
    width: 49%;
    font-size: 1.5rem;
    margin: -3px 0 0 0;
  }

  .box .stat label {
    display: inline-block;
    position: absolute;
    left: 0;
    top: 0;
    width: 49%;
    color: #ccc;
    font-size: 0.85rem;
    font-weight: 500;
    text-align: right;
  }

  .box .stat label small {
    color: #888;
    font-size: 0.65rem;
    display: block;
  }
`
