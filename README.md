# Stagg Monorepo

Built with TypeScript, Node, Express, MongoDB, React, and Next; package management provided by Lerna

## Getting Started

All steps listed below should be ran in the project root. You will only need to install dependencies to nested `/packages/*` or `/services/*` when adding a new dependency that will be isolated to that package or service, respectively.

1. [Clone the repo](https://github.com/mdlindsey/stagg)
2. `npm i -g lerna` - needed for Lerna CLI below
3. `yarn install` - installs all common and workspace dependencies
4. `lerna link --force-local` - symlinks all internal `@stagg/*` dependencies to local compiled `/packages/*/lib`
5. `lerna run tsc` - updates local symlinked packages and propogates package updates throughout repo after modification
6. Setup environment variables (see below)
7. `yarn dev` - use in the root of any `/services/*` to start the service locally
8. `lerna publish` - use to publish changes to `/packages/*` to the NPM ecosystem (see more below)

### Environment Variables

You will need a `.env` file in the root of each `/services/*` you intend to run for local development. You may use a locally-installed instance of MongoDB to test development data or you may request access to the cloud-based staging cluster. All service environments will be identical with the exception of `/services/web-ui` where we specify `NODE_ENV` in place of `PORT`.

```
PORT=8081 # change port as needed; swap with NODE_ENV=local for web-ui
JWT_SECRET=<JWT_SECRET>
MONGO_DB=<GAME_OR_FRANCHISE_NAME>
MONGO_HOST=<MONGO_HOST>
MONGO_USER=<MONGO_AUTH_USER>
MONGO_PASS=<MONGO_AUTH_PASS>
DISCORD_TOKEN=<DISCORD_BOT_TOKEN>
GMAIL_ADDRESS=<GMAIL_ADDRESS>
GMAIL_PASSWORD=<GMAIL_PASSWORD>
```

### Publishing to NPM

To publish new packages, you will need access to [Stagg NPM](https://www.npmjs.com/settings/stagg/packages). After gaining permissions to publish to this organization, use the following command to authenticate your local client.

```
npm login --registry=https://registry.npmjs.org/ --scope=stagg
```

### To do

PRs are always welcome so please feel free to fork or request contributor access.

#### Misc

- update player db schema
    - add DrDisrespect#9218550 to KGP
- use separate dbs for discord (supercedes games)

#### Web UI

- [Docs page](https://docusaurus.io/)
- [Landing page](https://open.cruip.com/)
- [MDX Storybook](https://storybook.js.org/docs/formats/mdx-syntax/) for components
- Default charts below pies/polars
    - Show avg line of KGP in background
- Cache data in IDB again
- Add tooltips to each chart to explain correlations
- Customizable dashboard with custom-built charts
- Correlation creation tool
- Bugs
    - After expanding chart, labels do not go back to hidden
    - Large expandable charts dont fit mobile screen
    - Discord landing page off-center in mobile

#### Discord Bot

- Show avg KPG line in background
- Matchmaking (auto-move to channels)
- Make X axis date/time for OT charts
- Group by time of day (eg: compare 8pm-9pm vs 12am-1am)
- Correlations
    - kills/avgLifeTime
    - damageDone/timePlayed
    - damageDone/damageTaken
- Summarize with `wz barracks` and `mp barracks`
    - Time played
    - Games played
    - Win/Loss Ratio
    - Kill/Death Ratio
    - Score Per Minute
    - Best game
        - Kills
        - Score
        - Team Wipes
        - Damage Done
        - Damage Taken
- Custom Discord roles
    - KD
    - SPM
    - Win/Top5/Top10 Rate
    - Correlations from above
- Alert when player beats previous best
    - Kills
    - Damage
    - Any win

#### Call of Duty API

- WZ/MP Profiles
- Match summaries
- Multiplayer API/types
- Some teamPlacement props are 0
- Scrape isolated summary for each match with `start=(startTime-1)*1000, end=(endTime-1)*1000`

#### Republish

- Set all packages to empty with no deps
- Unpublish all packages
- Create new repo
- Republish
- Testing and error reporting
