import { Layout } from 'src/components/layout'
import { AccountBoxes } from './Accounts'

const Dashboard = () => {
  return (
    <Layout title="Dashboard" hideSignIn>
      <div className="illustration-section-01" />
      <div style={{textAlign: 'center'}}>
        <h2>Getting Started</h2>
        <h5>Just sign into one or more of your favorite services below.</h5>
      </div>
      <div className="container" style={{textAlign: 'center'}}>
          <AccountBoxes />
          <p style={{marginTop: 64}}><small>Don't worry, you can always add more accounts later.</small></p>
          <div className="button button-primary button-wide-mobile button-sm">Complete Registration</div>
      </div>
    </Layout>
  )
}

// eslint-disable-next-line import/no-default-export
export default Dashboard
