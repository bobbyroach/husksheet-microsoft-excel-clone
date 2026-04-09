import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom'
// @author Robert Roach

// import yargs, { Arguments } from 'yargs';

// // Parse command-line arguments
// const argv = yargs(process.argv.slice(2))
//   .option('url', {
//     describe: 'URL of the backend API server',
//     demandOption: true,
//     type: 'string'
//   })
//   .option('name', {
//     describe: 'Name of the user',
//     demandOption: true,
//     type: 'string'
//   })
//   .option('password', {
//     describe: 'Password of the user',
//     demandOption: true,
//     type: 'string'
//   })
//   .option('publisher', {
//     describe: 'Name of the publisher',
//     demandOption: false, // Adjust as needed
//     type: 'string'
//   })
//   .option('sheet', {
//     describe: 'Name of the sheet to open',
//     demandOption: false, // Adjust as needed
//     type: 'string'
//   })
//   .help()
//   .argv as Arguments;

// console.log(argv.url);
// console.log(argv.name);
// console.log(argv.password);
// console.log(argv.publisher);
// console.log(argv.sheet);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Router basename='/'>
      <App />
    </Router>
  </React.StrictMode>
)
