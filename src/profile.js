import "regenerator-runtime/runtime";
import * as nearAPI from "near-api-js";

const dynamicTableHeader = "<div class='table-responsive'><table class='table table-primary table-striped table-sm'><thead><tr><th>Collective ID</th><th>Name</th><th>Type</th><th>Info URL</th></tr></thead><tbody>";
const dynamicTableItemStart = "<tr>";
const dynamicTableEntryStart = "<td>";
const dynamicTableEntryEnd = "</td>";
const dynamicTableItemEnd = "</tr>";
const dynamicTableFooter = "</tbody></table></div>";

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

window.addEventListener('load', function() {
    document.getElementById("spinnerbtn").click();
    document.getElementById("dashboardLink").addEventListener("click", function() { showTabs(0); });
    document.getElementById("ordersLink").addEventListener("click", function() { showTabs(1); });
    document.getElementById("productsLink").addEventListener("click", function() { showTabs(2); });
    document.getElementById("clientsLink").addEventListener("click", function() { showTabs(3); });
    document.getElementById("deliveryMenLink").addEventListener("click", function() { showTabs(4); });
    document.getElementById("createCol").addEventListener("click", createCollective);
    document.getElementById("addU2C").addEventListener("click", addUserToCollective);
    showTabs(0);
});

window.nearInitPromise = connect()
    .then(updateUI)
    .catch(console.error);

function updateUI() {
    window.walletAccount.account().functionCall({
        contractId: window.nearConfig.contractName,
        methodName: 'getUser',
        args: {
            userId: window.walletAccount.getAccountId()
        }
    }).then(function(response) {
        document.getElementById("closespinnerbtn").click();
        const {
            status: { SuccessValue },
        } = response;
        const result = atob(SuccessValue);
        const user = JSON.parse(JSON.parse(result));
        document.getElementById('nameDisplay').innerText = user.name.substring(0, user.name.indexOf(' '));
        document.getElementById("spinnerbtn").click();
        window.walletAccount.account().functionCall({
            contractId: window.nearConfig.contractName,
            methodName: 'getUserCollectives',
            args: {
                userId: window.walletAccount.getAccountId()
            }
        }).then(function(response) {
            document.getElementById("closespinnerbtn").click();
            const {
                status: { SuccessValue },
            } = response;
            const result = atob(SuccessValue);
            const collectives = JSON.parse(result);
            if (collectives.length == 0) document.getElementById('collectivesDisplay').innerText = "User not a member of any collectives";
            else {
                let col;
                let dynamicTable = dynamicTableHeader;
                collectives.forEach(collective => {
                    col = JSON.parse(collective);
                    dynamicTable += dynamicTableItemStart;
                    dynamicTable += dynamicTableEntryStart + col.collectiveId + dynamicTableEntryEnd;
                    dynamicTable += dynamicTableEntryStart + col.name + dynamicTableEntryEnd;
                    dynamicTable += dynamicTableEntryStart + col.type + dynamicTableEntryEnd;
                    dynamicTable += dynamicTableEntryStart + col.infoUrl + dynamicTableEntryEnd;
                    dynamicTable += dynamicTableItemEnd;
                });
                dynamicTable += dynamicTableFooter;
                document.getElementById('collectivesDisplay').innerHTML = dynamicTable;
            }
        });
    });
}

