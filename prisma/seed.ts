import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const prisma = new PrismaClient();

async function importEvent(jsonData: any) {
    try {
        // Athuga hvort eigandi sé til
        const ownerExists = jsonData.owner ? await prisma.user.findUnique({
            where: { id: jsonData.owner }
        }) : null;

        // Búa til viðburð
        const event = await prisma.event.create({
            data: {
                id: jsonData.id,
                eventId: jsonData.event_id,
                titleIs: jsonData.language.is.title,
                titleEn: jsonData.language.en.title,
                textIs: jsonData.language.is.text,
                textEn: jsonData.language.en.text,
                place: jsonData.language.is.place,
                formattedAddress: jsonData.formatted_address,
                city: jsonData.city,
                postal: jsonData.postal,
                street: jsonData.street,
                start: new Date(jsonData.start),
                end: new Date(jsonData.end),
                occurrence: jsonData.occurrence,
                eventImage: jsonData.event_image,
                thumbnailImage: jsonData.thumbnail_image,
                accepted: jsonData.accepted,
                active: jsonData.active,
                legacy: jsonData.legacy,
                template: jsonData.template,
                owner: ownerExists ? jsonData.owner : null,
                website: jsonData.media?.website,
                facebook: jsonData.media?.facebook,
                tickets: jsonData.media?.tickets,
                
                // Búa til tengda hluti
                location: jsonData.location ? {
                    create: {
                        latitude: jsonData.location[0],
                        longitude: jsonData.location[1]
                    }
                } : undefined,
                
                tags: {
                    create: jsonData.tags.map((tag: string) => ({
                        tag: tag
                    }))
                },
                
                image: jsonData.image ? {
                    create: {
                        time: jsonData.image.time,
                        path: jsonData.image.path,
                        small: jsonData.image.small,
                        medium: jsonData.image.medium,
                        large: jsonData.image.large,
                        xlarge: jsonData.image.xlarge,
                        original: jsonData.image.original,
                        imageId: jsonData.image.image_id
                    }
                } : undefined,
                
                // Bæta við dagsetningum ef þær eru til
                dates: jsonData.dates.length > 0 ? {
                        create: jsonData.dates.map((date: string) => ({
                            date: new Date(date)
                    }))
                } : undefined
            }
        })
        
        console.log('Event imported successfully:', event.id)
    } catch (error) {
        console.error('Error importing event:', error)
    }
}

async function main() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const dataPath = path.join(__dirname, '../data/events.json');
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

    for (const item of data) {
        await importEvent(item);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
});