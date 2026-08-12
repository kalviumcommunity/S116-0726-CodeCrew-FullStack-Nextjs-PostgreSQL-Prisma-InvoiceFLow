import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function profile() {
  console.log("=== Database Profiling ===");

  const upload = await prisma.upload.findFirst({
    orderBy: { invoices: { _count: 'desc' } },
    include: {
      _count: { select: { invoices: true } }
    }
  });

  if (!upload) {
    console.log("No uploads found");
    return;
  }

  const userId = upload.userId;
  console.log(`Profiling user ${userId} with a large upload (${upload._count.invoices} invoices).`);

  // 1. Profile /api/invoices query
  console.log("\n--- Profiling /api/invoices query ---");
  const startInvoices = Date.now();
  const invoices = await prisma.invoice.findMany({
    where: { upload: { userId } },
    include: { upload: true },
    orderBy: { createdAt: 'desc' }
  });
  const invoicesTime = Date.now() - startInvoices;
  const invoicesPayload = JSON.stringify(invoices).length;
  console.log(`Fetched ${invoices.length} invoices in ${invoicesTime}ms. Payload size: ${(invoicesPayload / (1024*1024)).toFixed(2)} MB`);

  // 2. Profile /api/uploads query
  console.log("\n--- Profiling /api/uploads query ---");
  const startUploads = Date.now();
  const uploads = await prisma.upload.findMany({
    where: { userId },
    orderBy: { uploadDate: 'desc' }
  });
  const uploadsTime = Date.now() - startUploads;
  const uploadsPayload = JSON.stringify(uploads).length;
  console.log(`Fetched ${uploads.length} uploads in ${uploadsTime}ms. Payload size: ${(uploadsPayload / (1024*1024)).toFixed(2)} MB`);

  // 3. Profile /api/uploads/[uploadId]/invoices query
  console.log(`\n--- Profiling /api/uploads/[uploadId]/invoices query for upload ${upload.id} ---`);
  const startUploadInvoices = Date.now();
  const uploadInvoices = await prisma.invoice.findMany({
    where: { uploadId: upload.id },
    orderBy: { createdAt: 'asc' }
  });
  const uploadInvoicesTime = Date.now() - startUploadInvoices;
  const uploadInvoicesPayload = JSON.stringify(uploadInvoices).length;
  console.log(`Fetched ${uploadInvoices.length} invoices in ${uploadInvoicesTime}ms. Payload size: ${(uploadInvoicesPayload / (1024*1024)).toFixed(2)} MB`);

  // 4. Test optimization for dashboard stats
  console.log("\n--- Testing DB Aggregation for Dashboard ---");
  const startAgg = Date.now();
  
  const uploadsAgg = await prisma.upload.groupBy({
    by: ['status'],
    where: { userId },
    _count: { _all: true }
  });
  
  const invoicesAgg = await prisma.invoice.groupBy({
    by: ['status'],
    where: { upload: { userId } },
    _count: { _all: true }
  });
  
  const aggTime = Date.now() - startAgg;
  console.log(`Aggregations completed in ${aggTime}ms.`);
  console.log("Uploads agg:", uploadsAgg);
  console.log("Invoices agg:", invoicesAgg);
  
}

profile().catch(console.error).finally(() => prisma.$disconnect());
