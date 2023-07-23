-- CreateTable
CREATE TABLE "threads" (
    "id" INTEGER NOT NULL,
    "subject" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL,
    "archived_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "threads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "posts" (
    "id" INTEGER NOT NULL,
    "content" TEXT,
    "thread_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "trip_id" INTEGER,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_replies" (
    "post_id" INTEGER NOT NULL,
    "ref_id" INTEGER NOT NULL,

    CONSTRAINT "post_replies_pkey" PRIMARY KEY ("post_id","ref_id")
);

-- CreateTable
CREATE TABLE "images" (
    "post_id" INTEGER NOT NULL,
    "filename" TEXT NOT NULL,
    "extension" TEXT NOT NULL,
    "md5" TEXT NOT NULL,
    "file_size" INTEGER NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,

    CONSTRAINT "images_pkey" PRIMARY KEY ("post_id")
);

-- CreateTable
CREATE TABLE "trips" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "trip" TEXT NOT NULL,
    "secure" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "trips_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "archived_fetches" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "number_threads" INTEGER NOT NULL,

    CONSTRAINT "archived_fetches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "thread_fetches" (
    "id" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "archive_id" INTEGER NOT NULL,

    CONSTRAINT "thread_fetches_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "trips_name_trip_key" ON "trips"("name", "trip");

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_thread_id_fkey" FOREIGN KEY ("thread_id") REFERENCES "threads"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_replies" ADD CONSTRAINT "post_replies_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_replies" ADD CONSTRAINT "post_replies_ref_id_fkey" FOREIGN KEY ("ref_id") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "thread_fetches" ADD CONSTRAINT "thread_fetches_id_fkey" FOREIGN KEY ("id") REFERENCES "threads"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "thread_fetches" ADD CONSTRAINT "thread_fetches_archive_id_fkey" FOREIGN KEY ("archive_id") REFERENCES "archived_fetches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
