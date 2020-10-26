import { AccountBox } from './AccountBox'
import { getUser } from 'src/hooks/getUser'

export const CallOfDutyAccount = () => {
    const { accounts: { callofduty } } = getUser()
    const actionStatus = callofduty?.games ? 'remove' : 'add'
    return (
        <AccountBox>
            <div className="branding">
                <i className="icon-callofduty-c filled" />
                <h6>Call of Duty</h6>
            </div>
            <div className="permissions">
                <h6>PERMISSIONS</h6>
                <ul>
                    <li><i className="icon-discord-check" /> Access your profile</li>
                    <li><i className="icon-discord-check" /> Access your match history</li>
                </ul>
            </div>
            {
                !callofduty?.games ? null : (
                    <>
                    <div className="profiles">
                        <h6>GAMES</h6>
                        <i className="icon-callofduty-bo" title="Black Ops: Cold War" />
                        <i className="icon-callofduty-mw" title="Modern Warfare" />
                        <i className="icon-callofduty-bo4" title="Black Ops 4" />
                    </div>
                    <div className="platforms">
                        <h6>PROFILES</h6>
                        <div><i className="icon-xbox" title="XBOX" /> danL</div>
                        <div><i className="icon-playstation" title="PlayStation" /> mdlindsey89</div>
                        <div><i className="icon-battlenet" title="Battle.net" /> MellowD#6997890</div>
                    </div>
                    </>
                )
            }
            <a href="/oauth/callofduty" className={`action ${actionStatus}`} />
        </AccountBox>
    )
}
