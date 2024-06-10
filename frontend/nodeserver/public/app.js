const wax = new waxjs.WaxJS({
    rpcEndpoint: 'https://wax.greymass.com'
});

let transactionHash = null; // Armazenará o hash da transação

let generatedHash = ''; // Armazenará o hash gerado pelo backend

//automatically check for credentials
autoLogin();

//checks if autologin is available 
async function autoLogin() {
    let isAutoLoginAvailable = await wax.isAutoLoginAvailable();
    if (isAutoLoginAvailable) {
        let userAccount = wax.userAccount;
        let pubKeys = wax.pubKeys;
        let str = 'AutoLogin enabled for account: ' + userAccount ;
        document.getElementById('autologin').insertAdjacentHTML('beforeend', str);
        document.getElementById('button-logout').style.backgroundColor = 'orangered';
        document.getElementById('button-login').style.backgroundColor = 'lightblue';
        document.getElementById('button-sign-transaction').style.backgroundColor = 'limegreen';
        document.getElementById('response').textContent = '';
    } else {
        document.getElementById('autologin').insertAdjacentHTML('beforeend', 'Not auto-logged in');
    }
}

//normal login. Triggers a popup for non-whitelisted dapps
async function login() {
    
    if (!wax.api) {
        try {
            //if autologged in, this simply returns the userAccount w/no popup
            let userAccount = await wax.login();
            let pubKeys = wax.pubKeys;
            let str = 'Account: ' + userAccount + '<br/>Active: ' + pubKeys[0] + '<br/>Owner: ' + pubKeys[1]
            document.getElementById('loginresponse').innerHTML = str;
            document.getElementById('button-logout').style.backgroundColor = 'orangered';
            document.getElementById('button-login').style.backgroundColor = 'lightblue';
            document.getElementById('button-sign-transaction').style.backgroundColor = 'limegreen';
            document.getElementById('response').textContent = '';
        } catch (e) {
            document.getElementById('loginresponse').innerHTML = e.message;
        }
    }
}

async function sign() {
    if (!wax.api) {
        document.getElementById('response').style.color = 'red';
        return document.getElementById('response').append('* Login first *');
    }
    
    document.getElementById('response').style.color = 'green';
    document.getElementById('response').textContent = 'Sending transaction...';

    document.getElementById('transactionHash').textContent = '';
    document.getElementById('validationResult').textContent = '';

    try {

        generatedHash = await getGeneratedHash(wax.userAccount);
        console.log('generatedHash', generatedHash);

        const result = await wax.api.transact({
            actions: [{
                account: 'eosio.token',
                name: 'transfer',
                authorization: [{
                    actor: wax.userAccount,
                    permission: 'active',
                }],
                data: {
                    from: wax.userAccount,
                    to: 'rizzlesizzle',
                    quantity: '0.00000001 WAX',
                    memo: generatedHash
                },
            }]
        }, {
            blocksBehind: 3,
            expireSeconds: 30
        });
        transactionHash = result.transaction_id;
        document.getElementById('response').style.color = 'cornflowerblue';
        document.getElementById('response').textContent = JSON.stringify(result.processed.receipt.status, null, 2)
        document.getElementById('transactionHash').textContent = transactionHash; // Exibe o hash da transação
        document.getElementById('validationResult').textContent = 'Validating transaction...';
        await validateTransaction(transactionHash, wax.userAccount); // Envia o hash para validação no backend

    } catch (e) {
        document.getElementById('response').style.color = 'red';
        document.getElementById('response').textContent = e.message;
    }
}

async function logout() {
    
    if (wax.api) {
        wax.logout();
        document.getElementById('response').style.color = 'black';
        document.getElementById('response').textContent ='* logged out from wax network *';
        document.getElementById('autologin').textContent = '';
        document.getElementById('loginresponse').textContent = '';
        document.getElementById('button-login').style.backgroundColor = 'orange';
        document.getElementById('button-logout').style.backgroundColor = 'lightblue';
        document.getElementById('button-sign-transaction').style.backgroundColor = 'lightblue';

    } else {
        document.getElementById('response').style.color = 'red';
        document.getElementById('response').append('* Login first *');

    }
    
}

// Função para enviar o hash da transação para validação no backend
async function validateTransaction(transactionHash, userAccount) {
    try {
        const response = await fetch('http://localhost:8080/verifyTransaction', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ transactionHash: transactionHash, generatedHash: generatedHash, userAccount: userAccount })
        });

        if (!response.ok) {
            // Lida com erros de resposta
            const errorData = await response.json();
            throw new Error(errorData.error);
        }

        const data = await response.json();
        console.log('Success:', data.message);
        document.getElementById('validationResult').textContent = data.message;
        document.getElementById('validationResult').append('<br>' + data.account);
    } catch (error) {
        document.getElementById('validationResult').textContent = 'Error: ' + error.message;
        console.error('Error:', error);
    }
}

// Função para obter o hash gerado pelo backend
async function getGeneratedHash(userAccount) {
    const response = await fetch(`http://localhost:8080/hash?userAccount=${encodeURIComponent(userAccount)}`);
    const hash = await response.text();
    return hash;
}
