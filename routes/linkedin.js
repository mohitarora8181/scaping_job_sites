import { Router } from "express";
import puppeteer from "puppeteer";

const lin = Router();

lin.get("/", async (req, res) => {
    try {
        const browser = await puppeteer.launch({
            headless: false,
            defaultViewport: null
        });
        const page = await browser.newPage();

        const keyword = "mern developer"
        const experience = 1
        const state = "Delhi"

        const email = process.env.LINKEDIN_MAIL;
        const password = process.env.LINKEDIN_PASS;

        await page.goto("https://www.linkedin.com/login", { waitUntil: "domcontentloaded" });
        await page.evaluate(async (email,password) => {
            document.getElementById("username").value = email;
            document.getElementById("password").value = password;
            document.querySelector("button[aria-label='Sign in'").click();
        },email,password);

        await page.waitForResponse("https://www.linkedin.com/feed/").then(async () => {
            await page.goto(`https://linkedin.com/jobs/search?keywords=${keyword}`, { waitUntil: "domcontentloaded" });
        })

        await page.waitForSelector(".jobs-apply-button--top-card");

        await page.evaluate(() => {
            document.querySelector(".jobs-apply-button--top-card").children[0].click();
        });

        await page.waitForSelector(".jobs-easy-apply-content");

        await page.evaluate(() => {
            document.querySelector("button[aria-label='Continue to next step'").click();
            document.querySelector("button[aria-label='Review your application'").click();
        });

        return res.send("done");
    } catch (err) {
        console.error(err);
        return res.status(404).send("Not found");
    }
});



export default lin;