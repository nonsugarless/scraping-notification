import { JSDOM } from 'jsdom';
import type { VercelApiHandler } from '@vercel/node';

import { postSlackMessage, createCodeBlock } from '../../utils';

const PAGE_URL =
	'https://www.gravevault.jp/index.php?dispatch=products.view&product_id=764';
const TARGET_EL_ID = 'out_of_stock_info_2934680252';
const SLACK_MESSAGE_TAG = '`Gravevault`';

class UnexpectedDomError extends Error {}

const scraping = async () => {
	const dom = await JSDOM.fromURL(PAGE_URL);
	const document = dom.window.document;
	const value = document.getElementById(TARGET_EL_ID)?.textContent;
	if (!value) {
		throw new UnexpectedDomError();
	}
	return value;
};

const handleScrapingError = async (error: Error | UnexpectedDomError) => {
	const text =
		error instanceof UnexpectedDomError
			? `ページのDOM構造が変わっているかもしれません🤔\n${PAGE_URL}`
			: `スクレイピング中に予期せぬエラーが発生しました😢\n以下のエラーを確認してください\n${createCodeBlock(
					JSON.stringify(error),
			  )}`;
	await postSlackMessage({ text });
};

const handler: VercelApiHandler = async (_req, res) => {
	try {
		const text = await scraping().catch(
			async (error: Error | UnexpectedDomError) => {
				await handleScrapingError(error);
				res.status(400).json({ error });
			},
		);
		if (typeof text !== 'string') {
			return;
		}
		const isOutOfStock = text.includes('No products');
		const baseData = {
			text,
			isOutOfStock,
		};
		if (isOutOfStock) {
			res.status(200).json({
				...baseData,
			});
			return;
		}

		const slackRes = await postSlackMessage({
			text: `${SLACK_MESSAGE_TAG} 目当ての商品が入荷されているかもしれません🚚\n${PAGE_URL}`,
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
