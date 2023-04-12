<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/chaofan-w/slingair-project">
    <img src="./frontend/src/components/slignair_logo.png" alt="Logo" width="150" height="150">
  </a>

  <h3 align="center">  
  an online ticket website.
  </h3>

  <p align="center">
    <br />
    <a href="https://github.com/chaofan-w/slingair-project/blob/master/README.md"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://slingair.netlify.app/" style="font-weight:800">View Demo Site</a>
    ·
    <a href="https://github.com/chaofan-w/slingair-project/issues">Report Bug</a>
    ·
    <a href="https://github.com/chaofan-w/slingair-project/issues">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
        <li><a href="#data-structure">Data Structure</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

[![Product Name Screen Shot][product-screenshot]](https://gadget-go-go.netlify.app)

Sling Air is an open-source online flight ticket booking website that allows users to browse, select seats, make reservations, cancel orders. It is built using the MERN stack (MongoDB, Express, React, Node.js) and React useReducer together with Immer for state management, and Material-UI for styling.

Features:

- carts page:
  - deleting seats
- checkout process:
  - cart review
  - cart editing
- historical order review
  - cancel order
- new user signup
- user login / logout

<p align="right">(<a href="#about-the-project">back to top</a>)</p>

### Built With

- [![JavaScript][javascript.js]][javascript-url]
- [![MongoDB][mongodb.js]][mongodb-url]
- [![ExpressJS][express.js]][express-url]
- [![React][react.js]][react-url]
- [![NodeJS][node.js]][node-url]
- [![MaterialUI][materialui.js]][materialui-url]
- [![netlify][netlify.js]][netlify-url]
- [![heroku][heroku.js]][heroku-url]

<p align="right">(<a href="#about-the-project">back to top</a>)</p>

### Data Structure

- reservations:

```sh
{
"_id": "63e9720b5f86d384f55cbd11",
"email": "test@email.com",
"order": [
{
"flight": "sa231",
"seat": [
"1-C",
"1-E"
]
},
{
"flight": "sa232",
"seat": [
"1-C",
"1-D"
]
},
{
"flight": "sa233",
"seat": [
"1-C",
"1-E"
]
}
]
},

```

- customers

```sh
{
"_id": "63daff9302d5adcb62f8e1c2",
"first_name": "test",
"last_name": "test",
"email": "test@email.com",
"activated": true
},
```

- seats

```sh
{
"flightNum": "SA232",
"seats": [
{
"_id": "1-A",
"isAvailable": false
},
{
"_id": "1-B",
"isAvailable": false
},
{
"_id": "1-C",
"isAvailable": false
},
{
"_id": "1-D",
"isAvailable": false
},
{
"_id": "1-E",
"isAvailable": true
},
]
}
```

- customer profile and historical orders

```sh
{
"_id": "63daff9302d5adcb62f8e1c2",
"first_name": "test",
"last_name": "test",
"email": "test@email.com",
"activated": true,
"reservations": [
{
"_id": "63e78a87f524d5d725651dfa",
"email": "test@email.com",
"order": [
{
"flight": "sa232",
"seat": [
"1-A",
"1-B"
]
}
]
},
{
"_id": "63e86f35365ef38e3a702d32",
"email": "test@email.com",
"order": [
{
"flight": "sa231",
"seat": [
"1-A"
]
}
]
},
]
}

```

<!-- GETTING STARTED -->

## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites

- npm
  ```sh
  npm install npm@latest -g
  ```
  or
- yarn

  ```sh
  npm install yarn@latest -g

  ```

### Installation

To install this application, please follow these steps:

1. Clone the repo
   ```sh
   git clone https://github.com/chaofan-w/slingair-project.git
   ```
2. Install packages

   ```sh
   npm install
   ```

   or

   ```sh
   yarn install
   ```

3. Create a .env file in the root directory of the project and add the required environment variables. These should include your MongoDB connection string and any other secret keys that your app uses.
   ```sh
   MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
   ```

<p align="right">(<a href="#about-the-project">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#about-the-project">back to top</a>)</p>

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#about-the-project">back to top</a>)</p>

<!-- CONTACT -->

## Contact

Chaofan Wu
</br> ![gmail-shield] chaofan.w@gmail.com
</br> [![linkedin-shield]][linkedin-url]
</br> My Portfolio Site: www.chaofanwu.com

Project Link: [https://github.com/chaofan-w/slingair-project](https://github.com/chaofan-w/slingair-project)

liveDemo Link: https://slingair.netlify.app/

<p align="right">(<a href="#about-the-project">back to top</a>)</p>

[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/chaofanwu/
[product-screenshot]: ./frontend/src/components/landingPage-slingair.png
[mongodb.js]: https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white
[mongodb-url]: https://www.mongodb.com/
[react.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[react-url]: https://reactjs.org/
[heroku.js]: https://img.shields.io/badge/Heroku-430098?style=for-the-badge&logo=heroku&logoColor=white
[heroku-url]: https://www.heroku.com/
[netlify.js]: https://img.shields.io/badge/Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white
[netlify-url]: https://www.netlify.com/
[redux.js]: https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white
[redux-url]: https://redux.js.org/
[express.js]: https://img.shields.io/badge/Express.js-404D59?style=for-the-badge
[express-url]: https://expressjs.com/
[node.js]: https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white
[node-url]: https://nodejs.dev/en/
[javascript.js]: https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black
[javascript-url]: https://www.javascript.com/
[materialui.js]: https://img.shields.io/badge/Material--UI-0081CB?style=for-the-badge&logo=material-ui&logoColor=white
[materialui-url]: https://mui.com/
[gmail-shield]: https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white
[gmail-address]: chaofan.w@gmail.com
