import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { API } from 'src/api-services'
import { Layout } from 'src/components/layout'
import { DotsLoader } from 'src/components/DotsLoader'
import { HandLoader } from 'src/components/HandLoader'
import { ProfileDiffResponse } from 'src/api-services/callofduty'
import cfg from 'config/ui'

const Wrapper = styled.div`
  height: 100vh;
  text-align: center;
  padding-top: 25vh;
`
const DiffWrapper = styled.div`
  margin-top: 64px;
`
const ProgressBar = styled.span(({ ratio, percentage }:any) => `
  position: relative;
  display: inline-block;
  bottom: -4px;
  margin-left: 16px;
  height: 1.5rem;
  width: 320px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.05);
  :after {
    text-align: right;
    content: '';
    font-size: 0.5rem;
    display: block;
    position: absolute;
    z-index: 1;
    top: 0; left: 0;
    height: 100%;
    width: ${Math.min(100, ratio ? ratio * 100 : percentage)}%;
    background: green;
    transition: all 5s ease-in-out;
  }
`) as any

const SuccessMessageWrapper = styled.div`
  margin-top: 64px;
`

const CallOfDutyProfileUploadWaitingScreen = () => {
  const router = useRouter()
  const accountId = router.query.accountId as string
  const [ready, setReady] = useState(false)
  const [diff, setDiff] = useState<ProfileDiffResponse>(null)
  const refreshDiff = async () => {
    if (false) {
      // forward away when finished
    }
    const diffRes = await API.CallOfDuty.profileDiff(accountId)
    console.log('Got new diff:', diffRes)
    setDiff(diffRes)
  }
  useEffect(() => {
    try {
      refreshDiff()
    } catch(e) {
      setTimeout(refreshDiff, cfg.delay.uploading)
    }
  }, [])
  useEffect(() => {
    if (!diff) {
      return
    }
    setTimeout(refreshDiff, cfg.delay.uploading)
  }, [diff])
  const Diff:any = () => {
    const compare = {}
    let totalSaved = 0
    let totalFound = 0
    for(const game in diff?.profile?.matches) {
      compare[game] = {
        db: diff.account.matches[game].mp + diff.account.matches[game].wz,
        api: diff.profile.matches[game],
      }
      totalSaved += compare[game].db
      totalFound += compare[game].api
    }
    if (totalSaved/totalFound > cfg.upload.ready.ratio || totalSaved > cfg.upload.ready.total) {
      setReady(true)
    }
    return Object.keys(compare)
      .sort((aKey, bKey) => compare[bKey].db/compare[bKey].api - compare[aKey].db/compare[aKey].api)
      .map(game => <h3>{game.toUpperCase()} <ProgressBar ratio={compare[game].db/compare[game].api} /></h3>)
  }
  return (
    <Layout title="Uploading your Call of Duty profiles, this might take a few minutes...">
        <Wrapper>
            <HandLoader />
            {
              diff?.account ? null : <DotsLoader />
            }
            <DiffWrapper>
              <Diff />
            </DiffWrapper>
            {
              !ready ? null : (
                <SuccessMessageWrapper>
                  <p>
                    Looks like we've got enough data to get started! You're being forwarded to your new dashboard, one moment...
                    <br />
                    <small>
                      Your match history will continue to be collected in the background, but you can go ahead and start checking out some features
                    </small>
                  </p>
                </SuccessMessageWrapper>
              )
            }
        </Wrapper>
    </Layout>
  );
}

export default CallOfDutyProfileUploadWaitingScreen
