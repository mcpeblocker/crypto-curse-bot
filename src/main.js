require('dotenv').config();

// const { session } = require('telegraf/lib');
const bot = require('./core/bot');
const { getCurrencies, formatCurrencies, getUpdateKeyboard } = require('./utils/helpers');
const moment = require('moment');

// bot.use(session());

bot.start((ctx) => {
    let text = `<b>Привет, с помощью этого бота ты можешь наблюдать за курсом криптовалюты.\n\nЧтобы научить пиши /curse</b>`;
    ctx.replyWithHTML(text);
});

bot.command('curse', async (ctx) => {
    let text = "📊 Рассчитано ...";
    const { message_id } = await ctx.reply(text);
    const data = await getCurrencies();
    text = "<b>📊 Курсы криптовалют на сегодня:</b>\n\n";
    text += formatCurrencies(data);
    let date = moment().format('hh:mm:ss DD.MM.YYYY');
    text += `\n\n<code>${date}</code>`;
    const keyboard = getUpdateKeyboard();
    ctx.deleteMessage(message_id);
    ctx.replyWithHTML(text, keyboard);
});

bot.action('update', async (ctx) => {
    let text = "📊 Рассчитано ...";
    ctx.answerCbQuery(text);
    const data = await getCurrencies();
    text = "<b>📊 Курсы криптовалют на сегодня:</b>\n\n";
    text += formatCurrencies(data);
    let date = moment().format('hh:mm:ss DD.MM.YYYY');
    text += `\n\n<code>${date}</code>`;
    const keyboard = getUpdateKeyboard();
    ctx.editMessageText(text, {
        parse_mode: 'HTML',
        ...keyboard
    })
});

bot.launch()
    .then(() => {
        console.log(`Bot @${bot.botInfo.username} started!`);
    })
    .catch(err => {
        console.log(`Bot start error: ${err}`);
    });
