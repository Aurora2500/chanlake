import got from 'got';
import { z } from 'zod';
import {createThrottle} from './ratelimit.js';
import { parseThread } from './parse.js';

const threadListSchema = z.array(
	z.object({
		page: z.number(),
		threads: z.array(
			z.object({
				no: z.number(),
				last_modified: z.number(),
				replies: z.number(),
			})
		),
	})
)

const threadSchema = z.object({
	posts: z.array(
		z.object({
			no: z.number(),
			time: z.number(),
			name: z.string(),
			trip: z.string().optional(),
			sub: z.string().optional(),
			com: z.string().optional(),
			filename: z.string().optional(),
			ext: z.string().optional(),
			unique_ips: z.number().optional(),
			archived_on: z.number().optional(),
		})
	)
});

export type Post = z.infer<typeof threadSchema>['posts'][0];

const archivedSchema = z.array(z.number());

const client = got.extend({
	headers: {
		'User-Agent': 'Chanlake/1.0.0'
	}
});

const throttle = createThrottle(1200);

const get = async (url: string) => {
	await throttle();
	return await client.get(url);
}

export const threadList = async (board: string) => {
	const {body} = await get(`http://a.4cdn.org/${board}/threads.json`);
	const data = threadListSchema.parse(JSON.parse(body));
	return data.flatMap(page => page.threads);
};

export const thread = async (board: string, id: number) => {
	const {body} = await get(`http://a.4cdn.org/${board}/thread/${id}.json`);
	const parsed = threadSchema.parse(JSON.parse(body));
	return parseThread(parsed.posts);
};

export const archived = async (board: string) => {
	const {body} = await get(`http://a.4cdn.org/${board}/archive.json`);
	return archivedSchema.parse(JSON.parse(body));
}