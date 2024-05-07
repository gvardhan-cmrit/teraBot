import { Telegraf } from "telegraf";
import userModel from './src/models/user.js'
import { message } from "telegraf/filters";
const bot = new Telegraf(process.env.BOT_TOKEN);
async function downloadVideo(link) {
    const url = "https://ytshorts.savetube.me/api/v1/terabox-downloader";
    let data = {
        "url": link
    }
    let response = await fetch(url, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify(data),
    })

    return response.json()
}


bot.start(async (ctx) => {
    const from = ctx.update.message.from;
    try {
        await userModel.findOneAndUpdate(
            { tgId: from.id },
            {
                tgId: from.id,
                userName: from.username,
                firstName: from.first_name,
                lastName: from.last_name
            },
            {
                new: true,
                upsert: true
            }
        )
        await ctx.reply('welcome to TeraDownloader')
    } catch (err) {
        await ctx.reply('some error occured')
        console.log(err)
    }
});

bot.command('video', async (ctx) => {
    ctx.reply('loading...')
})
bot.on(message('text'), async (ctx) => {
    const message = (ctx.update.message.text)
    const urlRegexPattern = /^https?:\/\/www\.terabox\.app\/.*$/;
    function checkUrl(url) {
        return urlRegexPattern.test(url);
    }

    if (checkUrl(message)) {
        ctx.reply('Your video is processing....')
        downloadVideo(message).then(
            response => {
                let result = (response.response[0].resolutions["Fast Download"])
                ctx.reply(result)
            }).catch(e => console.log(e))
    }
    else {

        await ctx.reply("not a valid link buddy")
        // bots.sendVideo(ctx.message.chat.id, "https://d3.terabox.app/file/d8f531733b40c154b0db9bf3937d3b88?fid=4402067906342-250528-829096540708333&dstime=1714990708&rt=sh&sign=FDtAER-DCb740ccc5511e5e8fedcff06b081203-leCRWgVbG%2ByQu1DS533QobHZilE%3D&expires=8h&chkv=0&chkbd=0&chkpc=&dp-logid=8704595420954498028&dp-callid=0&r=470546892&sh=1&region=jp")
        
    }
})


bot.launch();

process.once("SIGINT", () => bot.stop("SIGINT"))
process.once("SIGTERM", () => bot.stop("SIGTERM"))