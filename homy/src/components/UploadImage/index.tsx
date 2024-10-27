import React, { useState } from 'react';

interface UploadImageProps {
    onImageUpload: (files: File[]) => void;
    multiple?: boolean;
}

const UploadImage: React.FC<UploadImageProps> = ({ onImageUpload, multiple = false }) => {
    const [fileNames, setFileNames] = useState<string[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        if (files.length) {
            const newFileNames = files.map(file => file.name);
            setFileNames(prevFileNames => [...prevFileNames, ...newFileNames]);
            setSelectedFiles(prevFiles => [...prevFiles, ...files]);
            onImageUpload([...selectedFiles, ...files]); // Gửi danh sách file đầy đủ lên component cha
        }
    };

    const handleRemoveFile = (fileName: string) => {
        setFileNames(prevFileNames => prevFileNames.filter(name => name !== fileName));
        const updatedFiles = selectedFiles.filter(file => file.name !== fileName);
        setSelectedFiles(updatedFiles);
        onImageUpload(updatedFiles); 
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
                    key={fileNames.join(",")} 
                    type="file"
                    multiple={multiple}
                    onChange={handleFileChange}
                />
            </div>
            <small>Upload files .jpg, .png, .mp4</small>
        </div>
    );
};

export default UploadImage;
