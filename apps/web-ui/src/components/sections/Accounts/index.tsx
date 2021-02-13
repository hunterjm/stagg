import { DiscordAccount } from './Discord'
import { CallOfDutyAccount } from './CallOfDuty'

export const AccountBoxes = () => {
  return (
      <div className="container" style={{textAlign: 'center'}}>
          <DiscordAccount />
          <CallOfDutyAccount />
      </div>
  )
}
