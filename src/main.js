import "regenerator-runtime/runtime";
import * as nearAPI from "near-api-js";

window.addEventListener("load", () => {
    document.getElementById("signout").addEventListener("click", signOut);
    document.getElementById("signinBtn").addEventListener("click", udsignin);
    document.getElementById("signupBtn").addEventListener("click", udsignup);
});

function udsignin(e) {
    e.preventDefault();
    const email = document.getElementById("signinEmail").value;
    const psswd = document.getElementById("signinPassword").value;
    if (email == "" || psswd == "") {
        alert("Please enter your email and password");
        return;
    }
    if (!window.walletAccount.getAccountId()) {
        alert("Please sign in to your NEAR account.");
        return;
    }
    document.getElementById("signinSpinner").style.display = "inline-block";
    document.getElementById("signinBtn").disabled = true;
    document.getElementById("signinBtn").classList.add("disabled");
    window.walletAccount.account().functionCall({
        contractId: window.nearConfig.contractName,
        methodName: 'login',
        args: {
            mail: email,
            password: psswd
        }
    }).then(function(response) {
        document.getElementById("signinSpinner").style.display = "none";
        const {
            status: { SuccessValue },
        } = response;
        const result = atob(SuccessValue) === 'true';
        if (result == true) {
            alert('Account logged in successfully');
            window.location.href = './profile.html';
        } else alert(response.receipts_outcome[0].outcome.logs[0]);
        document.getElementById("signinBtn").disabled = false;
        document.getElementById("signinBtn").classList.remove("disabled");
    });
}

function udsignup(e) {
    e.preventDefault();
    const username = document.getElementById("signupName").value;
    const email = document.getElementById("signupEmail").value;
    const psswd = document.getElementById("signupPassword").value;
    if (username == "" || email == "" || psswd == "") {
        alert("Please enter your name, email and password");
        return;
    }
    if (!window.walletAccount.getAccountId()) {
        alert("Please sign in to your NEAR account.");
        return;
    }
    document.getElementById("signupSpinner").style.display = "inline-block";
    document.getElementById("signupBtn").disabled = true;
    document.getElementById("signupBtn").classList.add("disabled");
    window.walletAccount.account().functionCall({
        contractId: window.nearConfig.contractName,
        methodName: 'signin',
        args: {
            name: username,
            mail: email,
            password: psswd
        }
    }).then(function(response) {
        document.getElementById("signupSpinner").style.display = "none";
        const {
            status: { SuccessValue },
        } = response;
        const result = atob(SuccessValue) === 'true';
        if (result == true) {
            alert("Account created successfully");
            window.location.href = './profile.html';
        } else alert(response.receipts_outcome[0].outcome.logs[0]);
        document.getElementById("signupBtn").disabled = false;
        document.getElementById("signupBtn").classList.remove("disabled");
    });
}

// creates keyStore using private key in local storage
// *** REQUIRES SignIn using walletConnection.requestSignIn() ***
const keyStore = new nearAPI.keyStores.BrowserLocalStorageKeyStore();

const config = {
    networkId: "testnet",
    keyStore,
    nodeUrl: "https://rpc.testnet.near.org",
    contractName: process.env.CONTRACT_NAME,
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
        process.env.CONTRACT_NAME, {
            // name of contract you're connecting to
            viewMethods: [], // view methods do not change state but usually return a value
            changeMethods: ["login", "signin"], // change methods modify state
            sender: window.walletAccount, // account object to initialize and sign transactions.
        });
}

window.nearInitPromise = connect()
    .then(updateUI)
    .catch(console.error);

function updateUI() {
    if (!window.walletAccount.getAccountId()) {
        document.getElementById("signinNEAR").style.display = "block";
        document.getElementById("signinNEARbtn").addEventListener("click", signIn);
        document.getElementById("signupNEAR").style.display = "block";
        document.getElementById("signupNEARbtn").addEventListener("click", signIn);
        document.getElementById("signout").style.display = "none";
        document.getElementById("signout").removeEventListener("click", signOut);
    } else {
        document.getElementById("signinNEAR").style.display = "none";
        document.getElementById("signinNEARbtn").removeEventListener("click", signIn);
        document.getElementById("signupNEAR").style.display = "none";
        document.getElementById("signupNEARbtn").removeEventListener("click", signIn);
    }
}

// redirects user to wallet to authorize your dApp
// this creates an access key that will be stored in the browser's local storage
// access key can then be used to connect to NEAR and sign transactions via keyStore
const signIn = () => {
    window.walletAccount.requestSignIn(
        process.env.CONTRACT_NAME, // contract requesting access
        "urdemocracy", // optional
        window.location.href, // optional
        window.location.href // optional
    );
};

const signOut = () => {
    window.walletAccount.signOut();
    updateUI();
};