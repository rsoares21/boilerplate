let session = null;

let apiTimeout;
let apiForSuspiciousActivityTimeout;
let miningApiTimeout;

var curr_shares_balance = 0;
var curr_mining_power;
var curr_energy_credits;
var curr_ram;
var curr_cpu_power = 0;
var curr_cpu_mining_power = 0;
var curr_firewall_version = 0;
var curr_burp_version = 0;
var curr_firewall_id;
var curr_burp_id;
var curr_crunch_id;
var curr_hackhammer_id;
var curr_cpu_id;
var curr_crunch_version;
var curr_ccbt_balance = '0.0000';

var last_shares_balance = 0;
var last_curr_ccbt_balance = 0;

var semaphore = false;
var isFirstRun = true;


var curr_cpu_name = "";
var user_staked_items = [];
var user_stakeable_items = [];
var timers_sysinfo = [];
var sharesCounterStarted = false;
var sharesCounter = 0;
var totalSharesCounter = 0.000000;

const availableCommands = ['help', 'startapi', 'stopapi', 'login', 'logout', 'login-anchor', 'chat', 'chat close', '__mine', '__mine stop', 'upgrade', 'update', 'claim', 'claim all', 'sysinfo', 'stake nft',
    'burp', 'burp check', 'crunch', 'crunch check', 'reload', 'flush', 'miners', 'swinfo', 'register', 'swap shares', 'swap tokens', 'shop', 'sniff', 'buy energy', 'botnetwit', 'pvebotnet', 'botnetwit list', 'pvebotnetget'];

const commandHistory = [];
let historyIndex = 0;

//rpcEndpoint = 'testnet.wax.pink.gg';
rpcEndpoint = 'wax-test.tacocrypto.io';
//rpcEndpoint = 'test.wax.eosusa.io';
//rpcEndpoint = 'api.waxtest.alohaeos.com';
//rpcEndpoint = 'testnet.waxsweden.org';

async function processInput() {
    const input = terminalInput.value.trim();
    if (input === '') {
        showPrompt(true);
        return;
    }

    if (input.toLowerCase() === 'startapi') {
        updateTerminalContent(input, 'recognized');
        await updateTerminalContent('API calls started.', 'systemoutput');
        startApi();
    } else if (input.toLowerCase() === 'stopapi') {
        updateTerminalContent(input, 'recognized');
        await updateTerminalContent('stopping API calls...', 'systemoutput');
        await stopApi();
        await updateTerminalContent('API calls stopped!', 'systemoutput');
    } else if (input.toLowerCase() === 'help') {
        await updateTerminalContent(input, 'recognized');
        //await updateTerminalContent('Available commands:<br>', 'recognized');
        //await updateTerminalContent('<span style="color:Orange">First Steps</span><br>', 'systemoutput');
        await updateTerminalContent('<span style="color:red">crunch check</span><span style="color:crimson"> ->Check running crunch attempts</span><br>', 'systemoutput');
        await updateTerminalContent('<span style="color:red">crunch HOST</span><span style="color:crimson"> ->Crack hosts network and install trojan</span><br>', 'systemoutput');
        await updateTerminalContent('<span style="color:red">burp check</span><span style="color:crimson"> ->Check running burp attempts</span><br>', 'systemoutput');
        await updateTerminalContent('<span style="color:red">burp HOST</span><span style="color:crimson"> ->Searchs leaks in specified host network</span><br>', 'systemoutput');
        await updateTerminalContent('<span style="color:Orange">Hack Actions</span><br>', 'systemoutput');
        await updateTerminalContent('<span style="color:LightSkyBlue">update firewall|burp|crunch</span><span style="color:dodgerblue"> Patches software to a newer version</span><br>', 'systemoutput');
        await updateTerminalContent('<span style="color:LightSkyBlue">upgrade ASSET_ID LEVEL</span><span style="color:dodgerblue"> Upgrades hardware to specified level</span><br>', 'systemoutput');
        await updateTerminalContent('<span style="color:LightSkyBlue">claim [ASSET_ID]</span><span style="color:dodgerblue"> Claims rewards of assets list</span><br>', 'systemoutput');
        await updateTerminalContent('<span style="color:LightSkyBlue">miners </span><span style="color:dodgerblue"> Prints local mining activities</span><br>', 'systemoutput');
        await updateTerminalContent('<span style="color:LightSkyBlue">swinfo </span><span style="color:dodgerblue"> Shows installed softwares</span><br>', 'systemoutput');
        await updateTerminalContent('<span style="color:LightSkyBlue">sysinfo</span><span style="color:dodgerblue"> System main hardwares info </span><br>', 'systemoutput');
        //await updateTerminalContent('<span style="color:Orange">Game Neutral Actions</span><br>', 'systemoutput');
        await updateTerminalContent('<span style="color:lime">stake close <PAGE_NUMBER></span><span style="color:green"> Closes staking window</span><br>', 'systemoutput');
        await updateTerminalContent('<span style="color:lime">stake nft <PAGE_NUMBER></span><span style="color:green"> Pick assets to transfer into game</span><br>', 'systemoutput');
        //await updateTerminalContent('startapi - Start API calls<br>', 'systemoutput');
        //await updateTerminalContent('stopapi - Stop API calls<br>', 'systemoutput');
        //await updateTerminalContent('logout - Log out of WAX Cloud Wallet<br>', 'systemoutput');
        await updateTerminalContent('<span style="color:lime">login-anchor</span><span style="color:green"> Log in with Anchor Wallet</span><br>', 'systemoutput');
        //await updateTerminalContent('login - Log in to WAX Cloud Wallet<br>', 'systemoutput');

    } else if (input.toLowerCase() === 'login') {
        updateTerminalContent(input, 'recognized');
        waxLogin();
    } else if (input.toLowerCase() === 'logout') {
        updateTerminalContent(input, 'recognized');
        waxLogout();
    } else if (input.toLowerCase() === 'login-anchor' || input.toLowerCase() === 'la' || input.toLowerCase() === 'login') { // TODO remove 'login'

        updateTerminalContent(input, 'recognized');
        const identity = await link.login('codecombat')
        session = identity.session;
        //updateTerminalContent('Welcome ' + session.auth, 'systemoutput');
        updateBothDivsWithUserInfo();
        terminalInput.focus(); // Ensure focus remains on the input field
        //if (session.auth.actor) startApiForSuspiciousActivity();

    } else if (input === 'scan') {

        updateTerminalContent(input, 'recognized');

        const topDiv = document.getElementById('top-div-scan');
        const topDivIframe = document.getElementById('top-div-scan-iframe');
        topDiv.style.transition = 'height 1s ease';
        topDiv.style.height = '450px';
        topDivIframe.style.height = '450px';
        topDivIframe.style.width = '100%';

    } else if (input === 'scan close') {
        const topDiv = document.getElementById('top-div-scan-scan');
        const topDivIframe = document.getElementById('top-div-scan-iframe');
        topDiv.style.transition = 'height 1s ease';
        topDiv.style.height = '0px';
        topDivIframe.style.height = '0px';
        updateTerminalContent(input, 'recognized');

    } else if (input === 'chat') {
        updateTerminalContent(input, 'recognized');
        const topDiv = document.getElementById('top-div-chat');
        topDiv.style.height = '350px';
        topDiv.style.transition = 'height 1s ease';

    } else if (input === 'chat close') {
        updateTerminalContent(input, 'recognized');
        const topDiv = document.getElementById('top-div-chat');
        topDiv.style.height = '0px';
        topDiv.style.transition = 'height 1s ease';

    } else if (input.toLowerCase() === 'cls') {
        terminalContent.innerHTML = '';
    } else if (input.toLowerCase() === 'mine') {
        updateTerminalContent(input, 'recognized');
        startMiningApi();
    } else if (input.toLowerCase() === 'mine stop') {
        updateTerminalContent(input, 'recognized');
        stopMiningApi();
    } else if (input.toLowerCase() === 'sysinfo') {
        updateTerminalContent(input, 'recognized');
        sysinfo();
        updateBothDivsWithUserInfo();
    } else if (input.toLowerCase() === 'swinfo') {
        updateTerminalContent(input, 'recognized');
        swinfo(false);
        updateBothDivsWithUserInfo();

    } else if (input.toLowerCase() === 'ls -la' || input.toLowerCase() === 'ls') {
        updateTerminalContent(input, 'recognized');
        await sysinfo();
        await swinfo(false);
        //updateBothDivsWithUserInfo();

    } else if (input.toLowerCase() === 'miners') {
        updateTerminalContent(input, 'recognized');
        miners();
        updateBothDivsWithUserInfo();

    } else if (input.toLowerCase() == 'claim all') {
        updateTerminalContent(input, 'recognized');
        claimAll();

    } else if (input.toLowerCase().startsWith('claim ')) {
        updateTerminalContent(input, 'recognized');
        claimAssets(input);

    } else if (input.toLowerCase().startsWith('upgrade ')) {
        updateTerminalContent(input, 'recognized');
        upgradeAssets(input);
    } else if (input.toLowerCase() == ('update firewall')) {
        if (curr_firewall_id === undefined) {
            await swinfo(true);
        }
        updateTerminalContent(input, 'recognized');
        updateAssets(curr_firewall_id);
    } else if (input.toLowerCase() == ('update burp')) {
        if (curr_burp_id === undefined) {
            await swinfo(true);
        }
        updateTerminalContent(input, 'recognized');
        updateAssets(curr_burp_id);

    } else if (input.toLowerCase() == ('update crunch')) {
        if (curr_crunch_id === undefined) {
            await swinfo(true);
        }
        updateTerminalContent(input, 'recognized');
        updateAssets(curr_crunch_id);

    } else if (input.toLowerCase() == ('update hackhammer')) {
        if (curr_hackhammer_id === undefined) {
            await swinfo(true);
        }
        updateTerminalContent(input, 'recognized');
        updateAssets(curr_hackhammer_id);

    } else if (input.toLowerCase().startsWith('stake nft')) {
        updateTerminalContent(input, 'recognized');
        const topDiv = document.getElementById('top-div-stake');
        topDiv.style.height = '520px';
        topDiv.style.transition = 'height 1s ease';
        updateTopDivWithStakeInfo(input);
    } else if (input === 'stake close') {
        const topDiv = document.getElementById('top-div-stake');
        topDiv.style.height = '0px';
        topDiv.style.transition = 'height 1s ease';
        topDiv.innerHTML = "";
        user_stakeable_items = [];
        updateTerminalContent(input, 'recognized');

    } else if (input.toLowerCase().startsWith('unstake ')) {
        updateTerminalContent(input, 'recognized');
        const topDiv = document.getElementById('top-div-stake');
        topDiv.style.height = '0px';
        topDiv.style.transition = 'height 1s ease';
        topDiv.innerHTML = "";
        user_stakeable_items = [];
        unstakenft(input);

    } else if (input.toLowerCase() == ('crunch check')) {
        updateTerminalContent(input, 'recognized');
        await crunchcheck();

    } else if (input.toLowerCase().startsWith('crunch ')) {
        updateTerminalContent(input, 'recognized');
        await crunch(input);


    } else if (input == ('burp check')) {
        updateTerminalContent(input, 'recognized');
        await burpcheck();

    } else if (input.toLowerCase().startsWith('burp ')) {
        updateTerminalContent(input, 'recognized');
        await burp(input);

    } else if (input.toLowerCase() == 'pvebotnet') {
        updateTerminalContent(input, 'recognized');
        console.log('curr_cpu_id:' + curr_cpu_id);
        if (curr_cpu_id === undefined) await sysinfo();
        await pvebotnet();

    } else if (input.toLowerCase() == 'pvebotnetget') {
        updateTerminalContent(input, 'recognized');
        await pvebotnetget();

    } else if (input.toLowerCase() == 'botnetwit list') {
        updateTerminalContent(input, 'recognized');
        await botnetwitList(input);


    } else if (input.toLowerCase().startsWith('botnetwit ')) {
        updateTerminalContent(input, 'recognized');
        await botnetwit(input);

    } else if (input.toLowerCase() == ('register')) {
        updateTerminalContent(input, 'recognized');
        await register(input);

    } else if (input.toLowerCase().startsWith('swap shares ')) {
        updateTerminalContent(input, 'recognized');
        await swapSharesCCBT(input);
        updateBothDivsWithUserInfo();

    } else if (input.toLowerCase().startsWith('swap tokens ')) {
        updateTerminalContent(input, 'recognized');
        await swapCCBTShares(input);
        updateBothDivsWithUserInfo();

    } else if (input.toLowerCase().startsWith('buy energy ')) {
        updateTerminalContent(input, 'recognized');
        buyEnergy(input);
        updateBothDivsWithUserInfo();

    } else if (input.toLowerCase() === 'shop') {

        updateTerminalContent(input, 'recognized');
        const topDiv = document.getElementById('top-div-shop');
        var shop_container = document.getElementById("shop_container");


        //const topDivIframe = document.getElementById('top-div-shop-iframe');

        if (topDiv.style.height == '580px') {
            topDiv.style.height = '0px';
            topDiv.innerHTML = '';
        } else {
            updateShopPage();
            topDiv.innerHTML = '<div id="shop_container" class="card-container"></div>';
            topDiv.style.height = '580px';
            shop_container.style.height = '580px';
        }

        topDiv.style.transition = 'height 1s ease-in-out';
        //topDivIframe.style.transition = 'height 1s ease-in-out';

    } else if (input.toLowerCase() === 'x') {

        updateTerminalContent(input, 'recognized');
        const topDiv = document.getElementById('buttons-div');

        if (topDiv.style.height == '180px') {
            topDiv.style.height = '0px';
        } else {
            topDiv.style.height = '180px';
        }

        topDiv.style.transition = 'height 1s ease-in-out';

    } else if (input.toLowerCase() === 'flush') {
        //timers_sysinfo.splice(0, timers_sysinfo.length);
        // remove o timer
        timers_sysinfo = timers_sysinfo.filter(function (timer) {
            return timer.id !== ('timer_' + asset.data.asset_id);
        })


    } else if (input.toLowerCase() === 'reload') {
        location.reload();

    } else if (input.toLowerCase() === 'sniff') {
        updateTerminalContent(input, 'recognized');
        updateTerminalContent('sniffing public ccnetwork...', 'systemoutput');
        startApiForSuspiciousActivity()

    } else {
        updateTerminalContent(input, 'unrecognized');
    }
    showPrompt(true);
    terminalContent.scrollTop = terminalContent.scrollHeight;
}


