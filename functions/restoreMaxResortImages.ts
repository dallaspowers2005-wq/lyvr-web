import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();
        
        if (user?.role !== 'admin') {
            return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
        }

        // Get The Max Resort property
        const properties = await base44.asServiceRole.entities.Property.filter({ 
            name: 'The Max Resort' 
        });
        
        if (properties.length === 0) {
            return Response.json({ error: 'Property not found' }, { status: 404 });
        }
        
        const property = properties[0];
        const currentImages = property.gallery_images || [];
        
        // The broken images that were removed (from the previous function output)
        const brokenImages = [
            { index: 57, url: "https://base44.app/api/apps/693113f3a59cea8a7e5c0a56/files/public/693113f3a59cea8a7e5c0a56/0d1efe6b9_Screenshot2026-02-04at85705PM.png" },
            { index: 58, url: "https://base44.app/api/apps/693113f3a59cea8a7e5c0a56/files/public/693113f3a59cea8a7e5c0a56/1d0802f22_Screenshot2026-02-04at85708PM.png" },
            { index: 59, url: "https://base44.app/api/apps/693113f3a59cea8a7e5c0a56/files/public/693113f3a59cea8a7e5c0a56/a03af696f_Screenshot2026-02-04at85710PM.png" },
            { index: 60, url: "https://base44.app/api/apps/693113f3a59cea8a7e5c0a56/files/public/693113f3a59cea8a7e5c0a56/55ed8c97e_Screenshot2026-02-04at85714PM.png" },
            { index: 61, url: "https://base44.app/api/apps/693113f3a59cea8a7e5c0a56/files/public/693113f3a59cea8a7e5c0a56/c13c83e77_Screenshot2026-02-04at85717PM.png" },
            { index: 62, url: "https://base44.app/api/apps/693113f3a59cea8a7e5c0a56/files/public/693113f3a59cea8a7e5c0a56/c4ec50a12_Screenshot2026-02-04at85719PM.png" },
            { index: 63, url: "https://base44.app/api/apps/693113f3a59cea8a7e5c0a56/files/public/693113f3a59cea8a7e5c0a56/dba09d9dc_Screenshot2026-02-04at85721PM.png" },
            { index: 64, url: "https://base44.app/api/apps/693113f3a59cea8a7e5c0a56/files/public/693113f3a59cea8a7e5c0a56/7a97f8bc8_Screenshot2026-02-04at85726PM.png" },
            { index: 65, url: "https://base44.app/api/apps/693113f3a59cea8a7e5c0a56/files/public/693113f3a59cea8a7e5c0a56/64dc71d69_Screenshot2026-02-04at85728PM.png" },
            { index: 66, url: "https://base44.app/api/apps/693113f3a59cea8a7e5c0a56/files/public/693113f3a59cea8a7e5c0a56/e24b61277_Screenshot2026-02-04at85731PM.png" },
            { index: 67, url: "https://base44.app/api/apps/693113f3a59cea8a7e5c0a56/files/public/693113f3a59cea8a7e5c0a56/6c00077c0_Screenshot2026-02-04at85734PM.png" },
            { index: 68, url: "https://base44.app/api/apps/693113f3a59cea8a7e5c0a56/files/public/693113f3a59cea8a7e5c0a56/3bc71cf50_Screenshot2026-02-04at85736PM.png" },
            { index: 69, url: "https://base44.app/api/apps/693113f3a59cea8a7e5c0a56/files/public/693113f3a59cea8a7e5c0a56/3c66adbfd_Screenshot2026-02-04at85738PM.png" },
            { index: 70, url: "https://base44.app/api/apps/693113f3a59cea8a7e5c0a56/files/public/693113f3a59cea8a7e5c0a56/e7ddae7a6_Screenshot2026-02-04at85741PM.png" },
            { index: 71, url: "https://base44.app/api/apps/693113f3a59cea8a7e5c0a56/files/public/693113f3a59cea8a7e5c0a56/b0e6cb48d_Screenshot2026-02-04at85743PM.png" },
            { index: 72, url: "https://base44.app/api/apps/693113f3a59cea8a7e5c0a56/files/public/693113f3a59cea8a7e5c0a56/cb2ff0e51_Screenshot2026-02-04at85746PM.png" },
            { index: 73, url: "https://base44.app/api/apps/693113f3a59cea8a7e5c0a56/files/public/693113f3a59cea8a7e5c0a56/6097aa9f3_Screenshot2026-02-04at85748PM.png" },
            { index: 74, url: "https://base44.app/api/apps/693113f3a59cea8a7e5c0a56/files/public/693113f3a59cea8a7e5c0a56/85dbed3cd_Screenshot2026-02-04at85750PM.png" },
            { index: 75, url: "https://base44.app/api/apps/693113f3a59cea8a7e5c0a56/files/public/693113f3a59cea8a7e5c0a56/c6c1d0bcd_Screenshot2026-02-04at85753PM.png" },
            { index: 76, url: "https://base44.app/api/apps/693113f3a59cea8a7e5c0a56/files/public/693113f3a59cea8a7e5c0a56/8dc6d1b54_Screenshot2026-02-04at85755PM.png" },
            { index: 77, url: "https://base44.app/api/apps/693113f3a59cea8a7e5c0a56/files/public/693113f3a59cea8a7e5c0a56/4e38b5d9c_Screenshot2026-02-04at85757PM.png" },
            { index: 78, url: "https://base44.app/api/apps/693113f3a59cea8a7e5c0a56/files/public/693113f3a59cea8a7e5c0a56/d61fcfa68_Screenshot2026-02-04at85800PM.png" },
            { index: 79, url: "https://base44.app/api/apps/693113f3a59cea8a7e5c0a56/files/public/693113f3a59cea8a7e5c0a56/d28ce6e2d_Screenshot2026-02-04at85802PM.png" },
            { index: 80, url: "https://base44.app/api/apps/693113f3a59cea8a7e5c0a56/files/public/693113f3a59cea8a7e5c0a56/9084fc8b6_Screenshot2026-02-04at85805PM.png" },
            { index: 81, url: "https://base44.app/api/apps/693113f3a59cea8a7e5c0a56/files/public/693113f3a59cea8a7e5c0a56/2f7c2e4d6_Screenshot2026-02-04at85807PM.png" },
            { index: 82, url: "https://base44.app/api/apps/693113f3a59cea8a7e5c0a56/files/public/693113f3a59cea8a7e5c0a56/21c4b3f6c_Screenshot2026-02-04at85810PM.png" },
            { index: 83, url: "https://base44.app/api/apps/693113f3a59cea8a7e5c0a56/files/public/693113f3a59cea8a7e5c0a56/5b49e6597_Screenshot2026-02-04at85812PM.png" },
            { index: 84, url: "https://base44.app/api/apps/693113f3a59cea8a7e5c0a56/files/public/693113f3a59cea8a7e5c0a56/ef5a1d7a1_Screenshot2026-02-04at85815PM.png" }
        ];
        
        // Reconstruct the original array by inserting broken images at their original positions
        const restoredImages = [...currentImages];
        for (const broken of brokenImages) {
            restoredImages.splice(broken.index, 0, broken.url);
        }
        
        // Update property with restored images
        await base44.asServiceRole.entities.Property.update(property.id, {
            gallery_images: restoredImages
        });
        
        return Response.json({ 
            success: true,
            previousCount: currentImages.length,
            restoredCount: restoredImages.length,
            addedBack: brokenImages.length
        });
        
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});