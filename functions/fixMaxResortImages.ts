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
        const galleryImages = property.gallery_images || [];
        
        // Check each image and keep only working ones
        const workingImages = [];
        const brokenImages = [];
        
        for (let i = 0; i < galleryImages.length; i++) {
            const imageUrl = galleryImages[i];
            try {
                const response = await fetch(imageUrl, { method: 'HEAD', signal: AbortSignal.timeout(5000) });
                if (response.ok) {
                    workingImages.push(imageUrl);
                } else {
                    brokenImages.push({ index: i, url: imageUrl, status: response.status });
                }
            } catch (error) {
                brokenImages.push({ index: i, url: imageUrl, error: error.message });
            }
        }
        
        // Update property with only working images
        await base44.asServiceRole.entities.Property.update(property.id, {
            gallery_images: workingImages
        });
        
        return Response.json({ 
            success: true,
            originalCount: galleryImages.length,
            workingCount: workingImages.length,
            removedCount: brokenImages.length,
            brokenImages: brokenImages
        });
        
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});