// Display the prompt and set focus to the input field
function showPrompt(clearInput) {
    if (clearInput) terminalInput.value = '';
    terminalInput.focus();
    terminalContent.scrollTop = terminalContent.scrollHeight;

    var isMobile = /Mobi/i.test(navigator.userAgent)
    console.log('ismobile:' + isMobile);

    if (isMobile) {
        var element1 = document.querySelector('#terminal-container');
        element1.style.fontSize = '28px';
        var element2 = document.querySelector('#terminal-input');
        element2.style.fontSize = '30px';

    }

}
// Handle the Enter key event
function handleEnterKey(event) {
    if (event.keyCode === 13) {
        commandHistory.push(terminalInput.value.trim());
        historyIndex = commandHistory.length;
        processInput();
    }
}
// Autocomplete available commands when typing
function handleAutocomplete(event) {
    const input = terminalInput.value.trim();
    const matchingCommands = availableCommands.filter((command) => command.startsWith(input));

    if (matchingCommands.length === 1 && event.keyCode === 9) {
        event.preventDefault();
        terminalInput.value = matchingCommands[0];
        terminalInput.focus(); // Ensure focus remains on the input field
    } else if (event.keyCode === 9) {
        event.preventDefault(); // Prevent the default behavior of the Tab key when there are no matching commands
    }
}

// Set the cursor position to the end of the input field
function setCursorPositionToEnd() {
    const length = terminalInput.value.length;
    terminalInput.setSelectionRange(length, length);
}

async function updateTerminalContent(content, recognition) {
    return new Promise(async (resolve) => {
        const outputLine = document.createElement("div");
        outputLine.classList.add("terminal-line");
        outputLine.classList.add(recognition);
        outputLine.innerHTML = "<span>" + content + "</span>";

        // Add random delay between 100ms and 500ms if not recognized command
        let delay = Math.floor(Math.random() * 20) + 10;
        if (recognition === "recognized") {
            delay = 5;
        }

        await setTimeout(() => {
            terminalContent.prepend(outputLine);
            terminalContent.scrollTop = terminalContent.scrollHeight;
            resolve();
        }, delay);

        if (content.includes('Mining activity detected.')) showPrompt(false); else showPrompt(true);
    });

    //terminalInput.focus(); // Ensure focus remains on the input field
    //showPrompt(true);
}

async function callApi() {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    const json = await response.json();

    updateTerminalContent(JSON.stringify(json[0].name), 'miningoutput');

    if (apiTimeout) {
        apiTimeout = setTimeout(callApi, 5000);
    }
}

async function callWaxApiForSuspiciousActivity() {
    //const response = await fetch('https://jsonplaceholder.typicode.com/users');
    //const json = await response.json();

    var myHeaders = new Headers();
    myHeaders.append("accept", "*/*");

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch("https://waxtest.eu.eosamsterdam.net/v2/history/get_actions?account=codecombatcc&filter=codecombatcc%3Aclaim&skip=0&limit=40&sort=desc", requestOptions)
        .then(response => response.json())
        .then(result => {

            var suspicioususer = '';
            var suspicioususer2 = '';
            var suspicioususer3 = '';
            //console.log('suspicioususer:'+suspicioususer)
            console.log('result.actions:' + JSON.stringify(result.actions));

            result.actions.forEach(claim => {
                console.log('claim.act.data.player:' + claim.act.data.player)

                if (claim.act.data.player != session.auth.actor) {

                    if (suspicioususer == '' && claim.act.data.player != suspicioususer2 && claim.act.data.player != suspicioususer3) {
                        suspicioususer = claim.act.data.player;
                    }

                    if (suspicioususer2 == '' && claim.act.data.player != suspicioususer && claim.act.data.player != suspicioususer3) {
                        suspicioususer2 = claim.act.data.player;
                    }

                    if (suspicioususer3 == '' && claim.act.data.player != suspicioususer && claim.act.data.player != suspicioususer2) {
                        suspicioususer3 = claim.act.data.player;
                    }


                }

            });

            console.log('suspicioususer:' + suspicioususer)
            console.log('suspicioususer2:' + suspicioususer2)
            console.log('suspicioususer3:' + suspicioususer3)

            if (suspicioususer != '' && suspicioususer2 != '' && suspicioususer3 != '') {
                var html = `<span style="color:grey">CHAT </span>CCNetwork <span style="color:grey">> Mining activity detected. Hosts </span><span style="color:gold">${suspicioususer}, ${suspicioususer2}, ${suspicioususer3}</span>`;
                updateTerminalContent(html, 'miningoutput');
                stopApiForSuspiciousActivity()
            }

        }).catch(error => console.log('error', error));

    if (apiForSuspiciousActivityTimeout) {
        apiForSuspiciousActivityTimeout = setTimeout(callWaxApiForSuspiciousActivity, 3000);
    }
}

