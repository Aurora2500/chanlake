import type { Post as ChanPost } from "./requests.js";

/* Incoming text data from 4chan comes encoded in a sort of HTML format.
 * Because of this, we need to parse the text and convert it to a more simple format.
 * This includes:
 * - Converting escaped HTML characters to their normal form.
 * - Converting <br> tags to newlines.
 * - converting replies from tags to parentheticals.
 * - converting <a> tags to angle brackets.
 * */

const charMap: Record<string, string> = {
	'Tab': '\t',
	'Newline': '\n',
	'nbsp': ' ',
	'lt': '<',
	'gt': '>',
	'amp': '&',
	'quot': '"',
};

const re = /&(?:([A-Za-z]+)|#(\d+));/g;

const cleanText = (text: string): string => {
	re.lastIndex = 0;
	let match: RegExpExecArray | null;
	while (match = re.exec(text)) {
		if (match[1] !== undefined) {
			text = text.replaceAll(match[0], charMap[match[1]] || "");
		} else {
			text = text.replaceAll(match[0], String.fromCharCode(parseInt(match[2])));
		}
		re.lastIndex = match.index + 1;
	}
	return text;
}

const reLink = /<a href="(?:\/[a-z0-9]+\/thread\/\d+)?#p\d+" class="quotelink">&gt;&gt;(\d+)<\/a>/g;

type ParsedPost = {
	text: string,
	replies: number[],
}

export const parse = (text: string): ParsedPost => {
	// convert br tags to newlines
	text = text.replaceAll(/<br>/g, "\n");
	// remove all trailing spaces
	text = text.replaceAll(/ +\n/g, "\n");
	// convert escaped characters to their normal form

	// convert replies to parentheticals
	let replies: number[] = [];
	let replyMatch: RegExpExecArray | null;
	while (replyMatch = reLink.exec(text)) {
		replies.push(parseInt(replyMatch[1]));
		text = text.replaceAll(replyMatch[0], `(${replyMatch[1]})`);
		reLink.lastIndex = replyMatch.index + 1;
	}

	// remove span tags
	text = text.replaceAll(/<span class="quote">/g, "");
	text = text.replaceAll(/<\/span>/g, "");

	text = cleanText(text);

	return {
		text,
		replies,
	};
}

export type Trip = {
	name: string,
	tripcode: string,
}

export type Post = {
	id: number,
	trip?: Trip,
	content: string,
	replying: number[],
	createdAt: Date,
}

export type Thread = {
	subject?: string,
	ips: number,
	createdAt: Date,
	archivedAt: Date,
	posts: Post[],
}

export const parseThread = (posts: ChanPost[]): Thread => {

	const op = posts[0];

	return {
		subject: op.sub === undefined ? undefined : cleanText(op.sub),
		ips: op.unique_ips!,
		createdAt: new Date(op.time * 1000),
		archivedAt: new Date(op.archived_on! * 1000),
		posts: posts.map(post => {
			const trip: Trip | undefined = (post.trip === undefined && post.name === 'Anonymous') ? undefined : {
				name: cleanText(post.name || ""),
				tripcode: post.trip || "",
			}
			const p = parse(post.com || "");
			return {
				id: post.no,
				trip,
				content: p.text,
				replying: p.replies,
				createdAt: new Date(post.time * 1000),
			};
		}),
	}

};