/*********************************************************************************
 * ============================================================================= *
 * !!!                     ASSET PATHS MUST BE ABSOLUTE                      !!! *
 * ============================================================================= *
 * ie: CORRECT: <img src="http://example.com/image.png" />                       *
 *     INCORRECT: <img src="/image.png" />                                       *
 *********************************************************************************/
import { Template } from 'src/components/Template'
import { NextPageContext } from 'next'
import * as Reports from 'src/components/Reports'

const Page = ({ renderReport, reportProps }) => {
    return (
        <Template title="Call of Duty Warzone Barracks" renderReport={renderReport}>
            <div className="container text-center" style={{paddingTop: 64}}>
                <Reports.Barracks.WZ.Component { ...reportProps } />
            </div>
        </Template>
    )
}

Page.getInitialProps = async ({ store, res, req, query }:NextPageContext) => {
    const limit = query.limit ? Number(query.limit) : 0
    const skip = query.skip ? Number(query.skip) : 0
    const unoUsername = query.playerIdentifier as string
    const reportProps = await Reports.Barracks.WZ.PropsLoader({ accountIdentifier: { uno: unoUsername.replace('@', '#') } }, limit, skip)
    return { reportProps }
}

// eslint-disable-next-line import/no-default-export
export default Page