function startApiForSuspiciousActivity() {
    if (!apiForSuspiciousActivityTimeout) {
        apiForSuspiciousActivityTimeout = setTimeout(callWaxApiForSuspiciousActivity, 3000);
    }
}


function startApi() {
    if (!apiTimeout) {
        apiTimeout = setTimeout(callApi, 5000);
    }
}

function stopApi() {
    return new Promise((resolve) => {
        clearTimeout(apiTimeout);
        apiTimeout = null;
        resolve();
    });
}

function stopApiForSuspiciousActivity() {
    return new Promise((resolve) => {
        clearTimeout(apiForSuspiciousActivityTimeout);
        apiForSuspiciousActivityTimeout = null;
        resolve();
    });
}


async function callMiningApi() {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    const json = await response.json();

    if (miningApiTimeout) {
        updateTerminalContent('cpu mining at 20kh/s...', 'miningoutput');
        miningApiTimeout = setTimeout(callMiningApi, 9000);
    }
}

async function startMiningApi() {
    if (!miningApiTimeout) {
        setTimeout(updateTerminalContent('Mining started.', 'miningoutput'), 1000);
        miningApiTimeout = setTimeout(callMiningApi, 1000);
    }
}

function stopMiningApi() {
    return new Promise((resolve) => {
        clearTimeout(miningApiTimeout);
        miningApiTimeout = null;
        resolve();
    });
}

function sysinfo() {

    if (session == null) {
        updateTerminalContent('Please, login first.', 'miningoutput');
        return;
    }

    return new Promise(async resolve => {

        var myHeaders = new Headers();
        myHeaders.append("accept", "*/*");
        myHeaders.append("accept-language", "en-US,en;q=0.9");
        myHeaders.append("content-type", "text/plain;charset=UTF-8");
        myHeaders.append("user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36");

        var raw = "{\r\n    \"json\": true,\r\n    \"code\": \"codecombatcc\",\r\n    \"scope\": \"" + session.auth.actor + "\",\r\n    \"table\": \"assets\",\r\n    \"lower_bound\": \"\",\r\n    \"upper_bound\": \"\",\r\n    \"index_position\": 1,\r\n    \"key_type\": \"\",\r\n    \"limit\": \"100\",\r\n    \"reverse\": false,\r\n    \"show_payer\": true\r\n}";

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(`https://${rpcEndpoint}/v1/chain/get_table_rows`, requestOptions)
            .then(response => response.json())
            .then(async result => {

                user_staked_items = result.rows;

                let currentDate = new Date();
                timers_sysinfo = []

                let dtNowUTC = Number(currentDate.getTime() + (currentDate.getTimezoneOffset() * 60 * 1000)).toFixed(0);

                totalSharesCounter = 0;
                var html = - "";

                result.rows.forEach(async asset => {

                    if (asset.data.type == "ram") { // hardware
                        ram_power = Number(asset.data.level * 11111).toFixed(0) + 'Hz ';  //Hz

                        html = `<span style="color:lime" onclick="pickAssetIdByClick(${asset.data.asset_id},${asset.data.level})">..` + asset.data.asset_id.substring(6) + " </span>";

                        var nftcolor = "orange";
                        if (asset.data.rarity == "entry-level") nftcolor = "Gray";
                        if (asset.data.rarity == "mid-range") nftcolor = "Green";

                        var image_url = "";

                        //console.log('asset:'+JSON.stringify(asset))

                        if (asset.data.name == 'Memory Mingle') {
                            image_url = "QmWkZiv91jrLNtqQFH9jn8ji4tSepFTExmpUkeLW5WUNfZ";
                        }

                        var part_thumb = `<img src="https://atomichub-ipfs.com/ipfs/${image_url}" alt="Card Image" width="20px">&nbsp;`;
                        html = html + `<span style="color:Thistle">RAM</span> `;
                        html = html + part_thumb + `<span style="color:${nftcolor}">` + asset.data.name + " </span>";

                        var mining_status_color = "GreenYellow";

                        if (new Date(asset.data.upgrade_end_at).getTime() > dtNowUTC) {
                            mining_status_color = "LightSalmon";

                            var timerIsAlreadyRunning = false;

                            timers_sysinfo.forEach(timer => {
                                if (timer.id === 'timer_' + asset.asset_id) timerIsAlreadyRunning = true;
                            });

                            console.log('timerIsAlreadyRunning:' + timerIsAlreadyRunning);

                            if (!timerIsAlreadyRunning) {
                                timers_sysinfo.push()
                                setInterval(function () {
                                    updateTimerCounter(asset.data)
                                }, 1000);
                            }
                        }

                        mining_status_color = `<span style="color:${mining_status_color}">${ram_power}</span>`

                        html = html + mining_status_color + '<span id="timer_' + asset.data.asset_id + '"></span>' + `<span style="color:MediumPurple;font-size:18px">${asset.data.level}</span>`;

                        await updateTerminalContent(html, 'miningoutput');
                    }

                    if (asset.data.type == "cpu") { // hardware
                        curr_cpu_id = Number(asset.data.asset_id);
                        mining_power = Number(asset.data.mining_power).toFixed(4) + 'h/s ';
                        cpu_power = Number(asset.data.mining_power * 111111).toFixed(2) + 'Hz ';  //Hz

                        html = `<span style="color:lime" onclick="pickAssetIdByClick(${asset.data.asset_id},${asset.data.level})">..` + asset.data.asset_id.substring(6) + " </span>";

                        var nftcolor = "orange";
                        if (asset.data.rarity == "entry-level") nftcolor = "Gray";
                        if (asset.data.rarity == "mid-range") nftcolor = "Green";

                        var image_url = "";

                        //console.log('asset:'+JSON.stringify(asset))

                        if (asset.data.name == 'Turbulent Tick') {
                            image_url = "QmaV9XHv6NyoMLnYoEuC1XEhCZCr2DkmH2tZJXVvy7ud9K";
                        } else if (asset.data.name == 'Logic Reconstitution') {
                            image_url = "QmTvDc561NR2QvXkjWEUYLXSdGEbptfkKSp3dXAiStN7P9";
                        } else if (asset.data.name == 'Circuitry Revival') {
                            image_url = "QmSwAVHbHBe3KApuCZhqV6SdqkkDeD7uwfgTY3sPrXMrwD";
                        }

                        var part_thumb = `<img src="https://atomichub-ipfs.com/ipfs/${image_url}" alt="Card Image" width="20px">&nbsp;`;
                        html = html + `<span style="color:Thistle">CPU</span> `;
                        html = html + part_thumb + `<span style="color:${nftcolor}">` + asset.data.name + " </span>";

                        var mining_status_color = "GreenYellow";

                        if (new Date(asset.data.upgrade_end_at).getTime() > dtNowUTC) {
                            mining_status_color = "LightSalmon";

                            var timerIsAlreadyRunning = false;

                            timers_sysinfo.forEach(timer => {
                                if (timer.id === 'timer_' + asset.asset_id) timerIsAlreadyRunning = true;
                            });

                            console.log('timerIsAlreadyRunning:' + timerIsAlreadyRunning);

                            if (!timerIsAlreadyRunning) {
                                timers_sysinfo.push()
                                setInterval(function () {
                                    updateTimerCounter(asset.data)
                                }, 1000);
                            }
                        }

                        mining_status_color = `<span style="color:${mining_status_color}">${cpu_power}</span>`

                        html = html + mining_status_color + '<span id="timer_' + asset.data.asset_id + '"></span>' + `<span style="color:MediumPurple;font-size:18px">${asset.data.level}</span>`;

                        await updateTerminalContent(html, 'miningoutput');
                    }

                });

                result.rows.forEach(asset => {

                    var dt_asset = new Date(asset.data.last_claim_at).getTime();
                    var diffsecs = Math.abs(((dtNowUTC - dt_asset)).toFixed(0));

                    if (new Date(asset.data.upgrade_end_at).getTime() < dtNowUTC) { // asure asset is mining atm
                        totalSharesCounter = totalSharesCounter + (Number(asset.data.mining_power).toFixed(4) * diffsecs);
                    }

                    console.log('this totalSharesCounter:' + totalSharesCounter);

                });

                resolve();

            })
            .catch(error => console.log('error', error));

    })
}

