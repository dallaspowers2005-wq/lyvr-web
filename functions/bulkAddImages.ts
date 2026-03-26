import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();
        
        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { propertyName, imageUrls } = await req.json();
        
        if (!propertyName || !imageUrls || !Array.isArray(imageUrls)) {
            return Response.json({ error: 'propertyName and imageUrls array are required' }, { status: 400 });
        }

        if (imageUrls.length > 150) {
            return Response.json({ error: 'Maximum 150 images allowed at once' }, { status: 400 });
        }
        
        // Get the property
        const properties = await base44.asServiceRole.entities.Property.filter({ name: propertyName });
        
        if (!properties || properties.length === 0) {
            return Response.json({ error: 'Property not found' }, { status: 404 });
        }
        
        const property = properties[0];
        const propertyData = property.data || property;
        
        // Get existing gallery images or initialize empty array
        const existingImages = propertyData.gallery_images || [];
        
        // Combine existing with new images
        const updatedImages = [...existingImages, ...imageUrls];
        
        // Update property
        await base44.asServiceRole.entities.Property.update(property.id, {
            gallery_images: updatedImages
        });
        
        return Response.json({ 
            success: true,
            propertyName: propertyData.name,
            addedCount: imageUrls.length,
            totalImages: updatedImages.length,
            previousTotal: existingImages.length
        });
        
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});