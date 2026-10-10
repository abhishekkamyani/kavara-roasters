import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from "@/auth";

const f = createUploadthing();

export const ourFileRouter = {
  productImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      const session = await auth();
      if (session?.user?.role !== "ADMIN") {
        throw new UploadThingError("Only admins can upload product images.");
      }
      return { uploadedBy: session.user.id };
    })
    .onUploadComplete(({ metadata, file }) => {
      return { uploadedBy: metadata.uploadedBy, url: file.ufsUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