function swinfo(avoidPrintToTerminal) {

    if (session == null) {
        updateTerminalContent('Please, login first.', 'miningoutput');
        return;
    }

    return new Promise(async resolve => {

        var myHeaders = new Headers();
        myHeaders.append("accept", "*/*");
        myHeaders.append("accept-language", "en-US,en;q=0.9");
        myHeaders.append("content-type", "text/plain;charset=UTF-8");
        myHeaders.append("user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36");

        var raw = "{\r\n    \"json\": true,\r\n    \"code\": \"codecombatcc\",\r\n    \"scope\": \"" + session.auth.actor + "\",\r\n    \"table\": \"assets\",\r\n    \"lower_bound\": \"\",\r\n    \"upper_bound\": \"\",\r\n    \"index_position\": 1,\r\n    \"key_type\": \"\",\r\n    \"limit\": \"100\",\r\n    \"reverse\": false,\r\n    \"show_payer\": true\r\n}";

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(`https://${rpcEndpoint}/v1/chain/get_table_rows`, requestOptions)
            .then(response => response.json())
            .then(async result => {

                user_staked_items = result.rows;

                let currentDate = new Date();
                timers_sysinfo = []

                let dtNowUTC = Number(currentDate.getTime() + (currentDate.getTimezoneOffset() * 60 * 1000)).toFixed(0);

                totalSharesCounter = 0;
                var html = - "";

                var asset_tool = '';

                result.rows.forEach(async asset => {

                    if (asset.data.type == "hack") { // software
                        html = `<span style="color:lime" onclick="pickAssetIdByClick(${asset.data.asset_id},${asset.data.version})">..` + asset.data.asset_id.substring(6) + " </span>";

                        var nftcolor = "orange";
                        if (asset.data.rarity == "entry-level") nftcolor = "Gray";
                        if (asset.data.rarity == "mid-range") nftcolor = "Green";

                        var image_url = "";

                        //console.log('asset:'+JSON.stringify(asset))

                        if (asset.data.name == 'Sweet Burp') {
                            asset_tool = 'HACK TOOL';
                            image_url = "QmNmGG4o8Chf9pBYCK5vYUDk6k5y4prRqUEMorpTdXjmi9";
                            curr_burp_version = asset.data.version
                            curr_burp_id = asset.data.asset_id
                        }

                        if (asset.data.name == 'Word Cruncher') {
                            asset_tool = 'HACK TOOL';
                            image_url = "QmRF44SHoLK5C1TxpPN77VLH3TQXbvYnurDjjhTsNCHgA3";
                            curr_crunch_version = asset.data.version
                            curr_crunch_id = asset.data.asset_id
                        }

                        var part_thumb = '<img src="https://atomichub-ipfs.com/ipfs/' + image_url + '" alt="Card Image" width="18px">&nbsp;';
                        html = html + `<span style="color:Thistle">${asset_tool}</span> `;
                        html = html + part_thumb + `<span style="color:${nftcolor}">` + asset.data.name + " </span>";

                        var mining_status_color = "MediumPurple";

                        if (new Date(asset.data.upgrade_end_at).getTime() > dtNowUTC) {
                            mining_status_color = "LightSalmon";

                            var timerIsAlreadyRunning = false;

                            timers_sysinfo.forEach(timer => {
                                if (timer.id === 'timer_' + asset.asset_id) timerIsAlreadyRunning = true;
                            });

                            console.log('timerIsAlreadyRunning:' + timerIsAlreadyRunning);

                            if (!timerIsAlreadyRunning) {
                                timers_sysinfo.push()
                                setInterval(function () {
                                    updateTimerCounter(asset.data)
                                }, 1000);
                            }
                        }

                        //mining_status_color = `<span style="color:${mining_status_color}">${asset.data.version}</span>`

                        html = html + '<span id="timer_' + asset.data.asset_id + '"></span>' + `<span style="color:${mining_status_color};font-size:18px">v${Number(asset.data.version / 100).toFixed(2)}</span>`;

                        if (!avoidPrintToTerminal) await updateTerminalContent(html, 'miningoutput');

                    }

                    if (asset.data.type == "security") { // software
                        console.log('security')
                        html = `<span style="color:lime" onclick="pickAssetIdByClick(${asset.data.asset_id},${asset.data.version})">..` + asset.data.asset_id.substring(6) + " </span>";

                        var nftcolor = "orange";
                        if (asset.data.rarity == "entry-level") nftcolor = "Gray";
                        if (asset.data.rarity == "mid-range") nftcolor = "Green";

                        var image_url = "";

                        //console.log('asset:'+JSON.stringify(asset))

                        if (asset.data.name == 'Chucklenet') {
                            asset_tool = 'FIREWALL TOOL';
                            image_url = "QmTxFSvwMw3b8to7otxkgUzJMud1gLWkdo5KbwsDikDAqm";
                            curr_firewall_version = asset.data.version
                            curr_firewall_id = asset.data.asset_id
                        }

                        console.log('asset.data.name:' + asset.data.name)
                        if (asset.data.name == 'Hack Hammer') {
                            asset_tool = 'SECURITY TOOL';
                            image_url = "QmX1MWNjkgtW8otgRRNHPJ57tjw69fcEv78HYHj4cdF6mb";
                            curr_crunch_version = asset.data.version
                            curr_hackhammer_id = asset.data.asset_id
                        }


                        var part_thumb = '<img src="https://atomichub-ipfs.com/ipfs/' + image_url + '" alt="Card Image" width="18px">&nbsp;';
                        html = html + `<span style="color:Thistle">${asset_tool}</span> `;
                        html = html + part_thumb + `<span style="color:${nftcolor}">` + asset.data.name + " </span>";

                        var mining_status_color = "MediumPurple";

                        if (new Date(asset.data.upgrade_end_at).getTime() > dtNowUTC) {
                            mining_status_color = "LightSalmon";

                            var timerIsAlreadyRunning = false;

                            timers_sysinfo.forEach(timer => {
                                if (timer.id === 'timer_' + asset.asset_id) timerIsAlreadyRunning = true;
                            });

                            console.log('timerIsAlreadyRunning:' + timerIsAlreadyRunning);

                            if (!timerIsAlreadyRunning) {
                                timers_sysinfo.push()
                                setInterval(function () {
                                    updateTimerCounter(asset.data)
                                }, 1000);
                            }
                        }

                        html = html + '<span id="timer_' + asset.data.asset_id + '"></span>' + `<span style="color:${mining_status_color};font-size:18px">v${Number(asset.data.version / 100).toFixed(2)}</span>`;

                        if (!avoidPrintToTerminal) await updateTerminalContent(html, 'miningoutput');

                    }

                });

                resolve();

            })
            .catch(error => console.log('error', error));

    })
}

function miners() {

    if (session == null) {
        if (wax.userAccount != null) {
            updateTerminalContent('authorized...' + wax.userAccount, 'miningoutput');
            return;
        }
        updateTerminalContent('Please, login first.', 'miningoutput');
        return;
    }

    return new Promise(async resolve => {

        var myHeaders = new Headers();
        myHeaders.append("accept", "*/*");
        myHeaders.append("accept-language", "en-US,en;q=0.9");
        myHeaders.append("content-type", "text/plain;charset=UTF-8");
        myHeaders.append("user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36");

        var raw = "{\r\n    \"json\": true,\r\n    \"code\": \"codecombatcc\",\r\n    \"scope\": \"" + session.auth.actor + "\",\r\n    \"table\": \"assets\",\r\n    \"lower_bound\": \"\",\r\n    \"upper_bound\": \"\",\r\n    \"index_position\": 1,\r\n    \"key_type\": \"\",\r\n    \"limit\": \"100\",\r\n    \"reverse\": false,\r\n    \"show_payer\": true\r\n}";

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(`https://${rpcEndpoint}/v1/chain/get_table_rows`, requestOptions)
            .then(response => response.json())
            .then(async result => {

                user_staked_items = result.rows;

                let currentDate = new Date();
                timers_sysinfo = []

                let dtNowUTC = Number(currentDate.getTime() + (currentDate.getTimezoneOffset() * 60 * 1000)).toFixed(0);

                var html = - "";

                result.rows.forEach(async asset => {
                    if (asset.data.type == "gpu") { // hardware
                        mining_power = Number(asset.data.mining_power).toFixed(8) + 'h/s ';

                        html = `<span style="color:lime" onclick="pickAssetIdByClick(${asset.data.asset_id},${asset.data.level})">..` + asset.data.asset_id.substring(6) + " </span>";

                        var nftcolor = "orange";
                        if (asset.data.rarity == "entry-level") nftcolor = "Gray";
                        if (asset.data.rarity == "mid-range") nftcolor = "green";

                        var image_url = "";

                        //console.log('asset:'+JSON.stringify(asset))

                        if (asset.data.name == 'Render Reluctant') {
                            image_url = "QmcjSa9XwCWVvoVwJRncUtaTYCs6SwFBCDCzK76U3n5kre";
                        } else if (asset.data.name == 'Comic Cores') {
                            image_url = "QmWcDUEauefBFFn7LqdvfxktaE6g5jo12VLXK41m87JUd1";
                        }

                        var part_thumb = `<img src="https://atomichub-ipfs.com/ipfs/${image_url}" alt="Card Image" width="20px">&nbsp;`;
                        html = html + `<span style="color:Thistle">GPU MINER</span> `;
                        html = html + part_thumb + `<span style="color:${nftcolor}">` + asset.data.name + " </span>";

                        var mining_status_color = "Cyan";

                        if (new Date(asset.data.upgrade_end_at).getTime() > dtNowUTC) {
                            mining_status_color = "LightSalmon";

                            var timerIsAlreadyRunning = false;

                            timers_sysinfo.forEach(timer => {
                                if (timer.id === 'timer_' + asset.asset_id) timerIsAlreadyRunning = true;
                            });

                            console.log('timerIsAlreadyRunning:' + timerIsAlreadyRunning);

                            if (!timerIsAlreadyRunning) {
                                timers_sysinfo.push()
                                setInterval(function () {
                                    updateTimerCounter(asset.data)
                                }, 1000);
                            }
                        }

                        mining_status_color = `<span style="color:${mining_status_color}">${mining_power}</span>`

                        html = html + mining_status_color + '<span id="timer_' + asset.data.asset_id + '"></span>' + `<span style="color:MediumPurple;font-size:18px">${asset.data.level}</span>`;

                        await updateTerminalContent(html, 'miningoutput');

                    }

                });

                resolve();

                /*                
                if (!sharesCounterStarted) {
                    sharesCounter = 0;
                    setInterval(function() {
                        updateSharesCounter()
                      }, 1000);
                }
                */

            })
            .catch(error => console.log('error', error));

    })
}

