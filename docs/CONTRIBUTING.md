# Contributing to Project Merit

We love your input! We want to make contributing to this project as easy as possible, whether it's:

- General questions
- Reporting a bug
- Submitting a fix
- Recommending new features

---

- Read about our [Code Of Conduct](https://github.com/evershopcommerce/evershop/blob/main/CODE_OF_CONDUCT.md).

## Developing

To develop locally:

1. [Fork](https://help.github.com/articles/fork-a-repo/) this repository to your
   own GitHub account and then
   [clone](https://help.github.com/articles/cloning-a-repository/) it to your local device.

   ```sh
   git clone https://github.com/DanDigits/Project_Merit/tree/main
   ```

2. Create a new branch:
   ```
   git checkout -b MY_BRANCH_NAME
   ```
3. Install the dependencies with:
   ```
   npm install
   ```
4. Create a MongoDB database:
   ```
   // Project Merit uses MongoDB for database storage
   ```
5. Run installation command to create a database schema:
   ```
   npm run setup
   ```
6. Start development server:
   ```
   npm run dev
   ```
7. Building

You can build with:

```bash
npm run build
```

8. Testing the production build

```bash
npm run start
```

9. Running tests

Run the [Jest](https://jestjs.io/) unit testing

```sh
npm run test
```

10. Issue that [pull request!](https://github.com/github/docs/blob/main/CONTRIBUTING.md)

## Any contributions you make will be under the MIT License

In short, when you submit code changes, your submissions are understood to be under the same [MIT License](https://github.com/DanDigits/Project_Merit/blob/f88421459e0c64bb7acfab2ec7cf9868f19280ee/READMEObjects/MIT-License.txt) that covers the project.

## Report bugs using Github's issues

We use GitHub issues to track public bugs. Report a bug by [opening a new issue](https://github.com/DanDigits/Project_Merit/issues); it's that easy!

## Write bug reports with detail, background, and sample code

**Great Bug Reports** tend to have:

- A quick summary and/or background
  - What Project Merit version you are using
  - What NodeJs version you are using
  - What OS system you are using
  - What MongoDB version you are using
- Steps to reproduce
  - Be specific!
  - Give sample code if you can
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

## License

By contributing, you agree that your contributions will be licensed under its MIT License.
