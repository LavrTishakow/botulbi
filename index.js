const TelegramBot = require('node-telegram-bot-api');
const ngrok = require('ngrok');

// replace the value below with the Telegram token you receive from @BotFather
const token = '6756665185:AAEFnWozMhj7FTNqIAiyeTv8O8DZ-4LojWw';

// Create a temporary bot to get the last update id
const tempBot = new TelegramBot(token, { polling: false });

// Get the last update with offset: -1
tempBot.getUpdates({ offset: -1 }).then(updates => {
	// Get the last update id
	const lastUpdateId = updates[0].update_id;

	// Set the offset to the last update id plus one
	const offset = lastUpdateId + 1;

	// Run ngrok on port 3000
	ngrok.connect(3000).then(url => {
		// Get the URL from ngrok
		console.log(`Ngrok URL: ${url}`);
		// Use the URL in the bot code
		// Create a bot that uses 'polling' to fetch new updates with the offset
		const bot = new TelegramBot(token, { polling: true, offset: offset });

		// Set the webhook with the ngrok URL
		bot.setWebHook(`${url}/bot${bot.token}`);

		// Listen for any kind of message. There are different kinds of
		// messages.
		bot.on('message', async (msg) => {
			const chatId = msg.chat.id;
			const text = msg.text;

			if (text === '/start') {
				await bot.sendMessage(chatId, 'Ниже появится кнопка, заполни форму', {
					reply_markup: {
						inline_keyboard: [
							[{ text: 'Заполнить форму', web_app: { url: url } }]
						]
					}
				})
			}

			// send a message to the chat acknowledging receipt of their message
			await bot.sendMessage(chatId, 'Received your message. Visit my web app here: ', {
				reply_markup: {
					inline_keyboard: [
						[{ text: 'Сделать заказ', web_app: { url: url } }]
					]
				}
			});
		});
	}).catch(err => {
		// Handle errors
		console.error(`Ngrok error: ${err.message}`);
	});
})