function getPlayerInfo(account) {

    return new Promise(async resolve => {

        var myHeaders = new Headers();
        myHeaders.append("accept", "*/*");
        myHeaders.append("accept-language", "en-US,en;q=0.9");
        myHeaders.append("content-type", "text/plain;charset=UTF-8");
        myHeaders.append("user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36");

        var raw = "{\r\n    \"json\": true,\r\n    \"code\": \"codecombatcc\",\r\n    \"scope\": \"codecombatcc\",\r\n    \"table\": \"players\",\r\n    \"lower_bound\": \"" + account + "\",\r\n    \"upper_bound\": \"" + account + "\",\r\n    \"index_position\": 1,\r\n    \"key_type\": \"\",\r\n    \"limit\": \"100\",\r\n    \"reverse\": false,\r\n    \"show_payer\": true\r\n}";

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(`https://${rpcEndpoint}/v1/chain/get_table_rows`, requestOptions)
            .then(response => response.json())
            .then(result => {

                if (result.rows !== undefined && result.rows.length > 0) {
                    last_shares_balance = curr_shares_balance;
                    curr_shares_balance = result.rows[0].data.shares_balance;
                    curr_mining_power = result.rows[0].data.mining_power;
                    curr_energy_credits = result.rows[0].data.energy_credits;
                    curr_ram = result.rows[0].data.ram;

                    if (last_shares_balance == 0) {
                        //updateTerminalContent(`Accepted.`, 'systemoutput')
                    } else if (last_shares_balance > curr_shares_balance) {
                        updateTerminalContent(`- ${Number(last_shares_balance - curr_shares_balance).toFixed(8)} shares`, 'systemoutput');
                    } else if (last_shares_balance < curr_shares_balance) {
                        updateTerminalContent(`+ ${Math.abs(Number(curr_shares_balance - last_shares_balance).toFixed(8))} shares`, 'systemoutput');
                    }

                }

                resolve();

            })
            .catch(error => console.log('error', error));

    })
}

function botnetwitList() {

    return new Promise(async resolve => {

        var myHeaders = new Headers();
        myHeaders.append("accept", "*/*");
        myHeaders.append("accept-language", "en-US,en;q=0.9");
        myHeaders.append("content-type", "text/plain;charset=UTF-8");
        myHeaders.append("user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36");

        var raw = "{\r\n    \"json\": true,\r\n    \"code\": \"codecombatcc\",\r\n    \"scope\": \"codecombatcc\",\r\n    \"table\": \"lostfunds\",\r\n    \"lower_bound\": \"\",\r\n    \"upper_bound\": \"\",\r\n    \"index_position\": 1,\r\n    \"key_type\": \"\",\r\n    \"limit\": \"500\",\r\n    \"reverse\": false,\r\n    \"show_payer\": true\r\n}";

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(`https://${rpcEndpoint}/v1/chain/get_table_rows`, requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log(JSON.stringify(result))

                if (result.rows !== undefined && result.rows.length > 0) {

                    result.rows.forEach(lostfund => {
                        console.log('lostfund.player:' + lostfund.data.player);
                        console.log('session.auth.actor:' + session.auth.actor);
                        if (lostfund.data.player == session.auth.actor) updateTerminalContent(`Id: ${lostfund.data.id} > ${lostfund.data.shares_amount} shares`, 'systemoutput');
                    });

                }

                resolve();

            })
            .catch(error => console.log('error', error));

    })
}

function getTokensInfo(account) {

    return new Promise(async resolve => {

        var myHeaders = new Headers();
        myHeaders.append("accept", "*/*");
        myHeaders.append("accept-language", "en-US,en;q=0.9");
        myHeaders.append("content-type", "text/plain;charset=UTF-8");
        myHeaders.append("user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36");

        var raw = "{\r\n    \"json\": true,\r\n    \"code\": \"codecombattt\",\r\n    \"scope\": \"" + account + "\",\r\n    \"table\": \"accounts\",\r\n    \"lower_bound\": \"\",\r\n    \"upper_bound\": null,\r\n    \"index_position\": 1,\r\n    \"key_type\": \"\",\r\n    \"limit\": \"100\",\r\n    \"reverse\": false,\r\n    \"show_payer\": true\r\n}";

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(`https://${rpcEndpoint}/v1/chain/get_table_rows`, requestOptions)
            .then(response => response.json())
            .then(result => {

                if (result.rows.length > 0) {
                    if (result.rows[0].data.balance !== undefined) {
                        var last_curr_ccbt_balance = curr_ccbt_balance;

                        const cbt_balance_asset = result.rows[0].data.balance.split(' ');
                        console.log('result.rows[0].data.balance:' + result.rows[0].data.balance)

                        curr_ccbt_balance = Number(cbt_balance_asset[0]).toFixed(4);

                        console.log('last_curr_ccbt_balance:' + last_curr_ccbt_balance)
                        console.log('curr_ccbt_balance:' + curr_ccbt_balance)

                        if (!isFirstRun) {
                            if (curr_ccbt_balance > last_curr_ccbt_balance) {
                                updateTerminalContent(`+ ${Number(Math.abs(Number(curr_ccbt_balance) - Number(last_curr_ccbt_balance))).toFixed(4)} CBT`, 'systemoutput');
                            } else if (last_curr_ccbt_balance > curr_ccbt_balance) {
                                updateTerminalContent(`- ${Number(Math.abs(Number(last_curr_ccbt_balance) - Number(curr_ccbt_balance))).toFixed(4)} CBT`, 'systemoutput');
                            }
                        } else {
                            isFirstRun = false;
                        }


                    } else curr_ccbt_balance = ''
                }

                resolve();

            })
            .catch(error => console.log('error', error));

    })
}


function getPlayerCPUInfo(account) {

    return new Promise(async resolve => {

        var myHeaders = new Headers();
        myHeaders.append("accept", "*/*");
        myHeaders.append("accept-language", "en-US,en;q=0.9");
        myHeaders.append("content-type", "text/plain;charset=UTF-8");
        myHeaders.append("user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36");

        var raw = "{\r\n    \"json\": true,\r\n    \"code\": \"codecombatcc\",\r\n    \"scope\": \"" + account + "\",\r\n    \"table\": \"assets\",\r\n    \"lower_bound\": \"\",\r\n    \"upper_bound\": \"\",\r\n    \"index_position\": 1,\r\n    \"key_type\": \"\",\r\n    \"limit\": \"300\",\r\n    \"reverse\": false,\r\n    \"show_payer\": true\r\n}";

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(`https://${rpcEndpoint}/v1/chain/get_table_rows`, requestOptions)
            .then(response => response.json())
            .then(result => {

                user_staked_items = result.rows;

                user_staked_items.forEach(asset => {
                    if (asset.data.type === "cpu") {
                        curr_cpu_power = asset.data.mining_power * 1333; // multiplica por 50 pra nao ser igual a mining e por que é em hertz tbm
                        curr_cpu_name = asset.data.name;
                        curr_cpu_mining_power = asset.data.mining_power;
                        console.log('curr_cpu_power:' + curr_cpu_power);
                        console.log('curr_cpu_mining_power:' + curr_cpu_mining_power);

                    }
                });

                resolve();

            })
            .catch(error => console.log('error', error));

    })
}

function claimAssets(input) {

    var assets = input.substring(6);
    const assets_list = assets.split(" ");

    action = {
        account: 'codecombatcc',
        name: 'claim',
        authorization: [{
            actor: session.auth.actor,
            permission: 'active',
        }],
        data: {
            player: session.auth.actor,
            asset_ids: assets_list,
            logonly: false
        },
    }

    session.transact({ action }).then(({ transaction }) => {
        //console.log(`Transaction broadcast! Id: ${transaction.id}`)
        //updateTerminalContent(JSON.stringify(transaction), 'systemoutput');
        updateBothDivsWithUserInfo();

        updateTerminalContent("claimed.", 'systemoutput');
    })


}

function claimAll() {

    //alert('aaa');

    action = {
        account: 'codecombatcc',
        name: 'claimall',
        authorization: [{
            actor: session.auth.actor,
            permission: 'active',
        }],
        data: {
            player: session.auth.actor,
            logonly: false
        },
    }

    session.transact({ action }).then(({ transaction }) => {
        updateBothDivsWithUserInfo();
        updateTerminalContent("claimed all.", 'systemoutput');
    })

}

function upgradeAssets(input) {

    var assets = input.substring(8);
    const assets_list = assets.split(" ");

    if (assets_list[1] === undefined || assets_list[1] === "") {
        updateTerminalContent(`inform level to upgrade asset to.`, 'commandfail');
        return;
    }

    action = {
        account: 'codecombatcc',
        name: 'upgrade',
        authorization: [{
            actor: session.auth.actor,
            permission: 'active',
        }],
        data: {
            player: session.auth.actor,
            asset_id: assets_list[0],
            to_level: assets_list[1],
            logonly: false
        },
    }

    session.transact({ action }).then(({ transaction }) => {
        updateBothDivsWithUserInfo();
        updateTerminalContent(`upgrading asset ${assets_list[0]}.`, 'systemoutput');
    })

}

