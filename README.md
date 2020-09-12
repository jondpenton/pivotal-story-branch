# Pivotal Tracker Story Branch Generator

[Pivotal Tracker Story Branch Generator](https://yarnpkg.com/package/pivotal-story-branch) is a tool to automatically generate a branch name for a new story in [Pivotal Tracker](https://www.pivotaltracker.com/).

## Installation

Installing this package will install a binary `psb`.

```bash
# NPM
npm install --global pivotal-story-branch

# Yarn
yarn global add pivotal-story-branch
```

## Setup

You will need to grab the API token from [your profile](https://www.pivotaltracker.com/profile) and set it to the environment variable `PIVOTAL_TRACKER_TOKEN`.

## Usage

Copy the link of your story use it like so:

```bash
psb <link>
```

### Example

```bash
$ psb https://www.pivotaltracker.com/story/show/12345678
✔ Fetched projects
✔ Fetched story
feature/transform-all-text-coming-into-#12345678
```

### Additional Info

The statuses shown by the tool are sent to stderr, while only the branch name is sent to stdout. This means you can use this tool in combination with other commands like:

```bash
# Copy to clipboard
$ psb https://www.pivotaltracker.com/story/show/12345678 | pbcopy

# Checkout new branch
$ git checkout -b $(psb https://www.pivotaltracker.com/story/show/12345678)
```

## Options

### --token (-t)

Token used for requests to Pivotal Tracker. This value will be saved for further use, so it only needs to be provided once.

## Configuration

### Environment variables

#### `PIVOTAL_TRACKER_TOKEN`

This will need to reflect the token on your profile page, as seen in the [setup](#setup) section.

#### `PIVOTAL_TRACKER_BRANCH_MAX_LENGTH`

This length is used by the tool to determine how long the branch name should be. It uses a default value of 50.
