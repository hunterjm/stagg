# Stagg.co

Built with TypeScript, NextJS, NestJS, and PostgreSQL; monorepo and package management provided by Lerna.

## Check it out!

To see the platform in action, head over to [Stagg.co](https://stagg.co); after linking your Call of Duty and Discord accounts, you'll be up and running in a matter of seconds. Feel free to [join our Discord server](https://stagg.co/discord/join) and ask questions, make suggestions, or squad up for a quick game.

If you're looking for [the best Call of Duty API Postman Collection ever](https://docs.stagg.co), it's freely available at [docs.stagg.co](https://docs.stagg.co).


## What makes this cool?

Glad you asked, there's a constantly growing list of features that separate Stagg from any other platform.

### In-Game Friend Integration

Our platform is the first to use in-game friend integrations to unlock powerful features such as LFG Automation, Cheater Blocking, and more.

#### LFG Automation

Our LFG functionality is like no other. We create voice and text channels private to players of your relative skill-level and play-style. When players join  your voice channel, the bot will instantly add you to each other's friends list with no additional steps. When you or the other player leaves, you will be removed from each other's friends list if you were not friends prior to that session.

#### Auto Blocking Cheaters

We automatically detect cheaters when match data is collected, and thanks to our in-game friend integration, we instantly block them from your lobbies.

### Developer Resources

One of the overarching goals of this project was to simplify interactions with the Call of Duty API. This is achieved by our open-source npm libraries and our streamlined API.

#### Shared Modules

As part of our development journey, several internal libraries have become publicly available npm modules. There are READMEs included with each module, but some of the most popular libraries are listed below.

```
# Call of Duty API Library
npm install @callofduty/api

# Call of Duty Asset Library
npm install @callofduty/assets
```

#### Simplified API

Don't feel like implementing the nuances of the Call of Duty API yourself? Our API is publicly available for authenticating your Activision account in a single, fluid process with average response times under 1 second.

## Contributing

Before you can contribute, you must be authenticated in the Google Cloud project. If you'd like to request access, feel free to [join our Discord](https://stagg.co/discord/join) and request developer access. Once you've been granted access, proceed with installation and setup.

This project uses yarn, so ensure you have it installed globally.

```
npm i -g yarn
```

### Installation

After cloning the repository, use yarn to install dependencies from the project root.

```
yarn install
```

This installs all root-level and nested dependencies inside of the various workspaces. Each workspace is expected to have a package name in their respective `package.json`; they must also contain a `build` npm script if using TypeScript.

### Stagg CLI

Installing the Stagg CLI tool globally can reduce your onboarding setup, database migrations, and other barriers to entry.

```
npm i -g @stagg/cli
```

Before you can use `@stagg/cli` you must authenticate with your Google account. It is important to run the command below as opposed to the generic `gcloud auth login` command as the latter will not work inside the Node runtime.

```
gcloud auth application-default login
```

### Database Connections

After gaining access to the Google Cloud project, you must use Google Cloud Proxy to connect from your local machine to the cloud database instance. Keeping a command like this handy is helpful.

```
cd C:\Dev\Tools\GCP
cloud_sql_proxy_x64 --instances=staggco:us-east1:staging=tcp:5432
```

### Shared Module Management

To get started with package management, make sure Lerna is installed globally.

```
npm i -g lerna
```

When working with shared modules, it is beneficial to symlink your local `packages/*` compiled output dirs to each nested `node_modules` that depend on them.

```
lerna link --force-local
```

Once symlinks are established, they will only need to be repeated when local packages are installed to new workspace. When making changes to the shared modules, compiling the changes will propagate the updates throughout the entire monorepo.

```
lerna run tsc
```

If publishing changes to shared modules, you will need access to the [Stagg](https://www.npmjs.com/settings/stagg/packages) and/or [CallOfDuty](https://www.npmjs.com/settings/callofduty/packages) NPM Organizations. After gaining permissions to publish to this organization, use the following command to authenticate your local client.

```
npm login --registry=https://registry.npmjs.org/ --scope=stagg
```

### Google Cloud APIs

To run this project in a new Google Cloud instance, you will need to enable the following APIs.

- CloudBuild
- Secret Manager
- App Engine Admin
- Cloud Resource Manager API

For CloudBuild to succeed, you must enable the following IAM roles for your CloudBuild service account:

```
App Engine Admin
Cloud Build Service Account
Cloud Functions Admin
Service Account User
```

You will also need to provide the `Secret Manager Secret Accessor` role to both your App Engine and Compute Engine service accounts.
