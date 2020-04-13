const Arweave = require('arweave/node');

const arweave = Arweave.init({ host: 'arweave.net', port: 443, protocol: 'https' });

// grab the wallet from secrets/env
const wallet = process.env.WALLET_JSON;

export async function saveToBlockchain(post) {
  const transaction = await arweave.createTransaction({
    data: JSON.stringify(post),
  }, wallet);

  transaction.addTag('App-Name', 'QuarantineJournal');
  transaction.addTag('App-Version', '1.0.0');
  transaction.addTag('TestData', 'true');
  transaction.addTag('production', 'false');
  transaction.addTag('deployed', 'true');
  transaction.addTag('ISO-Time', post.isoDateTime);
  transaction.addTag('loc-lat', post.locLat);
  transaction.addTag('loc-long', post.locLong);

  await arweave.transactions.sign(transaction, wallet);
  const response = await arweave.transactions.post(transaction);

  if (response.status >= 200 && response.status < 300) {
    return { transactionId: transaction.id };
  }
  // eslint-disable-next-line no-console
  console.error(`Error posting to Arweave, ${response.status}`);
  throw new Error(`Error posting ${response.status}`);
}

export default saveToBlockchain;
