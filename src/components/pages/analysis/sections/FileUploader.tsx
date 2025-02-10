import { X } from "lucide-react";

interface FileItem {
    name: string;
    size: number;
    type: string;
}

interface IFileUploader {
    files: FileItem[],
    setFiles: React.Dispatch<React.SetStateAction<FileItem[]>>
}
const FileUploader: React.FC<IFileUploader> = ({ files, setFiles }) => {


    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(event.target.files || []);
        const pdfFiles = selectedFiles
        // .filter((file) => file.type === "application/pdf");
        setFiles((prevFiles) => [...prevFiles, ...pdfFiles]);
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const droppedFiles = Array.from(event.dataTransfer.files);
        const pdfFiles = droppedFiles
        // .filter((file) => file.type === "application/pdf");
        setFiles((prevFiles) => [...prevFiles, ...pdfFiles]);
    };

    const handleRemoveFile = (index: number) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    const totalSize = files.reduce((sum, file) => sum + file.size, 0);

    const formatSize = (size: number) => {
        if (size >= 1073741824) {
            return (size / 1073741824).toFixed(2) + " GB";
        } else if (size >= 1048576) {
            return (size / 1048576).toFixed(2) + " MB";
        } else {
            return (size / 1024).toFixed(2) + " KB";
        }
    };

    return (
        <div className="w-full p-4 border border-gray-300 rounded-lg">
            <h2 className="text-lg font-semibold mb-10 text-purple-700">Upload Files</h2>
            <div
                className="border-2 border-dashed border-gray-400 p-6 text-center cursor-pointer hover:bg-gray-100"
                onDrop={handleDrop}
                onDragOver={(event) => event.preventDefault()}
            >
                <input
                    type="file"
                    // accept="application/pdf"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    id="fileInput"
                />
                <label htmlFor="fileInput" className=" text-gray-700 cursor-pointer h-40 flex items-center justify-center">
                    Drag & Drop PDF files here or  <span className="text-purple-700">Browse</span>
                </label>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4">
                {files.map((file, index) => (
                    <div key={index} className="relative p-2 border rounded-md shadow-sm">
                        <p className="text-sm font-medium truncate">{file.name}</p>
                        <p className="text-xs text-gray-500">{formatSize(file.size)}</p>
                        <button
                            onClick={() => handleRemoveFile(index)}
                            className="absolute top-1 right-1 p-1 text-red-500 hover:text-red-700"
                        >
                            <X size={16} />
                        </button>
                    </div>
                ))}
            </div>
            <div className="mt-4 text-sm font-semibold text-gray-500">
                Total Files: {files.length} | Total Size: {formatSize(totalSize)}
            </div>
        </div>
    );
}

export default FileUploader
