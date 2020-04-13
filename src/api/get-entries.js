import { retryWithBackoff } from 'promises-tho';
import { and, equals } from 'arql-ops';

const Arweave = require('arweave/node');

const arweave = Arweave.init({ host: 'arweave.net', port: 443, protocol: 'https' });

// grab the wallet from secrets/env
const wallet = JSON.parse(process.env.WALLET_JSON);

let posts = []; 
let walletAddress = ''; 

function login() {
  return new Promise(function (resolve, reject) {
    try {
      console.log("signing in....");

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
          equals('deployed', 'true')
        );

        const results = await arweave.arql(myQuery);
        console.log("Results: ", results);

        // If arql returns an empty array, it's gonna need a retry 
        if (results.length === 0) { throw new Error('No results') }

        for (var count = 0; count < results.length; count++) {

          const blockchainTransaction = arweave.transactions.get(results[count]).then(blockchainTransaction => {

            let returnedJson = blockchainTransaction.get('data', { decode: true, string: true });

            posts = posts.concat(JSON.parse(returnedJson)); // add returned posts to the view

            // Get tags
            blockchainTransaction.get('tags').forEach(tag => {
              let key = tag.get('name', { decode: true, string: true });
              let value = tag.get('value', { decode: true, string: true });
            });
          });
        }

        resolve("get posts worked");
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

    return posts; 
  });
}

export default loginAndGetPosts;
