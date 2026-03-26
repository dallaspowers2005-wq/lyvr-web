import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();
        
        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get all properties
        const properties = await base44.asServiceRole.entities.Property.list();
        
        const results = [];
        
        for (const property of properties) {
            const brokenImages = [];
            const workingImages = [];
            
            const propertyData = property.data || property;
            
            // Check hero image
            if (propertyData.hero_image) {
                try {
                    const response = await fetch(propertyData.hero_image, { method: 'HEAD' });
                    if (!response.ok) {
                        brokenImages.push(propertyData.hero_image);
                    } else {
                        workingImages.push(propertyData.hero_image);
                    }
                } catch (error) {
                    brokenImages.push(propertyData.hero_image);
                }
            }
            
            // Check gallery images
            if (propertyData.gallery_images && Array.isArray(propertyData.gallery_images)) {
                for (const imageUrl of propertyData.gallery_images) {
                    try {
                        const response = await fetch(imageUrl, { method: 'HEAD' });
                        if (!response.ok) {
                            brokenImages.push(imageUrl);
                        } else {
                            workingImages.push(imageUrl);
                        }
                    } catch (error) {
                        brokenImages.push(imageUrl);
                    }
                }
            }
            
            results.push({
                propertyName: propertyData.name,
                propertyId: property.id,
                totalImages: (propertyData.gallery_images?.length || 0) + (propertyData.hero_image ? 1 : 0),
                brokenCount: brokenImages.length,
                workingCount: workingImages.length,
                brokenImages: brokenImages
            });
        }
        
        return Response.json({ 
            success: true,
            results: results,
            summary: {
                totalProperties: properties.length,
                totalBroken: results.reduce((sum, r) => sum + r.brokenCount, 0),
                totalWorking: results.reduce((sum, r) => sum + r.workingCount, 0)
            }
        });
        
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});