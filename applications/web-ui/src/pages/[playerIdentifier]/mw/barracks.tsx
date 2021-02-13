/*********************************************************************************
 * ============================================================================= *
 * !!!                     ASSET PATHS MUST BE ABSOLUTE                      !!! *
 * ============================================================================= *
 * ie: CORRECT: <img src="http://example.com/image.png" />                       *
 *     INCORRECT: <img src="/image.png" />                                       *
 *********************************************************************************/
import { Template } from 'src/components/Template'
import { NextPageContext } from 'next'
import { apiService } from 'src/api-service'

const Page = ({ renderReport, data }) => {
    return (
        <Template title="Barracks - Modern Warfare - Call of Duty" renderReport={renderReport}>
            <div className="container text-center" style={{paddingTop: 64}}>
                {/* <BarracksMw { ...data } /> */}
            </div>
        </Template>
    )
}

Page.getInitialProps = async ({ store, res, req, query }:NextPageContext) => {
    const unoUsername = query.playerIdentifier as string
    return { }
}

// eslint-disable-next-line import/no-default-export
export default Page
