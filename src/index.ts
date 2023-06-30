import { PrismaClientKnownRequestError } from "@prisma/client/runtime/index.js";
import { archived, thread } from "./requests.js";
import { PrismaClient, type Prisma } from "@prisma/client";

const boards = [
	'lgbt',
]

const db_url = process.env.DATABASE_URL;

console.log(`db url: ${db_url}`);

const prisma = new PrismaClient({
	datasources: {
		db: {
			url: db_url,
		}
	}
});



const fetchData = async () => {
	for (let i = 0; i < boards.length; i++) {
		const board = boards[i];

		const threads = await archived(board);
		console.log(`Fetched ${threads.length} threads from ${board} archives`);
		const archiveId = (await prisma.archivedFetch.create({
			data: {
				numberThreads: threads.length,
			}
		})).id;

		const newThreads = threads.filter(async id => {
			const existingThread = await prisma.thread.findUnique({
				where: {
					id,
				}
			});
			return existingThread === null;
		});

		const proms = newThreads.map(async id => {
			//check if thread exists
			const existingThread = await prisma.thread.findFirst({
				where: {
					id,
				}
			});
			if (existingThread !== null) {
				return;
			}
			let threadData;
			try {
				threadData = await thread(board, id);
			} catch (e: any) {
				console.error(`Failed to fetch thread ${id} on board ${board}`);
				return;
			}
			console.log(`Saving thread ${id}`);
			await prisma.thread.create({
				data: {
					id,
					subject: threadData.subject,
					createdAt: threadData.createdAt,
					archivedAt: threadData.archivedAt,
					posts: {
						create: threadData.posts.map((post): Prisma.PostCreateWithoutThreadInput => ({
							id: post.id,
							content: post.content,
							createdAt: post.createdAt,
							trip: post.trip ? {
								connectOrCreate: {
									where: {
										name_trip: {
											name: post.trip.name,
											trip: post.trip.tripcode,
										}
									},
									create: {
										name: post.trip.name,
										trip: post.trip.tripcode,
										secure: post.trip.tripcode.startsWith('!!'),
									}
								}
							} : undefined,
						})),
					}
				}
			});
			await prisma.threadFetch.create({
				data: {
					id: id,
					archiveId,
				}
			});
			for (const post of threadData.posts) {
				for (const reply of post.replying) {
					try {
						await prisma.postReply.create({
							data: {
								postId: post.id,
								refId: reply,
							}
						});
					} catch (e: any) {
						if (e.code !== 'P2003') {
							throw e;
						}
					}
				}
			}
		});
		await Promise.all(proms);
		console.log(`Saved ${newThreads.length} new threads from ${board} archives`);
	}
}

const intervalTime = 1000 * 60 * 60 * 12; // 12 hours

setInterval(fetchData, intervalTime);
fetchData()