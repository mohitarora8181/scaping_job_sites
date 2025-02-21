import { Router } from "express";
import puppeteer from "puppeteer";

const inShala = Router();

inShala.get("/", async (req, res) => {
    try {
        const browser = await puppeteer.launch({
            headless: false,
            defaultViewport: null
        });
        const page = await browser.newPage();

        const profile = "web-development"
        const experience = 1
        const state = "Delhi"

        const email = process.env.INSHALA_MAIL;
        const password = process.env.INSHALA_PASS;

        await page.goto("https://internshala.com/login/student", { waitUntil: "domcontentloaded" });
        await page.evaluate(async (email,password) => {
            document.getElementById("email").value = email;
            document.getElementById("password").value = password;
            document.querySelector("#login_submit").click();
        },email,password);

        await page.waitForNavigation("https://internshala.com/student/dashboard");

        await page.goto(`https://internshala.com/jobs/${profile}-jobs-in-${state}/experience-${experience}`)

        await page.waitForSelector("#internship_list_container_1");

        // const job_links = await page.evaluate(() => {
        //     const hrefs_list = document.getElementById("internship_list_container_1").children;
        //     const links = [];
        //     for (let link of hrefs_list) {
        //         if (link.hasAttribute("data-href")) {
        //             links.push(link.getAttribute("data-href"));
        //         }
        //     }

        //     return links;
        // });

        // await puppeteer.goto(`https://intenshala.com/${job_links[0]}`, { waitUntil: "domcontentloaded" });


        for (let i = 0; i < 5; i++) {
            await page.evaluate(async () => {
                document.getElementById("internship_list_container_1").children[i].click();
            });
            await page.waitForSelector("#continue_button");
            await page.evaluate(() => {
                document.getElementById("continue_button").click();
            });
            await page.waitForSelector("#submit");
            await page.evaluate(() => {
                document.getElementById("cover_letter").value = "I my new in tech , so just need to start my career"
                if(document.querySelector(".additional_question")){
                    document.querySelector(".additional_question").children[1].children[0].value = "I am new"
                }
                document.getElementById("submit").click();
            });
            await page.waitForSelector("#dismiss_similar_job_modal");
            await page.reload();
            await page.waitForSelector("#internship_list_container_1");
        }

        return res.send("done")

    } catch (err) {
        console.error(err);
        return res.status(404).send("Not found");
    }
});



export default inShala;