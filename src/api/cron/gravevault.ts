import { JSDOM } from 'jsdom';

import postSlackMessage from '../../utils/postSlackMessage';

import type { VercelApiHandler } from '@vercel/node';

const PAGE_URL =
	'https://www.gravevault.jp/index.php?dispatch=products.view&product_id=764';
const TARGET_EL_ID = 'out_of_stock_info_2934680252';
const SLACK_MESSAGE_TAG = '`Gravevault`';

const scraping = async () => {
	const dom = await JSDOM.fromURL(PAGE_URL, {});
	const document = dom.window.document;
	const value = document.getElementById(TARGET_EL_ID)?.textContent;

	if (!value) {
		throw new Error('value is falsy');
	}
	return value;
};

type TimeoutError = {
	name: 'TimeoutError';
};

const handler: VercelApiHandler = async (_req, res) => {
	try {
		const text = await scraping().catch(async (error: TimeoutError | Error) => {
			if (error.name === 'TimeoutError') {
				await postSlackMessage({
					text: 'スクレイピングがtimeoutしました⚠️\nselectorにマッチする要素がないかもしれません🥲',
				});
				res.status(200);
			} else {
				const message = 'スクレイピングで予期せぬエラーが発生しました😢';
				await postSlackMessage({
					text: message,
				});
				res.status(400).json({ message, ...error });
			}
		});
		if (typeof text !== 'string') {
			return;
		}
		const hasStock = !text.includes('No products');
		const baseData = {
			text,
			hasStock,
		};
		const slackRes = await postSlackMessage({
			text: hasStock
				? `${SLACK_MESSAGE_TAG} 目当ての商品が入荷されました🎉`
				: `${SLACK_MESSAGE_TAG} 在庫なし`,
		});
		res.status(200).json({
			...baseData,
			slackResStatus: slackRes.status,
		});
	} catch (error) {
		if (error instanceof Error) {
			res.status(400).json({ error });
		}
	}
};

export default handler;
