async function triggerEvent(event) {
	// Fetch some data
	console.log('cron processed: event cron =', event.cron);
	console.log('cron processed: event type =', event.type);
	console.log('cron processed: event scheduledTime =', event.scheduledTime);
	const date = new Date(event.scheduledTime)
	console.log('cron processed: event scheduledTime date =', date);
	const jstNow = new Date(Date.now() + ((new Date().getTimezoneOffset() + (9 * 60)) * 60 * 1000)).toLocaleString({ timeZone: 'Asia/Tokyo' });
	console.log('cron processed: event scheduledTime date jst =', jstNow);

	const botAccessToken = SLACK_BOT_ACCESS_TOKEN;
	const slackWebhookUrl = 'https://slack.com/api/chat.postMessage'
	const payload = {
		channel: "kyouhei-workers-post",
		attachments: [
			{
				title: "Cloudflare Workers Cron Trigger",
				text: `This is Japan Standard Time now \`\`\`${jstNow}\`\`\` `,
				author_name: "workers-slack",
				color: "#00FF00",
			},
		],
	};

	fetch(slackWebhookUrl, {
		method: "POST",
		body: JSON.stringify(payload),
		headers: {
			"Content-Type": "application/json; charset=utf-8",
			"Content-Length": payload.length,
			Authorization: `Bearer ${botAccessToken}`,
			Accept: "application/json",
		},
	})
		.then((res) => {
			if (!res.ok) {
				throw new Error(`Server error ${res.status}`);
			}

			return res.json();
		})
		.catch((error) => {
			console.log(error);
		});
}

// Initialize Worker
addEventListener('scheduled', event => {
	event.waitUntil(triggerEvent(event));
});