function createCollective(e) {
    e.preventDefault();
    const collectiveName = document.getElementById('cnName').value;
    const collectiveType = document.getElementById('cnType').value;
    const collectiveInfoUrl = document.getElementById('cnUrl').value;
    if (collectiveName == "" || collectiveType == "" || collectiveInfoUrl == "") {
        alert("Please fill in all fields");
        return;
    }
    if (!window.walletAccount.getAccountId()) {
        alert("Please sign in to your NEAR account.");
        return;
    }
    document.getElementById("createColSpinner").style.display = "inline-block";
    window.walletAccount.account().functionCall({
        contractId: window.nearConfig.contractName,
        methodName: 'newCollective',
        args: {
            name: collectiveName,
            type: collectiveType,
            infoUrl: collectiveInfoUrl
        }
    }).then(function(response) {
        document.getElementById("createColSpinner").style.display = "none";
        const {
            status: { SuccessValue },
        } = response;
        const result = atob(SuccessValue);
        if (result != '') {
            alert('Collective created successfully with id: ' + result);
        } else alert(response.receipts_outcome[0].outcome.logs[0]);
    });
}
//"0xa1801637ad7c66adb3f6d66469e176eb27d64a58ae291d8a1164e5b8fb5018"
function addUserToCollective(e) {
    e.preventDefault();
    const uId = document.getElementById('uId').value;
    const colId = document.getElementById('colId').value;
    if (uId == "" || colId == "") {
        alert("Please fill in all fields");
        return;
    }
    if (!window.walletAccount.getAccountId()) {
        alert("Please sign in to your NEAR account.");
        return;
    }
    document.getElementById("u2cSpinner").style.display = "inline-block";
    window.walletAccount.account().functionCall({
        contractId: window.nearConfig.contractName,
        methodName: 'addUser2Collective',
        args: {
            collectiveId: colId,
            userId: uId
        }
    }).then(function(response) {
        document.getElementById("u2cSpinner").style.display = "none";
        const {
            status: { SuccessValue },
        } = response;
        const result = atob(SuccessValue) === 'true';
        if (result == true) {
            alert('User added to collective successfully');
            updateUI();
        } else alert(response.receipts_outcome[0].outcome.logs[0]);
    });
}

function showTabs(i) {
    switch (i) {
        case 1:
            document.getElementById("dashboardLink").className = "nav-link";
            document.getElementById("ordersLink").className = "nav-link active";
            document.getElementById("productsLink").className = "nav-link";
            document.getElementById("clientsLink").className = "nav-link";
            document.getElementById("deliveryMenLink").className = "nav-link";
            document.getElementById("dashboard").style.display = "none";
            document.getElementById("orders").style.display = "block";
            document.getElementById("products").style.display = "none";
            document.getElementById("clients").style.display = "none";
            document.getElementById("deliveryMen").style.display = "none";
            break;
        case 2:
            document.getElementById("dashboardLink").className = "nav-link";
            document.getElementById("ordersLink").className = "nav-link";
            document.getElementById("productsLink").className = "nav-link active";
            document.getElementById("clientsLink").className = "nav-link";
            document.getElementById("deliveryMenLink").className = "nav-link";
            document.getElementById("dashboard").style.display = "none";
            document.getElementById("orders").style.display = "none";
            document.getElementById("products").style.display = "block";
            document.getElementById("clients").style.display = "none";
            document.getElementById("deliveryMen").style.display = "none";
            break;
        case 3:
            document.getElementById("dashboardLink").className = "nav-link";
            document.getElementById("ordersLink").className = "nav-link";
            document.getElementById("productsLink").className = "nav-link";
            document.getElementById("clientsLink").className = "nav-link active";
            document.getElementById("deliveryMenLink").className = "nav-link";
            document.getElementById("dashboard").style.display = "none";
            document.getElementById("orders").style.display = "none";
            document.getElementById("products").style.display = "none";
            document.getElementById("clients").style.display = "block";
            document.getElementById("deliveryMen").style.display = "none";
            break;
        case 4:
            document.getElementById("dashboardLink").className = "nav-link";
            document.getElementById("ordersLink").className = "nav-link";
            document.getElementById("productsLink").className = "nav-link";
            document.getElementById("clientsLink").className = "nav-link";
            document.getElementById("deliveryMenLink").className = "nav-link active";
            document.getElementById("dashboard").style.display = "none";
            document.getElementById("orders").style.display = "none";
            document.getElementById("products").style.display = "none";
            document.getElementById("clients").style.display = "none";
            document.getElementById("deliveryMen").style.display = "block";
            break;
        default:
            document.getElementById("dashboardLink").className = "nav-link active";
            document.getElementById("ordersLink").className = "nav-link";
            document.getElementById("productsLink").className = "nav-link";
            document.getElementById("clientsLink").className = "nav-link";
            document.getElementById("deliveryMenLink").className = "nav-link";
            document.getElementById("dashboard").style.display = "block";
            document.getElementById("orders").style.display = "none";
            document.getElementById("products").style.display = "none";
            document.getElementById("clients").style.display = "none";
            document.getElementById("deliveryMen").style.display = "none";
            break;
    }
    document.getElementById("sidebarMenu").classList.remove("show");
}