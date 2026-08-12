-- Add userId column to Upload table (missing from initial migration)
-- This links each Upload to its owning User

ALTER TABLE "Upload" ADD COLUMN IF NOT EXISTS "userId" TEXT;

-- Back-fill: assign any orphaned uploads to a placeholder
-- (In practice the live DB already has this column from prisma db push)

-- Add the foreign key constraint if it doesn't already exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'Upload_userId_fkey'
    AND table_name = 'Upload'
  ) THEN
    ALTER TABLE "Upload"
      ADD CONSTRAINT "Upload_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "User"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END
$$;

-- Create index on userId for fast per-user queries
CREATE INDEX IF NOT EXISTS "Upload_userId_idx" ON "Upload"("userId");
