import Arweave from 'arweave/node';

const arweave = Arweave.init({ host: 'arweave.net', port: 443, protocol: 'https' });

// grab the wallet from secrets/env
const wallet = JSON.parse(process.env.WALLET_JSON);

export async function saveToBlockchain(post) {

    let transaction = await arweave.createTransaction({
        data: JSON.stringify(post),
    }, wallet);

    transaction.addTag('App-Name', 'QuarantineJournal')
    transaction.addTag('App-Version', '1.0.0')
    transaction.addTag('TestData', 'false')
    transaction.addTag('production', 'true')
    transaction.addTag('deployed', 'true')
    transaction.addTag('ISO-Time', post.isoDateTime)
    transaction.addTag('loc-lat', post.locLat)
    transaction.addTag('loc-long', post.locLong)

    await arweave.transactions.sign(transaction, wallet);
    const response = await arweave.transactions.post(transaction);

    if (response.status >= 200 && response.status < 300) {
        return { transactionId: transaction.id }
    }
    console.error(`Error posting to Arweave, ${resp.status}`);
    throw new Error(`Error posting ${resp.status}`);
}