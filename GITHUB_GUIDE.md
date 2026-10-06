# Git and GitHub Guide (using the Calculator project)

Use this guide to publish the calculator and to explain the process to your manager.

## 1. The big picture

- **Git** is a tool on your computer that records the history of your files. It works offline.
- **GitHub** is a website that hosts Git repositories online, so others can see, copy and collaborate on them.
- A **repository (repo)** is a project folder plus its full history.
- A **commit** is a saved snapshot with a message saying what changed and why.
- A **branch** is a separate line of work. `main` is the primary one.
- A **remote** is a copy of the repo somewhere else (GitHub is usually called `origin`).

Mental model: edit files -> **stage** the ones you want (`git add`) -> **commit** a snapshot -> **push** it to GitHub.

```
Working folder --add--> Staging area --commit--> Local history --push--> GitHub
```

## 2. One-time setup

```bash
git --version                                   # check Git is installed
git config --global user.name  "Your Name"
git config --global user.email "you@example.com"  # use the email on your GitHub account
git config --global init.defaultBranch main
```

Log in to GitHub from the terminal. Passwords no longer work for Git over HTTPS, so use one of these:

- **GitHub CLI (easiest):** install `gh`, then run `gh auth login` and follow the prompts.
- **SSH key:** `ssh-keygen -t ed25519 -C "you@example.com"`, then add the contents of `~/.ssh/id_ed25519.pub` under GitHub -> Settings -> SSH and GPG keys. Test with `ssh -T git@github.com`.

## 3. Publish the calculator (step by step)

Put the calculator files (`index.html`, `style.css`, `script.js`, `README.md`, `.gitignore`) in a folder called `calculator`.

```bash
cd calculator
git init                         # turn the folder into a repo (creates hidden .git)
git status                       # shows untracked files in red
git add .                        # stage everything (or: git add index.html)
git status                       # now shown in green = staged
git commit -m "Add simple calculator"
git log --oneline                # see your first commit
```

Create the empty repo on GitHub, then connect and push:

**Option A: GitHub website.** Click New repository, name it `calculator`, leave "Add a README" unticked, create it, then:

```bash
git remote add origin https://github.com/<your-username>/calculator.git
git branch -M main
git push -u origin main
```

**Option B: GitHub CLI (one command).**

```bash
gh repo create calculator --public --source=. --remote=origin --push
```

`-u` links your local `main` to `origin/main`, so later you can just type `git push`.

## 4. Everyday workflow

```bash
git status                    # what changed?
git diff                      # exact line changes (unstaged)
git diff --staged             # exact line changes (staged)
git add script.js             # stage specific files
git commit -m "Fix divide by zero"
git push                      # upload to GitHub
git pull                      # download and merge changes from GitHub
git log --oneline --graph     # compact history
```

Good commit messages: short, present tense, say what and why ("Handle divide by zero").

## 5. Branches and pull requests (how teams work)

```bash
git switch -c feature/square-root     # create and switch to a new branch
# ...edit files...
git add .
git commit -m "Add square root button"
git push -u origin feature/square-root
```

Then on GitHub: click **Compare & pull request**, describe the change, and ask a teammate to review. After approval click **Merge**. Then update your machine:

```bash
git switch main
git pull
git branch -d feature/square-root     # delete the finished local branch
```

Other branch commands: `git branch` (list), `git switch <name>` (move), `git merge <name>` (merge into current branch).

## 6. Undoing things

| Situation | Command |
|---|---|
| Discard unsaved edits to a file | `git restore script.js` |
| Unstage a file (keep edits) | `git restore --staged script.js` |
| Fix the last commit message (not yet pushed) | `git commit --amend -m "New message"` |
| Undo a pushed commit safely | `git revert <commit-id>` (adds a new commit that reverses it) |
| Temporarily shelve work | `git stash` then `git stash pop` |

Avoid `git reset --hard` and `git push --force` unless you fully understand them. They can permanently destroy work.

## 7. Getting someone else's repo

```bash
git clone https://github.com/<owner>/<repo>.git   # full copy with history
```

- **Fork** (button on GitHub) = your own copy of someone else's repo under your account, used to propose changes via a pull request.

## 8. Handling merge conflicts

A conflict happens when two people change the same lines. Git marks the file like this:

```
<<<<<<< HEAD
your version
=======
their version
>>>>>>> branch-name
```

Edit the file to keep what you want, delete the marker lines, then:

```bash
git add <file>
git commit
```

## 9. Useful GitHub features

- **Issues:** track bugs and tasks.
- **Pull requests:** review code before merging.
- **Actions:** run automatic checks (tests) on every push.
- **Pages:** host a static site free. For this calculator: repo -> Settings -> Pages -> deploy from branch `main`, folder `/ (root)`. You get a live link like `https://<username>.github.io/calculator/`.
- **README.md:** the front page of your repo.
- **.gitignore:** list of files Git should never track (secrets, junk, `node_modules/`).
- **Releases / tags:** mark versions, e.g. `git tag v1.0.0 && git push --tags`.

Never commit passwords, API keys or `.env` files. If you do, rotate the secret immediately; deleting the file later does not remove it from history.

## 10. Cheat sheet

| Goal | Command |
|---|---|
| Start a repo | `git init` |
| Copy a repo | `git clone <url>` |
| See changes | `git status`, `git diff` |
| Stage | `git add <file>` or `git add .` |
| Save snapshot | `git commit -m "msg"` |
| Upload | `git push` |
| Download | `git pull` |
| New branch | `git switch -c <name>` |
| Switch branch | `git switch <name>` |
| History | `git log --oneline` |
| Connect to GitHub | `git remote add origin <url>` |

## 11. Talk track for your manager

> "I built a small calculator in HTML, CSS and JavaScript and tested its logic. To publish it, I used Git for version control: I initialised a repository, staged the files, and committed them with a clear message. Then I created a repository on GitHub, linked it as the remote called `origin`, and pushed my `main` branch. From there I make changes on separate branches, open pull requests so changes can be reviewed, and merge to `main`. I also added a README for documentation and a `.gitignore` to keep unwanted files out. If we want, GitHub Pages can host it live with no extra infrastructure."

Be ready for these questions:

- **Why Git?** Full history, easy rollback, safe teamwork.
- **Why branches and pull requests?** Changes are reviewed before reaching `main`, which keeps `main` stable.
- **What if something breaks?** `git revert` undoes a change without losing history.
- **Is it secure?** Secrets stay out via `.gitignore`; access is controlled by GitHub permissions.
