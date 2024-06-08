document.addEventListener("DOMContentLoaded", () => {
    const wax = new waxjs.WaxJS({rpcEndpoint: 'https://wax.greymass.com'});

    document.getElementById('loginButton').addEventListener('click', async () => {
        try {
            const userAccount = await wax.login();
            const message = `Login request: ${new Date().toISOString()}`;
            const signature = await wax.api.transact({
                actions: [{
                    account: 'eosio.null',
                    name: 'nonce',
                    authorization: [{
                        actor: userAccount,
                        permission: 'active',
                    }],
                    data: {
                        value: message
                    }
                }]
            }, {
                broadcast: false,
                sign: true
            });

            validateSignatureBackend(userAccount, message, signature);
        } catch (e) {
            console.error('Failed to log in', e);
        }
    });

    function validateSignatureBackend(userAccount, message, signature) {
        fetch('/api/validate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userAccount, message, signature: signature.signatures[0] })
        })
        .then(response => response.json())
        .then(data => {
            if (data.valid) {
                console.log('Signature is valid');
            } else {
                console.log('Signature is invalid');
            }
        })
        .catch(error => console.error('Error:', error));
    }
});