async function updateAssets(asset_id) {

    //var params = input.substring(5);
    //const params_list = params.split(" ");

    //var tokens = Number(params_list[1]).toFixed(4);

    action = {
        account: 'codecombattt',
        name: 'transfer',
        authorization: [{
            actor: session.auth.actor,
            permission: 'active',
        }],
        data: {
            from: session.auth.actor,
            to: 'codecombatcc',
            amount: 0.05,
            symbol: 'CBT',
            quantity: '0.1500 CBT',
            memo: 'update:' + asset_id
        },
    }

    console.log('action:' + JSON.stringify(action))

    session.transact({ action }).then(({ transaction }) => {
        console.log('transaction:' + JSON.stringify(transaction));
        updateBothDivsWithUserInfo();
        updateTerminalContent(`updating ${asset_id} software version.`, 'systemoutput');
    })

}

async function updateBothDivsWithUserInfo() {

    const bottomDiv = document.getElementById("bottom-div");
    bottomDiv.style.justifyContent = "center";
    bottomDiv.innerHTML = '<div class="fade-in-out">Reading system info...</div>';
    await getPlayerInfo(session.auth.actor);
    await getPlayerCPUInfo(session.auth.actor);
    await getTokensInfo(session.auth.actor);

    let info1 = `<span style="color:dodgerblue;font-size:30px">${Number(curr_shares_balance).toFixed(8)}</span>`;
    let info2 = `<span style="color:lime;font-size:30px" id="shares_counter">&nbsp;${Number(curr_mining_power).toFixed(8)}h/s</span>`;
    let info3 = `<span style="padding-left:20px;"><span style="color:orange;font-size:26px" id="energy_balance">&nbsp;${curr_energy_credits}</span>`;
    let info4 = `<span style="color:yellowgreen;font-size:26px">&nbsp;${curr_ccbt_balance} CBT</span></span>`;

    bottomDiv.style.justifyContent = "center";
    bottomDiv.innerHTML = info1 + info2 + info3 + info4;

    const topDiv = document.getElementById('top-div-hardware');
    topDiv.style.height = '40px';
    topDiv.style.transition = 'height 1s ease';

    if (curr_cpu_name == 'Circuitry Revival') image_url = "QmSwAVHbHBe3KApuCZhqV6SdqkkDeD7uwfgTY3sPrXMrwD";
    if (curr_cpu_name == 'Logic Reconstitution') image_url = "QmTvDc561NR2QvXkjWEUYLXSdGEbptfkKSp3dXAiStN7P9";
    if (curr_cpu_name == 'Turbulent Tick') image_url = "QmaV9XHv6NyoMLnYoEuC1XEhCZCr2DkmH2tZJXVvy7ud9K";

    let info9 = `<span><img style="margin-top:5px;padding-right:10px" src="https://atomichub-ipfs.com/ipfs/${image_url}" alt="Card Image" width="26px"></span><span style="color:black;font-size:30px">${curr_cpu_name.toUpperCase()} CPU: </span><span style="color:greenyellow;font-size:30px">${Number(curr_cpu_power).toFixed(2)}Hz&nbsp;</span>`;
    let info10 = `<span style="color:black;font-size:30px">MEM: </span><span style="color:greenyellow;font-size:30px">${curr_ram}&nbsp;</span><span style="padding-left:20px;color:LightSalmon;font-size:26px"><b>${Number(curr_mining_power).toFixed(8)}</b>h/s</span>`;

    topDiv.innerHTML = info9 + info10;

    if (!sharesCounterStarted) {
        sharesCounter = 0;
        totalSharesCounter = 0;

        setInterval(function () {
            updateSharesCounter()
            flashSharesCounter()
        }, 1000);
    }

}

function flashSharesCounter() {
    const myDiv = document.getElementById('shares_counter');

    if (myDiv !== null) {
        myDiv.classList.add('flash');

        setTimeout(() => {
            myDiv.classList.remove('flash');
        }, 500); // Flashing duration: 1s

    }

}


function updateSharesCounter() {
    //console.log('active')
    //console.log('this totalSharesCounter:' + totalSharesCounter);
    sharesCounter++;

    cumulatedSharesCounter = 0;
    user_staked_items.forEach(asset => {

        let currentDate = new Date();
        let dtNowUTC = Number(currentDate.getTime() + (currentDate.getTimezoneOffset() * 60 * 1000)).toFixed(0);
        var dt_asset = new Date(asset.data.last_claim_at).getTime() > new Date(asset.data.upgrade_end_at).getTime() ? new Date(asset.data.last_claim_at).getTime() : new Date(asset.data.upgrade_end_at).getTime();
        var diffsecs = Number(((Number(dtNowUTC) - Number(dt_asset))).toFixed(0) / 1000).toFixed(0);
        //console.log('diffsecs:' + diffsecs);

        if (asset.data.type === 'cpu' || asset.data.type === 'gpu') {

            if (dt_asset < dtNowUTC) {

                //console.log('new Date(asset.data.upgrade_end_at).getTime():'+new Date(asset.data.upgrade_end_at).getTime())
                //console.log('dtNowUTC:'+dtNowUTC)
                if (new Date(asset.data.upgrade_end_at).getTime() < dtNowUTC) { // asure asset is not mining atm
                    //console.log('entrou:'+asset.data.type);
                    cumulatedSharesCounter = Number(cumulatedSharesCounter) + (Number(asset.data.mining_power).toFixed(8) * diffsecs);
                    //totalSharesCounter = Number(Number(totalSharesCounter) + (Number(asset.data.mining_power).toFixed(6) * diffsecs)/1000).toFixed(6);
                    //totalSharesCounter = Number(totalSharesCounter) + Number(shares);

                    //totalSharesCounter = Number(Number(totalSharesCounter) + (Number(asset.data.mining_power).toFixed(2) * diffsecs)).toFixed(2);
                }

            }

        }

    });

    totalSharesCounter = Number(cumulatedSharesCounter).toFixed(8);
    //console.log('cumulatedSharesCounter:' + Number(cumulatedSharesCounter).toFixed(6));
    //console.log('totalSharesCounter:' + totalSharesCounter);

    sharesCounterStarted = true;

    //document.getElementById('shares_counter').textContent = Number(sharesCounter*curr_mining_power).toFixed(2);

    let counter = document.getElementById('shares_counter');

    if (counter != null) counter.innerHTML = "+" + totalSharesCounter;

}

function updateTimerCounter(asset) {
    //console.log('active2')

    let currentDate = new Date();
    let dtNowUTC = Number(currentDate.getTime() + (currentDate.getTimezoneOffset() * 60 * 1000)).toFixed(0);

    let timer = document.getElementById('timer_' + asset.asset_id);

    var diff = Number((new Date(asset.upgrade_end_at).getTime() - dtNowUTC) / 1000).toFixed(0);

    if (diff > 0) {
        timer.innerHTML = '<span style="color:white">' + Number((new Date(asset.upgrade_end_at).getTime() - dtNowUTC) / 1000).toFixed(0) + ' </span>';
    } else if (diff == 0) {
        timer.innerHTML = '';
        // remove o timer
        timers_sysinfo = timers_sysinfo.filter(function (timer) {
            return timer.id !== ('timer_' + asset.data.asset_id);
        })

    }

}

async function updateTopDivWithStakeInfo(input) {

    const topDiv = document.getElementById("top-div-stake");
    topDiv.innerHTML = "Reading system info..."
    await getAAInventoryItems(input);

    let html = '<div style="display: flex; justify-content: center; width: 100%;">';

    var c = 0;
    user_stakeable_items.forEach(asset => {
        c++;
        var lorv = "version";
        var lorv_number = "n/a";
        var rarity_bg_color = "#4d0000";

        if (asset.data.type === "cpu" || asset.data.type === "gpu" || asset.data.type === "ram") {
            lorv = "level"
            lorv_number = asset.data.level
        } else {
            lorv = "version"
            lorv_number = asset.data.version
        }

        if (asset.data.rarity === "entry-level") rarity_bg_color = "white";
        if (asset.data.rarity === "mid-range") rarity_bg_color = "LightGrey";

        html = html +
            `   <div style="height:240px;width:180px; text-align: center; background-color:MintCream; border-radius: 15px; margin:5px; font-family:Consolas">` +
            `       <a href="javascript:stakenft(${asset.asset_id});"><img style="margin-top:5px;" src="https://atomichub-ipfs.com/ipfs/${asset.data.img}" alt="Card Image" width="130px"></a>` +
            `       <div style="font-size:16px; text-align: center;margin-bottom:5px;">` +
            `           <span style="font-size:20px; color:#FF0080; background-color:black;"><b>${asset.name}</b></span><br>` +
            `           <span style="font-size:20px; color:magenta; background-color:${rarity_bg_color}; color:black"><b>${asset.data.rarity}</b></span><br>` +
            `           <span style="font-size:20px; color:black;">${lorv}: <b>${lorv_number}</b></span><br>` +
            `       </div>` +
            '   </div>';

        if (c == 5) html = html + '</div><br><div style="display: flex; justify-content: center; width:100%;">';

    });

    html = html + '</div>';

    topDiv.innerHTML = html

}

