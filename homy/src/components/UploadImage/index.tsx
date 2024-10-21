import React, { useState } from 'react';

interface UploadImageProps {
    onImageUpload: (files: File[]) => void;
    multiple?: boolean; // Prop xác định upload 1 file hoặc nhiều file
}

const UploadImage: React.FC<UploadImageProps> = ({ onImageUpload, multiple = false }) => {
    const [fileNames, setFileNames] = useState<string[]>([]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        if (files.length) {
            setFileNames(files.map(file => file.name));
            onImageUpload(files); // Gửi danh sách file lên component cha
        }
    };

    const handleRemoveFile = (fileName: string) => {
        setFileNames(prevFileNames => prevFileNames.filter(name => name !== fileName));
    };

    return (
        <div className="dash-input-wrapper mb-20">
            {fileNames.map((fileName, index) => (
                <div key={index} className="attached-file d-flex align-items-center justify-content-between mb-15">
                    <span>{fileName}</span>
                    <button type="button" className="remove-btn" onClick={() => handleRemoveFile(fileName)}>
                        <i className="bi bi-x"></i>
                    </button>
                </div>
            ))}
            <div className="dash-btn-one d-inline-block position-relative me-3">
                <i className="bi bi-plus"></i>
                Upload Files
                <input
                    type="file"
                    multiple={multiple} // Cho phép upload nhiều file nếu prop multiple là true
                    onChange={handleFileChange}
                />
            </div>
            <small>Upload files .jpg, .png, .mp4</small>
        </div>
    );
};

export default UploadImage;
