import { retryWithBackoff } from 'promises-tho';
import { and, equals } from 'arql-ops';

const Arweave = require('arweave/node');

const arweave = Arweave.init({ host: 'arweave.net', port: 443, protocol: 'https' });

// grab the wallet from secrets/env
const wallet = JSON.parse(process.env.WALLET_JSON);

let posts = []; 
let walletAddress = ''; 
let lastOne;

function login() {
  return new Promise(function (resolve, reject) {
    try {
      console.log("signing in...");

      arweave.wallets.jwkToAddress(wallet).then((address) => {
        walletAddress = address;

        console.log("Address: ", walletAddress);
        
        resolve("logged in");
      });

    } catch (err) {
      console.log('Error logging in: ', err);
      reject("login failed");
    }
  });
};

function getPosts() {
  return new Promise(function (resolve, reject) {
    try {
      (async () => {
        const arweave = Arweave.init({ host: 'arweave.net', port: 443, protocol: 'https' });

        const myQuery = and(
          equals('from', walletAddress),
          equals('App-Name', 'QuarantineJournal'),
          equals('TestData', 'true'),
          equals('production', 'false'),
          equals('fixedMalformed', 'true'),
          equals('deployed', 'true')
        );

        const results = await arweave.arql(myQuery);

        // If arql returns an empty array, it's gonna need a retry 
        if (results.length === 0) { throw new Error('No results') }

        for (var count = 0; count < results.length; count++) {

          const blockchainTransaction = arweave.transactions.get(results[count]).then(blockchainTransaction => {

            let returnedJson = blockchainTransaction.get('data', { decode: true, string: true });

            posts = posts.concat(returnedJson); // add returned posts to the view
            console.log("LAST RETRIEVED: ", returnedJson);
            lastOne = returnedJson; 
          });
        }
        resolve("get posts worked");
        console.log("RESOLVEDDDD");
      })()
    }
    catch (exception) {
      console.log('getting posts error: ', exception);
    }
  });
}

export function loginAndGetPosts() {
  login().then(function () {
    const getPostsWithRetries = retryWithBackoff(getPosts)

    getPostsWithRetries();
    // return lastOne;
  }); 
  console.log("HERE: ", lastOne);

}

export default loginAndGetPosts;
