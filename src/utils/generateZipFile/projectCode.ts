export const packageFile: string = `{
    "name": "react",
    "version": "1.0.0",
    "description": "",
    "keywords": [],
    "main": "src/index.js",
    "dependencies": {
      "@chakra-ui/core": "^1.0.0-rc.5",
      "@chakra-ui/icons": "^1.0.0-rc.3",
      "framer-motion": "3.2.1",
      "react": "16.12.0",
      "react-dom": "16.12.0",
      "react-icons": "^3.9.0",
      "react-scripts": "3.0.1"
    },
    "devDependencies": {
      "typescript": "3.3.3"
    },
    "scripts": {
      "start": "react-scripts start",
      "build": "react-scripts build",
      "test": "react-scripts test --env=jsdom",
      "eject": "react-scripts eject"
    },
    "browserslist": [
      ">0.2%",
      "not dead",
      "not ie <= 11",
      "not op_mini all"
    ]
  }`

export const htmlFile = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta
      name="description"
      content="Web site created using create-react-app"
    />
    <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
   
    <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
  
    <title>React App</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
   
  </body>
</html>
`

export const indexFile = `
import React from "react";
import ReactDOM from "react-dom";

import App from "./App";

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

`