function getAAInventoryItems(input) {

    var fullcommand = input.substring(6);
    const params = fullcommand.split(" ");
    console.log('params.length:' + params.length);
    if (params.length < 2) params.push("1");

    const topDiv = document.getElementById('top-div-stake');
    topDiv.innerHTML = "";

    return new Promise(async resolve => {

        user_stakeable_items = [];

        var myHeaders = new Headers();
        myHeaders.append("accept", "*/*");
        myHeaders.append("accept-language", "en-US,en;q=0.9");
        myHeaders.append("content-type", "text/plain;charset=UTF-8");
        myHeaders.append("user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36");

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(`https://test.wax.api.atomicassets.io/atomicmarket/v1/assets?collection_name=codecombatme&limit=10&order=desc&owner=${session.auth.actor}&sort=transferred&page=${params[1]}`, requestOptions)
            .then(response => response.json())
            .then(result => {

                result.data.forEach(asset => {
                    user_stakeable_items.push(asset);
                    console.log(asset.asset_id + ' ' + asset.name);
                });

                resolve(); logcodecombatcc

            })
            .catch(error => console.log('error', error));

    })
}

function stakenft(id) {

    var assets = [];
    assets.push(id);

    console.log('stakenft click.')

    const topDiv = document.getElementById('top-div-stake');
    topDiv.innerHTML = "";
    topDiv.style.height = '0px';
    topDiv.style.transition = 'height 1s ease';

    action = {
        account: 'atomicassets',
        name: 'transfer',
        authorization: [{
            actor: session.auth.actor,
            permission: 'active',
        }],
        data: {
            asset_ids: assets,
            from: session.auth.actor,
            to: 'codecombatcc',
            memo: 'stake'
        },
    }

    console.log('action:' + JSON.stringify(action));

    session.transact({ action }).then(({ transaction }) => {
        console.log(JSON.stringify(transaction));
        updateBothDivsWithUserInfo();
        updateTerminalContent(`asset ${assets[0]} staked.`, 'systemoutput');
    })

}

function unstakenft(input) {

    var assets = input.substring(8);
    const assets_list = assets.split(" ");

    console.log('assets_list:' + JSON.stringify(assets_list));

    action = {
        account: 'codecombatcc',
        name: 'nftunstake',
        authorization: [{
            actor: session.auth.actor,
            permission: 'active',
        }],
        data: {
            player: session.auth.actor,
            asset_ids: assets_list,
            logonly: false
        },
    }

    session.transact({ action }).then(({ transaction }) => {
        updateBothDivsWithUserInfo();
        updateTerminalContent(`unstake success : ${JSON.stringify(assets_list)}.`, 'systemoutput');
    })

}

function pickAssetIdByClick(asset_id, lv) {
    //alert(asset_id);
    var output = terminalInput.value + asset_id + ' ';
    console.log('terminalInput.value:' + terminalInput.value);
    if (terminalInput.value.includes('upgrade') || terminalInput.value.includes('update')) output = output + (lv + 1);

    terminalInput.value = output;
    terminalInput.focus();
}

async function burp(input) {

    if (curr_burp_id === undefined) {
        console.log('ta undefined')
        await swinfo(true);
    }

    var assets = input.substring(5);
    const assets_list = assets.split(" ");

    if (assets_list[0] === undefined || assets_list[1] === "") {
        updateTerminalContent(`inform host to scan for leaks.`, 'commandfail');
        return;
    }
    console.log('curr_burp_id:' + curr_burp_id)
    action = {
        account: 'codecombatcc',
        name: 'burp',
        authorization: [{
            actor: session.auth.actor,
            permission: 'active',
        }],
        data: {
            from: session.auth.actor,
            to: assets_list[0],
            asset_id: curr_burp_id
        },
    }
    console.log('action:' + JSON.stringify(action))

    session.transact({ action }).then(({ transaction }) => {
        updateBothDivsWithUserInfo();
        updateTerminalContent(`burping host ${assets_list[0]}.`, 'systemoutput');
    })

}

async function burpcheck() {

    if (curr_burp_id === undefined) {
        console.log('curr_burp_id undefined')
        await swinfo(true);
    }

    action = {
        account: 'codecombatcc',
        name: 'burpcheck',
        authorization: [{
            actor: session.auth.actor,
            permission: 'active',
        }],
        data: {
            from: session.auth.actor,
            asset_id: curr_burp_id
        },
    }

    session.transact({ action }).then(async ({ transaction }) => {
        updateBothDivsWithUserInfo();
        setTimeout(async () => {
            await getBurpInfo(session.auth.actor);
        }, 2000);

    })

}

function getBurpInfo(account) {

    return new Promise(async resolve => {

        var myHeaders = new Headers();
        myHeaders.append("accept", "*/*");
        myHeaders.append("accept-language", "en-US,en;q=0.9");
        myHeaders.append("content-type", "text/plain;charset=UTF-8");
        myHeaders.append("user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36");

        var raw = "{\r\n    \"json\": true,\r\n    \"code\": \"codecombatcc\",\r\n    \"scope\": \"" + account + "\",\r\n    \"table\": \"ccntglobal\",\r\n    \"lower_bound\": \"\",\r\n    \"upper_bound\": \"\",\r\n    \"index_position\": 1,\r\n    \"key_type\": \"\",\r\n    \"limit\": \"300\",\r\n    \"reverse\": false,\r\n    \"show_payer\": true\r\n}";

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(`https://${rpcEndpoint}/v1/chain/get_table_rows`, requestOptions)
            .then(response => response.json())
            .then(result => {

                console.log('burpcheck:' + JSON.stringify(result))

                result.rows.forEach(hack_attempt => {

                    if (hack_attempt.data.type == 'burp') {

                        console.log('new Date(burp_attempt.data.finished_at).getTime():' + new Date(hack_attempt.data.finished_at).getTime())
                        var status = new Date(hack_attempt.data.finished_at).getTime() > 10800000 ? 'finished' : 'running' // 10800000 is initial date
                        var attempt_result = '';
                        if (status == 'finished') {
                            attempt_result = hack_attempt.data.leaked ? 'leaked' : 'failed'
                        }

                        updateTerminalContent(`host ${hack_attempt.data.host} ${status} ${attempt_result}</span>`, 'systemoutput');
                    }

                });

                /*
                result.rows.forEach(asset => {
                    if (asset.data.type === "cpu") {
                        curr_cpu_power = asset.data.mining_power*1333; // multiplica por 50 pra nao ser igual a mining e por que é em hertz tbm
                        curr_cpu_name = asset.data.name;
                        console.log('curr_cpu_power:'+curr_cpu_power);
                    }
                });
                */

                resolve();

            })
            .catch(error => console.log('error', error));

    })
}

async function crunch(input) {

    if (curr_crunch_id === undefined) {
        console.log('curr_crunch_id undefined')
        await swinfo(true);
    }

    var assets = input.substring(7);
    const assets_list = assets.split(" ");

    if (assets_list[0] === undefined || assets_list[1] === "") {
        updateTerminalContent(`inform host to crunch password files.`, 'commandfail');
        return;
    }
    console.log('curr_crunch_id:' + curr_crunch_id)
    action = {
        account: 'codecombatcc',
        name: 'crunch',
        authorization: [{
            actor: session.auth.actor,
            permission: 'active',
        }],
        data: {
            from: session.auth.actor,
            to: assets_list[0],
            asset_id: curr_crunch_id
        },
    }
    console.log('action:' + JSON.stringify(action))

    session.transact({ action }).then(({ transaction }) => {
        updateBothDivsWithUserInfo();
        updateTerminalContent(`crunching host ${assets_list[0]}.`, 'systemoutput');
    })

}

async function crunchcheck() {

    if (curr_crunch_id === undefined) {
        console.log('curr_crunch_id undefined')
        await swinfo(true);
    }

    action = {
        account: 'codecombatcc',
        name: 'crunchcheck',
        authorization: [{
            actor: session.auth.actor,
            permission: 'active',
        }],
        data: {
            from: session.auth.actor,
            asset_id: curr_crunch_id
        },
    }

    session.transact({ action }).then(async ({ transaction }) => {
        updateBothDivsWithUserInfo();
        setTimeout(async () => {
            await getCrunchInfo(session.auth.actor);
        }, 2000);

    })

}

function getCrunchInfo(account) {

    return new Promise(async resolve => {

        var myHeaders = new Headers();
        myHeaders.append("accept", "*/*");
        myHeaders.append("accept-language", "en-US,en;q=0.9");
        myHeaders.append("content-type", "text/plain;charset=UTF-8");
        myHeaders.append("user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36");

        var raw = "{\r\n    \"json\": true,\r\n    \"code\": \"codecombatcc\",\r\n    \"scope\": \"" + account + "\",\r\n    \"table\": \"ccntglobal\",\r\n    \"lower_bound\": \"\",\r\n    \"upper_bound\": \"\",\r\n    \"index_position\": 1,\r\n    \"key_type\": \"\",\r\n    \"limit\": \"300\",\r\n    \"reverse\": false,\r\n    \"show_payer\": true\r\n}";

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(`https://${rpcEndpoint}/v1/chain/get_table_rows`, requestOptions)
            .then(response => response.json())
            .then(result => {

                console.log('crunchheck:' + JSON.stringify(result))

                result.rows.forEach(hack_attempt => {

                    if (hack_attempt.data.type == 'crunch') {

                        console.log('new Date(burp_attempt.data.finished_at).getTime():' + new Date(hack_attempt.data.finished_at).getTime())
                        var status = new Date(hack_attempt.data.finished_at).getTime() > 10800000 ? 'finished' : 'running' // 10800000 is initial date
                        var attempt_result = '';
                        if (status == 'finished') {
                            attempt_result = hack_attempt.data.leaked ? 'crunched' : 'failed'
                        }

                        updateTerminalContent(`host ${hack_attempt.data.host} ${status} ${attempt_result}</span>`, 'systemoutput');
                    }

                });

                /*
                result.rows.forEach(asset => {
                    if (asset.data.type === "cpu") {
                        curr_cpu_power = asset.data.mining_power*1333; // multiplica por 50 pra nao ser igual a mining e por que é em hertz tbm
                        curr_cpu_name = asset.data.name;
                        console.log('curr_cpu_power:'+curr_cpu_power);
                    }
                });
                */

                resolve();

            })
            .catch(error => console.log('error', error));

    })
}

