import { Router } from "express";
import puppeteer from "puppeteer";
import { KnownDevices } from 'puppeteer';

const mobile = KnownDevices['Galaxy S8'];

const naukri = Router();

function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}

naukri.get("/", async (req, res) => {
    try {
        const browser = await puppeteer.launch({
            headless: false,
            defaultViewport: null
        });
        const page = await browser.newPage();

        const job_type = 0
        const skills = "Full+stack+Development";
        const experience = 1
        const location = "Delhi+%2F+NCR"

        const email = process.env.NAUKRI_MAIL;
        const password = process.env.NAUKRI_PASS;

        await page.goto("https://www.naukri.com/", { waitUntil: "domcontentloaded" });
        await page.waitForSelector("#login_Layer");

        await page.evaluate(() => {
            document.getElementById("login_Layer").click();
        });

        await page.waitForSelector("form > div > button");

        await page.evaluate((email, password) => {
            document.querySelector("form > .form-row > input").value = email;
            document.querySelectorAll("form > .form-row > input")[1].value = password;
            document.querySelectorAll("form > div > button")[0].click();
        }, email, password)

        await page.waitForNavigation("https://naukri.com/dashboard");
        await page.emulate(mobile);
        await page.goto("https://www.naukri.com/recommendedjobs", { waitUntil: "domcontentloaded" });
        await page.waitForSelector(".tab-wrapper");

        await page.evaluate(() => {
            document.querySelectorAll(".tab-wrapper")[2].firstChild.click();
        }, []);
        await page.waitForSelector(".tw__active");

        const job_links = await page.evaluate(() => {
            const hrefs = [];
            document.querySelectorAll("article[data-jd-url]").forEach(e => {
                hrefs.push(e.getAttribute("data-jd-url"));
            })

            return hrefs;
        });
        page.close()
        const job_page = await browser.newPage();
        for (let link of job_links) {
            await job_page.goto(`https://naukri.com${link}`, { waitUntil: "domcontentloaded" });
            await job_page.waitForSelector("#apply-button,#walkin-button,#company-site-button");
            await delay(1000);
            await job_page.evaluate(() => {
                document.querySelector("#apply-button,#walkin-button,#company-site-button").click();
            });
            await delay(2000);
        }
        return res.json(job_links);

    } catch (err) {
        console.error(err);
        return res.status(404).send("Not found");
    }
});



export default naukri;