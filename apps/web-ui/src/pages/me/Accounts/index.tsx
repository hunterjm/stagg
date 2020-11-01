import dynamic from 'next/dynamic'
import { DiscordAccount } from './Discord'
import { CallOfDutyAccount } from './CallOfDuty'

const AccountBoxesComponent = () => {
  return (
      <div className="container" style={{textAlign: 'center'}}>
          <DiscordAccount />
          <CallOfDutyAccount />
      </div>
  )
}

export const AccountBoxes = dynamic(() => Promise.resolve(AccountBoxesComponent), {
  ssr: true
})
