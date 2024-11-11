import React, { useState, useEffect } from 'react';

interface UploadImageProps {
    onImageUpload: (files: File[]) => void;
    multiple?: boolean;
    existingImages?: string[]; // Sử dụng mảng chuỗi URL cho ảnh đã tồn tại
}

const UploadImage: React.FC<UploadImageProps> = ({ onImageUpload, multiple = false, existingImages = [] }) => {
    const [filePreviews, setFilePreviews] = useState<{ file?: File; previewUrl: string }[]>([]);

    useEffect(() => {
        // Load các URL xem trước cho ảnh đã tồn tại
        if (existingImages.length) {
            const previews = existingImages.map(url => ({
                previewUrl: url
            }));
            setFilePreviews(previews);
        }
    }, [existingImages]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        if (files.length) {
            const newPreviews = files.map(file => ({
                file,
                previewUrl: URL.createObjectURL(file)
            }));
            setFilePreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
            onImageUpload([...filePreviews.map(fp => fp.file).filter(Boolean) as File[], ...files]);
        }
    };

    const handleRemoveFile = (index: number) => {
        setFilePreviews(prevPreviews => {
            const updatedPreviews = prevPreviews.filter((_, i) => i !== index);
            onImageUpload(updatedPreviews.map(fp => fp.file).filter(Boolean) as File[]);
            return updatedPreviews;
        });
    };

    return (
        <div className="dash-input-wrapper mb-20">
            <div className="image-preview-container mb-5" style={{ display: 'flex', gap: '10px', flexWrap: 'nowrap', overflowX: 'auto' }}>
                {filePreviews.map((item, index) => (
                    <div
                        key={index}
                        className="image-preview-wrapper position-relative"
                        style={{ width: '15%', minWidth: '100px' }} // Set fixed dimensions
                    >
                        <img
                            src={item.previewUrl}
                            alt={item.file ? item.file.name : `existing-${index}`}
                            className="image-preview"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                borderRadius:'15px'
                            }}
                        />
                        <button
                            type="button"
                            className="remove-btn position-absolute top-0 end-0"
                            onClick={() => handleRemoveFile(index)}
                        >
                            <i className="bi bi-x"></i>
                        </button>
                    </div>
                ))}
            </div>
            <div className="dash-btn-one d-inline-block position-relative me-3">
                <i className="bi bi-plus"></i>
                Tải ảnh lên
                <input
                    key={filePreviews.map(fp => fp.previewUrl).join(",")}
                    type="file"
                    multiple={multiple}
                    onChange={handleFileChange}
                />
            </div>
        </div>
    );
};

export default UploadImage;
