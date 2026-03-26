import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Upload, Check, X, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function ImageUploader() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState([]);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [error, setError] = useState(null);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    setUploadedUrls([]);
    setError(null);
  };

  const uploadImages = async () => {
    if (selectedFiles.length === 0) return;

    setUploading(true);
    setError(null);
    const urls = [];

    try {
      setProgress({ current: 0, total: selectedFiles.length });

      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const response = await base44.integrations.Core.UploadFile({ file });
        urls.push(response.file_url);
        setProgress({ current: i + 1, total: selectedFiles.length });
      }

      setUploadedUrls(urls);
      alert('All images uploaded successfully! Copy the URLs below.');
    } catch (err) {
      setError(err.message);
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const copyToClipboard = () => {
    const formattedUrls = uploadedUrls.map(url => `    '${url}'`).join(',\n');
    navigator.clipboard.writeText(formattedUrls);
    alert('URLs copied to clipboard! You can now paste them into your code.');
  };

  return (
    <div className="min-h-screen bg-stone-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link 
            to={createPageUrl('Home')} 
            className="text-amber-600 hover:underline"
          >
            ← Back to Home
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-stone-800 mb-2">Bulk Image Uploader</h1>
          <p className="text-stone-600 mb-8">Upload your property gallery images to Base44 storage</p>

          <div className="space-y-6">
            {/* File Input */}
            <div>
              <label className="block mb-2 text-stone-700 font-medium">
                Select Images (up to 75)
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="block w-full text-sm text-stone-500
                  file:mr-4 file:py-3 file:px-6
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-amber-50 file:text-amber-700
                  hover:file:bg-amber-100
                  cursor-pointer"
              />
              {selectedFiles.length > 0 && (
                <p className="mt-2 text-sm text-stone-600">
                  {selectedFiles.length} images selected
                </p>
              )}
            </div>

            {/* Upload Button */}
            <Button
              onClick={uploadImages}
              disabled={selectedFiles.length === 0 || uploading}
              className="w-full h-14 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-lg font-medium"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Uploading {progress.current} / {progress.total}...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5 mr-2" />
                  Upload All Images
                </>
              )}
            </Button>

            {/* Error Display */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <X className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-red-800">Upload Failed</p>
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              </div>
            )}

            {/* Success Display */}
            {uploadedUrls.length > 0 && (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-green-800">Upload Complete!</p>
                    <p className="text-sm text-green-600">{uploadedUrls.length} images uploaded successfully</p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="font-medium text-stone-700">New URLs (ready to use)</label>
                    <Button
                      onClick={copyToClipboard}
                      variant="outline"
                      size="sm"
                    >
                      Copy All URLs
                    </Button>
                  </div>
                  <textarea
                    readOnly
                    value={uploadedUrls.map(url => `    '${url}'`).join(',\n')}
                    className="w-full h-64 p-4 font-mono text-xs bg-stone-50 border border-stone-300 rounded-lg"
                  />
                  <p className="text-sm text-stone-600 mt-2">
                    Copy these URLs and replace the gallery_images array in your PropertyDetail.js file
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-6">
          <h2 className="font-semibold text-amber-900 mb-2">Instructions:</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm text-amber-800">
            <li>Select all 75 images from your computer using the file picker above</li>
            <li>Click "Upload All Images" and wait for the upload to complete</li>
            <li>Once done, click "Copy All URLs" to copy the formatted array</li>
            <li>Open your code editor and find the PropertyDetail.js file</li>
            <li>Replace the gallery_images array (lines 28-103) with the copied URLs</li>
          </ol>
        </div>
      </div>
    </div>
  );
}