-- CreateTable
CREATE TABLE "User" (
    "user_id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "email" VARCHAR(60) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "status" VARCHAR(255) NOT NULL,
    "lastActivity" TIMESTAMP NOT NULL,
    "lastLogin" TIMESTAMP NOT NULL,
    "registerTime" TIMESTAMP NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_user_id_key" ON "User"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
