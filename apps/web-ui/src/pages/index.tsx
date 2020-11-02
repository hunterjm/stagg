import { Layout } from 'src/components/layout'
import { FeaturesSplit } from 'src/components/sections/FeaturesSplit'
import { FeaturesTiles } from 'src/components/sections/FeaturesTiles'
import { Hero } from 'src/components/sections/Hero'
import { SignUp } from 'src/components/sections/SignUp'

const Index = () => {
  return (
    <Layout title="Best-in-class stats, coaching, matchmaking, and more | Stagg.co">
      <>
        <Hero className="illustration-section-01" />
        <FeaturesTiles />
        <FeaturesSplit
          invertMobile
          topDivider
          imageFill
          className="illustration-section-02"
        />
        {/* <Testimonial topDivider />
        <Cta split /> */}
        <SignUp />
      </>
    </Layout>
  )
}

// eslint-disable-next-line import/no-default-export
export default Index
