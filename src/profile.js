import "regenerator-runtime/runtime";
import * as nearAPI from "near-api-js";
// creates keyStore using private key in local storage
// *** REQUIRES SignIn using walletConnection.requestSignIn() ***
const keyStore = new nearAPI.keyStores.BrowserLocalStorageKeyStore();

const config = {
    networkId: "testnet",
    keyStore,
    nodeUrl: "https://rpc.testnet.near.org",
    contractName: "dev-1649010639406-39669096907820",
    walletUrl: "https://wallet.testnet.near.org",
    helperUrl: "https://helper.testnet.near.org",
    explorerUrl: "https://explorer.testnet.near.org",
};
window.nearConfig = config;

// Connects to NEAR and provides `near`, `walletAccount` and `contract` objects in `window` scope
async function connect() {
    // Initializing connection to the NEAR node.
    window.near = await nearAPI.connect(Object.assign(nearConfig, { deps: { keyStore: new nearAPI.keyStores.BrowserLocalStorageKeyStore() } }));

    // Needed to access wallet login
    window.walletAccount = new nearAPI.WalletConnection(window.near);

    // Initializing our contract APIs by contract name and configuration.
    window.contract = new nearAPI.Contract(
        window.walletAccount, // the account object that is connecting
        "dev-1649010639406-39669096907820", {
            // name of contract you're connecting to
            viewMethods: [], // view methods do not change state but usually return a value
            changeMethods: ["login", "signin"], // change methods modify state
            sender: window.walletAccount, // account object to initialize and sign transactions.
        });
}