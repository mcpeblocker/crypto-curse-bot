require('dotenv').config();

const { session, Markup } = require('telegraf');
const bot = require('./core/bot');
const { getCurrencies, formatCurrencies, getUpdateKeyboard, getLanguageKeyboard } = require('./utils/helpers');
const moment = require('moment');
const i18n = require('./core/i18n');
const { match } = require('telegraf-i18n');

bot.use(session());
bot.use((ctx,next) => {
    ctx.session = ctx.session || {};
    next();
})
bot.use(i18n.middleware());

bot.start((ctx) => {
    let text = ctx.i18n.t('start');
    const keyboard = getLanguageKeyboard(ctx);
    ctx.replyWithHTML(text, keyboard);
});

bot.command('curse', async (ctx) => {
    let text = ctx.i18n.t('calculating');
    const { message_id } = await ctx.reply(text);
    const data = await getCurrencies();
    text = ctx.i18n.t('curseToday');
    text += formatCurrencies(data);
    let date = moment().format('hh:mm:ss DD.MM.YYYY');
    text += `\n\n<code>${date}</code>`;
    const keyboard = getUpdateKeyboard(ctx.i18n.t('update'));
    ctx.deleteMessage(message_id);
    ctx.replyWithHTML(text, keyboard);
});

bot.action('update', async (ctx) => {
    let text = ctx.i18n.t('calculating');
    ctx.answerCbQuery(text);
    const data = await getCurrencies();
    text = ctx.i18n.t('curseToday');
    text += formatCurrencies(data);
    let date = moment().format('hh:mm:ss DD.MM.YYYY');
    text += `\n\n<code>${date}</code>`;
    const keyboard = getUpdateKeyboard(ctx.i18n.t('update'));
    ctx.editMessageText(text, {
        parse_mode: 'HTML',
        ...keyboard
    })
});

bot.hears(match('language'), (ctx) => {
    const text = ctx.i18n.t('language');
    const keyboard = Markup.inlineKeyboard([
        [
            Markup.button.callback("🇷🇺 Русский", "lang_ru"),
            Markup.button.callback("🇺🇿 O'zbekcha", "lang_uz"),
            Markup.button.callback("🇺🇸 Inglizcha", "lang_en")
        ]
    ]);
    ctx.reply(text, keyboard);
});

bot.action(/lang_(.+)/, async (ctx) => {
    const lang = ctx.match[1];
    ctx.i18n.locale(lang);
    await ctx.deleteMessage();
    let text = ctx.i18n.t('start');
    let keyboard = getLanguageKeyboard(ctx);
    ctx.replyWithHTML(text, keyboard);
});

bot.catch((err) => {
    console.log(`Bot error: ${err}`);
})

bot.launch()
    .then(() => {
        console.log(`Bot @${bot.botInfo.username} started!`);
    })
    .catch(err => {
        console.log(`Bot start error: ${err}`);
    });
