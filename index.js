const TelegramBot = require('node-telegram-bot-api');

// replace the value below with the Telegram token you receive from @BotFather
const token = '6756665185:AAEFnWozMhj7FTNqIAiyeTv8O8DZ-4LojWw';
const webAppUrl = 'https://4fff-46-53-242-104.ngrok-free.app';
// Create a temporary bot to get the last update id
const tempBot = new TelegramBot(token, { polling: false });

// Get the last update with offset: -1
tempBot.getUpdates({ offset: -1 }).then(updates => {
	// Get the last update id
	const lastUpdateId = updates[0].update_id;

	// Set the offset to the last update id plus one
	const offset = lastUpdateId + 1;

	// Create a bot that uses 'polling' to fetch new updates with the offset
	const bot = new TelegramBot(token, { polling: true, offset: offset });

	// Listen for any kind of message. There are different kinds of
	// messages.
	bot.on('message', async (msg) => {
		const chatId = msg.chat.id;
		const text = msg.text;

		if (text === '/start') {
			await bot.sendMessage(chatId, 'Ниже появится кнопка, заполни форму', {
				reply_markup: {
					inline_keyboard: [
						[{ text: 'Заполнить форму', web_app: { url: webAppUrl } }]
					]
				}
			})
		}

		// send a message to the chat acknowledging receipt of their message
		await bot.sendMessage(chatId, 'Received your message. Visit my web app here: ', {
			reply_markup: {
				inline_keyboard: [
					[{ text: 'Сделать заказ', web_app: { url: webAppUrl } }]
				]
			}
		});
	});
})
