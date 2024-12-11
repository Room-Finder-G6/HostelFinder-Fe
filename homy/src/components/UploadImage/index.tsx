import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

interface UploadImageProps {
    onImageUpload: (files: File[], currentUrls: string[], deletedUrls: string[]) => void;
    multiple?: boolean;
    accept?: string;
    existingImages?: string[];
}

const UploadImage: React.FC<UploadImageProps> = ({
                                                     onImageUpload,
                                                     multiple = false,
                                                     accept = "image/*",
                                                     existingImages = []
                                                 }) => {
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [deletedUrls, setDeletedUrls] = useState<string[]>([]);

    useEffect(() => {
        if (existingImages.length > 0) {
            setPreviewUrls(existingImages);
        }
    }, [existingImages]);

    const validateFile = (file: File): boolean => {
        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
            toast.error(`File ${file.name} không phải là file ảnh hợp lệ. Chỉ chấp nhận các file JPEG, PNG, GIF và WebP.`);
            return false;
        }

        if (file.size > MAX_FILE_SIZE) {
            toast.error(`File ${file.name} vượt quá kích thước tối đa (3MB).`);
            return false;
        }

        return true;
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        const validFiles: File[] = [];
        const newPreviewUrls: string[] = [];

        files.forEach(file => {
            if (validateFile(file)) {
                validFiles.push(file);
                newPreviewUrls.push(URL.createObjectURL(file));
            }
        });

        if (validFiles.length > 0) {
            let updatedFiles: File[];
            let updatedUrls: string[];

            if (multiple) {
                updatedFiles = [...selectedFiles, ...validFiles];
                updatedUrls = [...previewUrls, ...newPreviewUrls];
            } else {
                previewUrls.forEach(url => {
                    if (url.startsWith('blob:')) {
                        URL.revokeObjectURL(url);
                    }
                });
                updatedFiles = [validFiles[0]];
                updatedUrls = [newPreviewUrls[0]];
            }

            setSelectedFiles(updatedFiles);
            setPreviewUrls(updatedUrls);
            onImageUpload(updatedFiles, updatedUrls, deletedUrls);
        }

        event.target.value = '';
    };

    const removeImage = (index: number) => {
        const urlToRemove = previewUrls[index];

        if (urlToRemove.startsWith('blob:')) {
            URL.revokeObjectURL(urlToRemove);
            const newFiles = selectedFiles.filter((_, i) => {
                const fileIndex = previewUrls.findIndex(url => url.startsWith('blob:')) + i;
                return fileIndex !== index;
            });
            setSelectedFiles(newFiles);
        } else {
            setDeletedUrls(prev => [...prev, urlToRemove]);
        }

        const newUrls = previewUrls.filter((_, i) => i !== index);
        setPreviewUrls(newUrls);
        onImageUpload(selectedFiles, newUrls, [...deletedUrls, urlToRemove]);
    };

    useEffect(() => {
        return () => {
            previewUrls.forEach(url => {
                if (url.startsWith('blob:')) {
                    URL.revokeObjectURL(url);
                }
            });
        };
    }, []);

    return (
        <div className="dash-input-wrapper mb-20">
            <div className="image-preview-container mb-5"
                 style={{display: 'flex', gap: '10px', flexWrap: 'nowrap', overflowX: 'auto'}}>
                {previewUrls.map((url, index) => (
                    <div key={index} className="preview-image-container position-relative">
                        <img
                            src={url}
                            alt={`Preview ${index + 1}`}
                            className="preview-image"
                            style={{width: '100px', height: '100px', objectFit: 'cover'}}
                        />
                        <button
                            type="button"
                            className="remove-image-btn position-absolute top-0 end-0 bg-danger text-white border-0 rounded-circle"
                            onClick={() => removeImage(index)}
                            style={{width: '20px', height: '20px', padding: 0, lineHeight: '1'}}
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>
            <div className="dash-btn-one d-inline-block position-relative me-3">
                <i className="bi bi-plus"></i>
                Tải ảnh lên
                <input
                    type="file"
                    accept={accept}
                    onChange={handleFileChange}
                    multiple={multiple}
                    className="upload-input"
                />
            </div>
        </div>
    );
};

export default UploadImage;