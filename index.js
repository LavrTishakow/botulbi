const TelegramBot = require('node-telegram-bot-api');
const ngrok = require('ngrok');

// replace the value below with the Telegram token you receive from @BotFather
const token = '6756665185:AAEFnWozMhj7FTNqIAiyeTv8O8DZ-4LojWw';

// Define an async function to run ngrok and bot
async function run() {
	try {
		// Run ngrok on port 3000 and wait for the URL
		const url = await ngrok.connect(3000);
		// Get the URL from ngrok
		console.log(`Ngrok URL: ${url}`);
		// Use the URL in the bot code
		// Create a bot that uses 'polling' to fetch new updates
		const bot = new TelegramBot(token, { polling: true });

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
							[{ text: 'Заполнить форму', web_app: { url: webAppUrl + '/form' } }]
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
	} catch (err) {
		// Handle errors
		console.error(`Error: ${err.message}`);
	}
}

// Call the async function
run();

