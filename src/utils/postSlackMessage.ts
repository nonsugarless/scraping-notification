import createFetch from '@vercel/fetch';

const fetch = createFetch();

const postSlackMessage = async (data: { text: string }) => {
	const res = await fetch(process.env.SLACK_WEBHOOK_URL!, {
		headers: {
			'Content-Type': 'application/json; charset=utf-8',
		},
		method: 'POST',
		body: JSON.stringify(data),
	});
	return res;
};

export default postSlackMessage;
