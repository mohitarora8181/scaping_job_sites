import { Router } from "express";
import axios from "axios";
import puppeteer from "puppeteer";

const instahyre = Router();

instahyre.get("/", async (req, res) => {
    try {
        const browser = await puppeteer.launch({
            headless: false,
            defaultViewport: null
        });
        const page = await browser.newPage();

        const job_type = 0 // 0 -> Internship & Full time , 1 -> full time only , 2 -> internship only
        const skills = "Full+stack+Development";
        const experience = 1
        const location = "Delhi+%2F+NCR"

        await page.goto("https://www.instahyre.com/login/", { waitUntil: "domcontentloaded" });


        await page.evaluate(() => {
            document.getElementById("email").value = "";
            document.getElementById("password").value = "";
            document.getElementById("login-form").children[0].click();
        });

        await page.waitForNavigation("https://www.instahyre.com/candidate/opportunities/");

        const { data } = await axios.get(`https://www.instahyre.com/api/v1/job_search?jobLocations=${location}&skills=${skills}&job_type=${job_type}&years=${experience}`);

        for (let obj of data.objects) {
            await page.goto(obj.public_url, { waitUntil: "domcontentloaded" });
            await page.waitForSelector(".apply-button");
            await page.evaluate(()=>{
                document.getElementsByTagName("button")[0].click()
            });
            console.log("Job ID filled :- "+obj.id);
            await page.waitForSelector(".application-sent");
        }

        return res.json("done");

    } catch (err) {
        console.error(err);
        return res.status(404).send("Not found");
    }
});



export default instahyre;