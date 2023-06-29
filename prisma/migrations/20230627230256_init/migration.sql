-- CreateTable
CREATE TABLE "Thread" (
    "id" INTEGER NOT NULL,
    "subject" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Thread_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" INTEGER NOT NULL,
    "content" TEXT,
    "threadId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "tripId" INTEGER,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostReply" (
    "postId" INTEGER NOT NULL,
    "refId" INTEGER NOT NULL,

    CONSTRAINT "PostReply_pkey" PRIMARY KEY ("postId","refId")
);

-- CreateTable
CREATE TABLE "Trip" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "trip" TEXT,
    "secure" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Trip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "archivedFetch" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "numberThreads" INTEGER NOT NULL,

    CONSTRAINT "archivedFetch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "threadFetch" (
    "id" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "archiveId" INTEGER NOT NULL,

    CONSTRAINT "threadFetch_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "Thread"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostReply" ADD CONSTRAINT "PostReply_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostReply" ADD CONSTRAINT "PostReply_refId_fkey" FOREIGN KEY ("refId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "threadFetch" ADD CONSTRAINT "threadFetch_id_fkey" FOREIGN KEY ("id") REFERENCES "Thread"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "threadFetch" ADD CONSTRAINT "threadFetch_archiveId_fkey" FOREIGN KEY ("archiveId") REFERENCES "archivedFetch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
