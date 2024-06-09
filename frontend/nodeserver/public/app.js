const wax = new waxjs.WaxJS({
    rpcEndpoint: 'https://wax.greymass.com'
});

//automatically check for credentials
autoLogin();

//checks if autologin is available 
async function autoLogin() {
    let isAutoLoginAvailable = await wax.isAutoLoginAvailable();
    if (isAutoLoginAvailable) {
        let userAccount = wax.userAccount;
        let pubKeys = wax.pubKeys;
        let str = 'AutoLogin enabled for account: ' + userAccount + '<br/>Active: ' + pubKeys[0] + '<br/>Owner: ' + pubKeys[1]
        document.getElementById('autologin').insertAdjacentHTML('beforeend', str);
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
        } catch (e) {
            document.getElementById('loginresponse').innerHTML = e.message;
        }
    }
}

async function sign() {
    if (!wax.api) {
        return document.getElementById('response').append('* Login first *');
    }

    try {
        const result = await wax.api.transact({
            actions: [{
                account: 'eosio',
                name: 'delegatebw',
                authorization: [{
                    actor: wax.userAccount,
                    permission: 'active',
                }],
                data: {
                    from: wax.userAccount,
                    receiver: wax.userAccount,
                    stake_net_quantity: '0.00000001 WAX',
                    stake_cpu_quantity: '0.00000000 WAX',
                    transfer: false,
                    memo: 'This is a WaxJS/Cloud Wallet Demo.'
                },
            }]
        }, {
            blocksBehind: 3,
            expireSeconds: 30
        });
        document.getElementById('response').textContent = JSON.stringify(result, null, 2)
    } catch (e) {
        document.getElementById('response').textContent = e.message;
    }
}

async function logout() {
    
    if (wax.api) {
        wax.logout();
        document.getElementById('response').textContent =' logged out from wax network';
        document.getElementById('autologin').textContent = '';
        document.getElementById('loginresponse').textContent = '';

    } else {
        document.getElementById('response').append('* Login first *');
    }

    
}