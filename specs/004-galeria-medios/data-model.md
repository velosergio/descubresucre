# Data model

## GalleryAsset

- `id` String @id cuid
- `kind` Enum IMAGE | VIDEO
- `publicUrl` String @unique
- `mimeType` String?
- `sizeBytes` Int?
- `originalName` String?
- `createdAt` DateTime
