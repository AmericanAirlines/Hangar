# Hey there 👋
First off, thanks for stopping by! At American, we're passionate about building products that improve the experience of our customers through technology.

## Bugs & Feature Requests
Whether you found something that isn't working right, something that could be improved, or you'd like to suggest a feature, please start with the tasks below.

### Existing Issues
Search through this project's [issues](../../../issues) and see if your issue/suggestion is already being tracked. If you find something that matches your issue, join the conversation!

### Create an Issue
#### Bug Reports
If you didn't find what you were looking for, [create a new Bug report](../../../issues/new?template=bug_report.md) and fill in the required fields to help steer us in the right direction. We'll check it out and get back to you when we can.

#### Feature Requests
If you didn't find what you were looking for, [create a new Feature request](../../../issues/new?template=feature_request.md) with a title starting with `[Feature Request] - ` to help us differentiate it from a bug. Give us as much information as you can about the feature you'd like to see added. We'll review your request and get back to you. If we feel that it's something that fits well with our project goals, we'll add relevant labels and add any additional details we feel might be valuable to the community.

## Contributing
Interested in helping out? Awesome! Head on over to the [issues page](../../../issues) to see what we need help on. Highest priority items can always be found with the [high priority label](../../../issues?utf8=✓&q=is%3Aopen+label%3A"high+priority"+label%3A"help+wanted"+).

Need a little help to get started? We've marked some tasks with the `help wanted` and `good first issue` labels. You can find those items [here](../../../issues?utf8=✓&q=is%3Aopen+label%3A"good+first+issue"+label%3A"help+wanted"+). After you find something you can contribute to, follow these steps to make your contribution:
1. Comment on the issue, letting us know that you want to take it.
1. Fork the repo.
1. Make your changes.
1. Create a pull request when you're ready to have your code reviewed.

More info can be found in [Forking and Pull Requests](#forking-and-pull-requests) below.

### Forking and Pull Requests
When you're ready to start writing code, make sure you [fork](https://help.github.com/articles/fork-a-repo/) this repo and use that fork to make your changes. It's also helpful to turn on [branch protection](https://help.github.com/en/articles/configuring-protected-branches) for your repo's `master` branch and make sure to enforce the protection for admins as well.

#### Tracking Upstream
To track and sync the main (upstream) repo, run this command to create a remote: `git remote add upstream git@github.com:AmericanAirlines/Hangar.git`. Whenever you need to sync your current branch with the `upstream master` branch, run `git pull upstream master`.

#### Branching
When you start development, sync your local `master` with upstream using the command above, then create a new branch with `git checkout -b yourNewBranchName` and begin making your changes.

#### Committing
When you are ready to commit code, please do so on a feature/bugfix branch and commit only the files that are relevant to your change (e.g., **do not use** `git add .` or `git commit -a`). After the first time you run `npm i` to install dependencies, a git `pre-commit` will be setup which will perform several actions when you run `git commit`:
- `lint:fix` which will lint all changed files and perform corrections where possible
- `checkstyle:fix` which will checkstyle all changed files and perform corrections where possible
- `git add` which will re-add any files that were modified by these scripts
- `test` which will run through the full test suite
If the above is unable to complete because of a `lint`, `checkstyle`, or `test` error, the commit will fail and you will be required to address the problem before being able to commit successfully.

Finally, if you need to install a new dependency, please use `git add --patch package-lock.json` to add any relevant hunks from `package-lock.json` to your commit, instead of adding _all_ changes in the file.

#### Creating a Pull Request
As soon as you're ready for a code review, create a [pull request](https://help.github.com/articles/about-pull-requests/) and follow the steps below:
1. Use the `Hangar:master` branch as your PR's base branch and select your branch as the `compare` branch
1. Make sure your PR branch is as up-to-date as possible (we'll handle merge conflicts if one arises)
1. Fill out all fields suggested by the template, including links to issue(s) your PR addresses.  This will help prevent duplication of efforts. For information on how to reference issues to close them, read up on [closing issues using keywords here](https://help.github.com/articles/closing-issues-using-keywords/).
1. If it's your first contribution, make sure your PR includes a modification to `AUTHORS.md` to include your first and last name as well as your email address *or* your GitHub handle

#### Attribution
If your contribution uses code from another source, make sure you properly attribute it. Cite the source of your code where the code is used and include attribution in `ThirdPartyNotices.md`. Both of these must be present in your PR before we'll merge.
