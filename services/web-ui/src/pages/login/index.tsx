import { Layout } from 'src/components/layout';

import { SignUp } from '../../components/sections/SignUp';

const Login = () => {
  return (
    <Layout title="Best-in-class stats, coaching, matchmaking, and more | Stagg.co">
      <div style={{ paddingTop: '128px' }}>
        <SignUp />
      </div>
    </Layout>
  );
};

export default Login;
