<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
<p align="center">
  <h1 align="center">
    <a href="http://merit.testing.systems">Project Merit</a>
  </h1>
</p>

<p align="center">
  <a href="https://github.com/DanDigits/Project_Merit/actions" title="CI/CD">
    <img src="https://github.com/DanDigits/Project_Merit/actions/workflows/main.yml/badge.svg">
  </a>
  <a href="https://opensource.org/license/mit/">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg?style=flat" alt="License">
  </a>
</p>

<p align="center">
<img alt="Dashboard" width="950" src="/docs/img.png"/>
</p>

Explore our app with this demo account!

<p align="left">
  <a href="https://merit.testing.systems" target="_blank">
  </a>
</p>
<b>Demo user:</b>

Email: jace@test.com<br/>
Password: testingxyz

## Introduction

- [Video Introduction](https://youtu.be/GMgM7Sv90zI?si=KjG4qlxBToPAXIKL)

Project Merit is an easy tool where Air Force personnel can write, edit, and save performance reports from any device, and allows exporting narratives to download as a PDF for submission through official Air Force channels.

## Getting Started

This web application is requires Linux, and likewise being familiar with commandline. For Windows devices, the easiest way to run the application would be through [Docker](https://www.docker.com/get-started/), using the GUI (desktop program).

That being said, there are a couple ways to run this application:

1. [Docker Compose](https://docs.docker.com/compose/): The easiest way; ensure you change environment variables accordingly for the following variables, at minimum. Changing these can be found in `Dockerfile` and the `.env` file:
   | ENV Variable | Value |
   | ------------ | ----- |
   | DB_URI | MongoDB URI link |
   | NEXTAUTH_SECRET | A cipher for encrypting NextJS sessions validators |
   | NEXT_PUBLIC_NEXTAUTH_URL | Your sites address |
   | NEXTAUTH_URL | Your sites address |

   Do note if you are running the application on the local device, all that needs adding is DB_URI and NEXTAUTH_SECRET, and uncommenting the URL environment variables.

   Once done, begin the application by running in terminal `docker-compose up` at the root directory, and visit your browser at [http://localhost:3000](http://localhost:3000). See [NextJS](https://nextjs.org/docs) and [NextAuth](https://next-auth.js.org/getting-started/introduction) documentation for more information on the environment variables provided.

2. [Docker](https://www.docker.com/get-started/): Remember to change the requisite environnment variables as is shown in option 1, as this is a similar but different process. Start with running `docker build -t Merit .` at this repositories root directory, which will create an 'image' in your docker installation; type `docker images` to see more information, the image should have the tag "Merit". Afterwards, you can start a container from the 'image' by running `docker run -d --rm -p 3000:3000 --restart=unless-stopped --name Merit Merit` which will make it accessable on the same device at [http://localhost:3000](http://localhost:3000).

3. [Github Actions](https://docs.github.com/en/actions/learn-github-actions): This process is a little more difficult and is for cloud hosting the application, namely with Amazon which is how this application was done so during development. Fork/clone this repository and add the following variables to your repositories secrets:
   | ENV Variable | Value |
   | ------------ | ----- |
   | AWS_ACCESS_KEY_ID | AWS IAM User Access Key |
   | AWS_SECRET_ACCESS_KEY | AWS IAM User Secret Key |
   | DOMAIN_CERT | Your Amazon CM certificate |
   | DB_URI | MongoDB URI link |
   | NEXTAUTH_SECRET | A cipher for encrypting NextJS sessions validators |
   | NEXT_PUBLIC_NEXTAUTH_URL | Your sites address |
   | NEXTAUTH_URL | Your sites address |

   Likewise modify the .env file to add email functionality with your own email service provider and account, then make a push to your main!

   > **Note** You can run the terraform commands explictly, though please note the terraform state backend is currently not instantiated with the code here, so make sure you create it and modify the files accordingly. If you dont want a remote backend, just comment out lines 4-5 in main.tf, and the terraform.state file will be created locally in your directory; be sure to secure it as it can have credentials in plaintext.

4. [NPM](https://www.npmjs.com): Download the application and run

```
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your local browser to see the result.

## Documentation

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed based on which endpoint you would like to change. The reports endpoint can be edited in `src/app/api/reports/route.js`. Likewise, the user endpoint can be edited in `src/app/api/user/route.js`.

## System Design

Use Case Digrams

<p align="left">
<img alt="Use Case Diagram - User" width="950" src="/docs/Use%20Case%20-%20User.png"/>
</p>
<p align="left">
<img alt="Use Case Diagram - Supervisor" width="950" src="/docs/Use%20Case%20-%20Supervisor.png"/>
</p>
<p align="left">
<img alt="Use Case Diagram - Admin" width="950" src="/docs/Use%20Case%20-%20Admin.png"/>
</p>

Class Diagram

<p align="left">
<img alt="Class Diagram" width="950" src="docs/Class%20Diagram.jpg"/>
</p>

Activity Diagrams

<p align="left">
<img alt="Activity Diagram" width="950" src="/docs/Activity%20diagram.jpg"/>
</p>

## Support

### Create a bug report

If you see an error message or run into an issue, please [create bug report](https://github.com/DanDigits/Project_Merit/issues).

### Submit a feature request

If you have an idea, or you're missing a capability that would make development easier and more robust, please [Submit feature request](https://github.com/DanDigits/Project_Merit/issues).

If a similar feature request already exists, don't forget to leave a "+1".

## Contributing

Project Merit is an open-source project. We are committed to making this application a success and appreciate any contributions. Whether you are recommending new features, alerting us to bugs, or just spreading the word - we are delighted to welcome you to the Project Merit community.

Please refer to our [Contribution Guidelines](/docs/CONTRIBUTING.md) and [Code of Conduct](/docs/CodeOfConduct.md).

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Senior Design Project (Group 15)

- Daniel Cruz-Castro (Da709128@ucf.edu)
- Amber McCullah (am324232@ucf.edu)
- Mari Peele (ma973527@ucf.edu)
- Emily Tao (em265354@ucf.edu)

## License

[MIT License](LICENSE)
