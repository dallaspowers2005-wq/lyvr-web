import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();
        
        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { propertyName } = await req.json();
        
        // Get the property
        const properties = await base44.asServiceRole.entities.Property.filter({ name: propertyName });
        
        if (!properties || properties.length === 0) {
            return Response.json({ error: 'Property not found' }, { status: 404 });
        }
        
        const property = properties[0];
        const propertyData = property.data || property;
        
        const brokenImages = [];
        const workingImages = [];
        
        // Check and filter gallery images only (keep hero)
        if (propertyData.gallery_images && Array.isArray(propertyData.gallery_images)) {
            for (const imageUrl of propertyData.gallery_images) {
                try {
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
                    
                    const response = await fetch(imageUrl, { 
                        method: 'GET',
                        signal: controller.signal,
                        headers: {
                            'User-Agent': 'Mozilla/5.0'
                        }
                    });
                    
                    clearTimeout(timeoutId);
                    
                    // Check if response is actually an image
                    const contentType = response.headers.get('content-type');
                    const isImage = contentType && contentType.startsWith('image/');
                    
                    if (response.ok && response.status === 200 && isImage) {
                        workingImages.push(imageUrl);
                    } else {
                        brokenImages.push(imageUrl);
                    }
                } catch (error) {
                    brokenImages.push(imageUrl);
                }
            }
        }
        
        // Update property with only working images
        await base44.asServiceRole.entities.Property.update(property.id, {
            gallery_images: workingImages
        });
        
        return Response.json({ 
            success: true,
            propertyName: propertyData.name,
            removed: brokenImages.length,
            kept: workingImages.length,
            brokenImages: brokenImages
        });
        
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});