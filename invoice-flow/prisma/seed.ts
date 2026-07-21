import pkg from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
const { PrismaClient } = pkg as any;

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const uploadFiles = [
    'GST_April.csv',
    'GST_May.csv',
    'June_Invoices.csv',
    'July_Invoices.csv',
    'August_GST.csv',
];

const uploadStatuses = ['PROCESSING', 'COMPLETED', 'FAILED', 'COMPLETED', 'PROCESSING'] as const;
const invoiceStatuses = ['PROCESSING', 'MATCH', 'MISMATCH', 'FAILED'] as const;

const customerNames = [
    'Acme Corp',
    'Bright Solutions',
    'Cedar Supplies',
    'Delta Traders',
    'Evergreen LLC',
    'Fairview Services',
    'Greenfield Co',
    'Harbor Logistics',
    'Ivy Manufacturing',
    'Jetstream Inc',
    'Kingsley Retail',
    'Lumen Tech'
];

function randomDate(start: Date, end: Date) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function randomAmount(min = 50, max = 5000) {
    return (Math.random() * (max - min) + min).toFixed(2);
}

async function main() {
    console.log('Clearing existing data (invoices -> uploads)...');
    await prisma.invoice.deleteMany();
    await prisma.upload.deleteMany();

    console.log('Creating uploads...');
    const uploads = [] as { id: string; fileName: string }[];

    for (let i = 0; i < uploadFiles.length; i++) {
        const u = await prisma.upload.create({
            data: {
                fileName: uploadFiles[i],
                uploadDate: randomDate(new Date(2026, 3, 1), new Date()),
                status: uploadStatuses[i] as any,
                totalRows: 0,
                successfulRows: 0,
                failedRows: 0,
            },
        });
        uploads.push({ id: u.id, fileName: u.fileName });
    }

    console.log('Creating invoices and assigning to uploads...');
    const invoicesData: any[] = [];
    const totalInvoices = 50;

    for (let i = 1; i <= totalInvoices; i++) {
        const invoiceNumber = `INV${String(i).padStart(3, '0')}`;
        const customerName = customerNames[Math.floor(Math.random() * customerNames.length)];
        const invoiceDate = randomDate(new Date(2026, 0, 1), new Date());
        const amount = randomAmount();
        const status = invoiceStatuses[Math.floor(Math.random() * invoiceStatuses.length)];
        const upload = uploads[(i - 1) % uploads.length];

        invoicesData.push({
            invoiceNumber,
            customerName,
            invoiceDate,
            amount: amount,
            status: status as any,
            uploadId: upload.id,
            errorMessage: status === 'FAILED' ? 'Failed to parse row' : null,
        });
    }

    // Bulk insert invoices
    // Note: createMany doesn't return created records, but it's faster for seeding.
    await prisma.invoice.createMany({ data: invoicesData as any });

    console.log('Updating upload totals...');
    for (const u of uploads) {
        const totalRows = await prisma.invoice.count({ where: { uploadId: u.id } });
        const successfulRows = await prisma.invoice.count({ where: { uploadId: u.id, status: 'MATCH' } });
        const failedRows = await prisma.invoice.count({ where: { uploadId: u.id, status: 'FAILED' } });

        await prisma.upload.update({
            where: { id: u.id },
            data: { totalRows, successfulRows, failedRows },
        });
    }

    console.log('Seeding complete.');
}

main()
    .catch((e) => {
        console.error('Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
