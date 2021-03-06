const CoinpaprikaAPI = require('@coinpaprika/api-nodejs-client');
const numeral = require('numeral');
const { Markup } = require('telegraf');
const config = require('./config');

const client = new CoinpaprikaAPI();

const getCurrencies = async () => {
    const results = await client.getTicker();
    const coins = config.COINS;
    const currencies = results.filter(result => coins.includes(result.symbol)).slice(0,15);
    return currencies;
};

const formatCurrencies = (currencies) => {
    const text = currencies.map((currency, index) => `${index + 1}) <b>${currency.symbol}</b> - ${numeral(currency.price_usd).format('0,0')}$`).join('\n\n');
    return text;
};

const getUpdateKeyboard = (text) => Markup.inlineKeyboard([
    Markup.button.callback(text, "update")
]);

const getLanguageKeyboard = (ctx) => Markup.keyboard([
    Markup.button.text(ctx.i18n.t('language'))
]).resize().oneTime();

module.exports = {
    getCurrencies,
    formatCurrencies,
    getUpdateKeyboard,
    getLanguageKeyboard
};