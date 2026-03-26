import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        
        const user = await base44.auth.me();
        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { imageUrls } = await req.json();
        
        if (!imageUrls || !Array.isArray(imageUrls)) {
            return Response.json({ error: 'imageUrls array is required' }, { status: 400 });
        }

        const uploadedUrls = [];

        for (const url of imageUrls) {
            try {
                // Fetch the image from the external URL
                const imageResponse = await fetch(url);
                if (!imageResponse.ok) {
                    console.error(`Failed to fetch image: ${url}`);
                    continue;
                }

                const imageBlob = await imageResponse.blob();
                
                // Extract filename from URL
                const urlParts = url.split('/');
                const filename = urlParts[urlParts.length - 1] || 'image.png';

                // Create a File object from the blob
                const file = new File([imageBlob], filename, { type: imageBlob.type });

                // Upload to Base44 storage
                const uploadResult = await base44.asServiceRole.integrations.Core.UploadFile({ file });
                uploadedUrls.push(uploadResult.file_url);
            } catch (error) {
                console.error(`Error processing image ${url}:`, error);
            }
        }

        return Response.json({ 
            success: true, 
            uploadedUrls,
            count: uploadedUrls.length 
        });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});