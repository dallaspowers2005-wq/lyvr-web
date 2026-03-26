import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch Epic Resort
    const properties = await base44.entities.Property.filter({ name: 'Epic Resort' });
    
    if (!properties || properties.length === 0) {
      return Response.json({ error: 'Epic Resort not found' }, { status: 404 });
    }

    const property = properties[0];
    const originalCount = property.gallery_images.length;
    
    // Remove first image (index 0)
    const updatedImages = property.gallery_images.slice(1);
    
    // Update property
    await base44.entities.Property.update(property.id, {
      gallery_images: updatedImages
    });

    return Response.json({
      success: true,
      message: 'Image 1 removed',
      originalCount: originalCount,
      newCount: updatedImages.length,
      removedImageUrl: property.gallery_images[0]
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});