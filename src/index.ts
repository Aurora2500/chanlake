import { archived, thread } from "./requests.js";
import { PrismaClient } from "@prisma/client";

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

// Load all the saved threads into the set

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

		newThreads.forEach(async id => {
			const threadData = await thread(board, id);
			console.log(`Saving thread ${id}`);
			await prisma.$transaction(async tx => {
				await tx.thread.create({
					data: {
						id,
						subject: threadData.subject,
						createdAt: threadData.createdAt,
						archivedAt: threadData.archivedAt,
						posts: {
							create: threadData.posts.map(post => ({
								id: post.id,
								createdAt: post.createdAt,
								content: post.content,
								...(post.name === null? {} : {
									trip: {
										connectOrCreate: {
											where: {
												name: post.name,
												trip: post.trip,
											},
											create: {
												name: post.name,
												trip: post.trip,
												secure: post.trip !== undefined && post.trip.startsWith('!!'),
											}
										}
									}
								})
							}))
						}
					}
				});
				await tx.threadFetch.create({
					data: {
						id: id,
						archiveId,
					}
				});
					threadData.posts.forEach(async post => {
						post.replying.forEach(async reply => {
							try {
								await tx.postReply.create({
									data: {
										postId: post.id,
										refId: reply,
									}
								});
							} catch (e) {
								console.error(e);
							}
						});
					});
			});
		});
	}
}

const intervalTime = 1000 * 60 * 60 * 12; // 12 hours

setInterval(fetchData, intervalTime);
fetchData()