async function register() {

    action = {
        account: 'codecombatcc',
        name: 'regplayer',
        authorization: [{
            actor: session.auth.actor,
            permission: 'active',
        }],
        data: {
            player: session.auth.actor
        },
    }

    console.log('action:' + JSON.stringify(action))

    session.transact({ action }).then(({ transaction }) => {
        //updateBothDivsWithUserInfo();
        updateTerminalContent(`accepted! type 'stake nft' to stake your free cpu.`, 'systemoutput');
    })

}

async function swapSharesCCBT(input) {

    var params = input.substring(5);
    const params_list = params.split(" ");

    action = {
        account: 'codecombatcc',
        name: 'swap',
        authorization: [{
            actor: session.auth.actor,
            permission: 'active',
        }],
        data: {
            player: session.auth.actor,
            shares: params_list[1],
            //cbt_received: params_list[2] + ' CBT'
            cbt_received: '0.5000 CBT'
        },
    }

    console.log('action:' + JSON.stringify(action))

    session.transact({ action }).then(({ transaction }) => {
        console.log('transaction:' + JSON.stringify(transaction));
        updateBothDivsWithUserInfo();
        updateTerminalContent(`swap shares SH for Tokens CBT done.`, 'systemoutput');
    })

}

async function swapCCBTShares(input) {

    var params = input.substring(5);
    const params_list = params.split(" ");

    var tokens = Number(params_list[1]).toFixed(4);

    action = {
        account: 'codecombattt',
        name: 'transfer',
        authorization: [{
            actor: session.auth.actor,
            permission: 'active',
        }],
        data: {
            from: session.auth.actor,
            to: 'codecombatcc',
            amount: tokens,
            symbol: 'CBT',
            quantity: tokens + ' CBT',
            memo: 'swap:1'
        },
    }

    console.log('action:' + JSON.stringify(action))

    session.transact({ action }).then(({ transaction }) => {
        console.log('transaction:' + JSON.stringify(transaction));
        updateBothDivsWithUserInfo();
        updateTerminalContent(`swap Tokens CBT for shares SH done.`, 'systemoutput');
    })

}

function buy_shop_nft(tokens, id) {

    tokens = tokens.replace(' CBT', '')

    action = {
        account: 'codecombattt',
        name: 'transfer',
        authorization: [{
            actor: session.auth.actor,
            permission: 'active',
        }],
        data: {
            from: session.auth.actor,
            to: 'codecombatcc',
            amount: tokens,
            symbol: 'CBT',
            quantity: tokens + ' CBT',
            memo: 'buy:' + id
        },
    }

    //alert(JSON.stringify(action))
    console.log('action:' + JSON.stringify(action));

    session.transact({ action }).then(({ transaction }) => {
        console.log(JSON.stringify(transaction));
        updateBothDivsWithUserInfo();
        updateTerminalContent(`asset ${assets[0]} bought.`, 'systemoutput');
    })

}

function updateShopPage() {

    updateTerminalContent(`loading shop...`, 'systemoutput');
    return new Promise(async resolve => {

        var shop_page = 1;
        var total_shop_items = 0;

        var myHeaders = new Headers();
        myHeaders.append("accept", "*/*");
        myHeaders.append("accept-language", "en-US,en;q=0.9");
        myHeaders.append("content-type", "text/plain;charset=UTF-8");
        myHeaders.append("user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36");

        var raw = "{\"json\":true,\"code\":\"codecombatcc\",\"scope\":\"codecombatcc\",\"table\":\"shop\",\"lower_bound\":null,\"upper_bound\":null,\"index_position\":" + shop_page + ",\"key_type\":\"\",\"limit\":\"5\",\"reverse\":false,\"show_payer\":true}";

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(`https://${rpcEndpoint}/v1/chain/get_table_rows`, requestOptions)
            .then(response => response.json())
            .then(result => {

                console.log(JSON.stringify(result))

                var html = "";

                total_shop_items = result.rows.length;

                result.rows.forEach(shop_item => {

                    var myHeaders2 = new Headers();

                    var requestOptions = {
                        method: 'GET',
                        headers: myHeaders2,
                        redirect: 'follow'
                    };

                    fetch("https://test.wax.api.atomicassets.io/atomicassets/v1/templates/codecombatme/" + shop_item.data.template_id, requestOptions)
                        .then(response => response.json())
                        .then(item_info => {

                            console.log(JSON.stringify(item_info))

                            //alert(shop_item.data.cbt_price)
                            //alert(shop_item.data.template_id)

                            var gen = item_info.data.immutable_data.generation === undefined ? 0 : item_info.data.immutable_data.generation;

                            html = html + '<div class="card">' +
                                '<div style="justify-content: center;">' +
                                `<img style="max-width: calc(100%);" src="https://atomichub-ipfs.com/ipfs/${item_info.data.immutable_data.img}"/>` +
                                '</div>' +
                                `<h2 class="card-title">${item_info.data.immutable_data.name}</h2>` +
                                `<p class="card-description">${item_info.data.immutable_data.description}</p>` +
                                `<table border=0 width="175px" style="position:relative; bottom:0"><tr><td><span class="card-description">Gen:${gen} <br>Level:0 <br>${item_info.data.immutable_data.rarity}</span></td>` +
                                `<td><a class="gamebutton" href="javascript:buy_shop_nft('${shop_item.data.cbt_price}',${shop_item.data.template_id})">BUY</a></td></tr></table>${shop_item.data.cbt_price.replace('.0000', '')}` +
                                `</div>`

                            var shop_container = document.getElementById("shop_container");
                            shop_container.innerHTML = html;

                        });

                })
            })
            .catch(error => console.log('error', error));

        var html = '';

        //if (total_shop_items > 5) {
        if (page == 1) {
            html = `<a class="gamebutton" href="https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio">NEXT PAGE</a>`
        } else {
            html = `<a class="gamebutton" href="https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio">LAST PAGE</a>`
        }
        //}

        //var pagination_container = document.getElementById("pagination");
        //pagination_container.innerHTML = html;

        resolve()

    })

}

function buyEnergy(input) {

    var params = input.substring(4);
    const params_list = params.split(" ");

    var wax_tokens = params_list[1];

    action = {
        account: 'eosio.token',
        name: 'transfer',
        authorization: [{
            actor: session.auth.actor,
            permission: 'active',
        }],
        data: {
            from: session.auth.actor,
            to: 'codecombatcc',
            amount: wax_tokens,
            symbol: 'CBT',
            quantity: Number(wax_tokens).toFixed(8) + ' WAX',
            memo: 'buy_energy'
        },
    }

    console.log('action:' + JSON.stringify(action));

    session.transact({ action }).then(({ transaction }) => {
        console.log(JSON.stringify(transaction));
        updateBothDivsWithUserInfo();
        updateTerminalContent(`Wax sent to buy energy.`, 'systemoutput');
    })


}

async function botnetwit(input) {

    var assets = input.substring(10);
    const assets_list = assets.split(" ");

    action = {
        account: 'codecombatcc',
        name: 'botnetwit',
        authorization: [{
            actor: session.auth.actor,
            permission: 'active',
        }],
        data: {
            player: session.auth.actor,
            id: assets_list[0]
        },
    }

    console.log('action:' + JSON.stringify(action))

    session.transact({ action }).then(({ transaction }) => {
        //updateBothDivsWithUserInfo();
        updateTerminalContent(`moving stolen funds to account.`, 'systemoutput');
    })

}

async function pvebotnet() {

    action = {
        account: 'codecombatcc',
        name: 'pvebotnet',
        authorization: [{
            actor: session.auth.actor,
            permission: 'active',
        }],
        data: {
            player: session.auth.actor,
            cpu_id: curr_cpu_id
        },
    }

    console.log('action:' + JSON.stringify(action))

    session.transact({ action }).then(({ transaction }) => {
        //updateBothDivsWithUserInfo();
        updateTerminalContent(`started botnet threads against game exchange.`, 'systemoutput');
    })

}

async function pvebotnetget() {

    action = {
        account: 'codecombatcc',
        name: 'pvebotnetget',
        authorization: [{
            actor: session.auth.actor,
            permission: 'active',
        }],
        data: {
            player: session.auth.actor
        },
    }

    console.log('action:' + JSON.stringify(action))

    session.transact({ action }).then(({ transaction }) => {
        //updateBothDivsWithUserInfo();
        updateTerminalContent(`shares succeesfuly moved to suspicious account.`, 'systemoutput');
    })

}
