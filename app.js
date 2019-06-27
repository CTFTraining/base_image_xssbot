const puppeteer = require('puppeteer-core');
const http = require('http');

const ADMIN_URL = process.env.ADMIN_URL || "http://web/admin.php";
const DOMAIN = process.env.HOST || "http://web";

var num = 0;

// Bot 单独访问每个页面，所以要获取
// 接口限制，一次获取的 URL 有限制，具体看服务器性能了
const get_urls = async () => {
    try {
        // TODO: 总感觉这个获取方式好复杂啊
        http.get(ADMIN_URL, resp => {
            var respText = [];
            var size = 0;
            resp.on('data', function (data) {
                respText.push(data);
                size += data.length;
            });
            resp.on('end', function () {
                respText = Buffer.concat(respText, size);
                let obj = JSON.parse(respText);
                obj.forEach(async e => {
                    await open_payload_url(e.user, `${DOMAIN}${e.url}`);
                })
            });
        });
    } catch (e) {
        console.error("[-] Get Urls\n", e.stack)
    }

    setTimeout(() => {
        get_urls();
    }, 3000);
}

const open_payload_url = async (user, url) => {
    let _num = ++num;
    console.log(`[${user}][${_num}] [+] Open Page ${url}`);
    let page;
    try {
        page = await browser.newPage();

        await page.on('error', err => {
            console.error(`[${user}][${_num}] [#] Error!`, err);
        });

        await page.on('pageerror', msg => {
            console.error(`[${user}][${_num}] [-] Page error : `, msg);
        })

        await page.on('dialog', async dialog => {
            console.debug(`[#] Dialog : [${dialog.type()}] "${dialog.message()}" ${dialog.defaultValue() || ""}`);
            await dialog.dismiss();
        });

        await page.on('console', async msg => {
            msg.args().forEach(arg => {
                arg.jsonValue().then(_arg => {
                    console.log(`[$] Console : `, _arg)
                });
            });
        });

        await page.on('requestfailed', req => {
            console.error(`[-] Request failed : ${req.url()} ${req.failure().errorText}`);
        })

        await page.goto(url, {
            waitUntil: 'networkidle2',
        });

        // ===== Custom Action =====
        // 自定义页面操作

        await page.setCookie({
            name: "flag",
            value: process.env.FLAG || "no flag",
            domain: DOMAIN || "www.virzz.com",
            path: "/",
            httpOnly: false,
            secure: false,
            sameSite: "Lax"
        });

        await page.waitFor(5 * 1000);

        // =========================

    } catch (e) {
        console.error("[-] Page open_payload_url\n", e.stack)
    }

    page.close();
    console.log(`[${user}][${_num}] [+] Close...`)
}

var browser;

(async () => {

    // 启动 Chrome
    browser = await puppeteer.launch({
        executablePath: '/usr/bin/chromium-browser',
        args: [
            '--headless',
            '--disable-dev-shm-usage',
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-gpu',
            '--no-gpu',
            '--disable-default-apps',
            '--disable-translate',
            '--disable-device-discovery-notifications',
            '--disable-software-rasterizer',
            '--disable-xss-auditor'
        ],
        userDataDir: '/home/bot/data/',
        // 忽略 HTTPS 错误
        ignoreHTTPSErrors: true
    });

    // 创建一个匿名的浏览器上下文
    // browser = await browser.createIncognitoBrowserContext();

    console.log("[+] Browser", "Launch success!");

    get_urls();

    // console.log("[+] Browser", "Close success!");
    // await browser.close();
})();
