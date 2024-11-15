import React, { useState } from "react";

const documentDetails = {
  passport: {
    mandatory: ["name", "id_number", "date_of_birth", "expiration_date"],
    optional: ["address"],
  },
  driver_license: {
    mandatory: ["name", "id_number", "date_of_birth", "expiration_date"],
    optional: ["address"],
  },
  state_id_card: {
    mandatory: ["name", "id_number", "date_of_birth"],
    optional: ["address", "expiration_date"],
  },
  military_id: {
    mandatory: ["name", "id_number", "date_of_birth", "expiration_date"],
    optional: ["rank", "branch"],
  },
  permanent_resident_card: {
    mandatory: ["name", "id_number", "date_of_birth", "expiration_date"],
    optional: ["address"],
  },
  social_security_card: {
    mandatory: ["name", "id_number"],
    optional: [],
  },
  tribal_id: {
    mandatory: ["name", "id_number", "tribal_affiliation"],
    optional: ["date_of_birth", "expiration_date"],
  },
};



function DocumentUpload() {
  const [documentType, setDocumentType] = useState("");
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [extractedData, setExtractedData] = useState(null);
  const [loading,setLoading]=useState(false)

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    handleFile(selectedFile);
  };

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;

    const fileType = selectedFile.type;

    if (fileType !== "application/pdf") {
      setUploadStatus("error");
      setTimeout(() => setUploadStatus(""), 3000);
      return;
    }

    setFile(selectedFile);
    setFilePreview(URL.createObjectURL(selectedFile));
  };

  const handleProcessDocument = async () => {
    setLoading(true)
    if (!file || !documentType) return;
  
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      const response = await fetch("http://127.0.0.1:5000/upload_and_extract", {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("File uploaded successfully:", data);
  
      setExtractedData(data.extracted_data); // Save extracted data to state
      setUploadStatus("success");
      setLoading(false)
      setTimeout(() => setUploadStatus(""), 3000);
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadStatus("error");
      setTimeout(() => setUploadStatus(""), 3000);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    handleFile(droppedFile);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-4">
            Document Scanner
          </h1>
          <p className="text-gray-400">Upload your PDF documents for processing</p>
        </div>

        {/* Upload Area */}
        <div
          className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 ${
            isDragging
              ? "border-blue-500 bg-gray-800/50"
              : "border-gray-600 bg-gray-800/30"
          } p-8`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 flex items-center justify-center">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-xl text-gray-300 mb-2">
                Drag & Drop your PDF here
              </p>
              <p className="text-sm text-gray-500">or</p>
            </div>
            <label className="relative inline-flex group">
              <input
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept=".pdf"
              />
              <span className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-medium cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25">
                Browse Files
              </span>
            </label>
            <p className="text-sm text-gray-500">Only PDF files are supported</p>
          </div>
        </div>

        {/* Status Messages */}
        {uploadStatus && (
          <div
            className={`mt-4 p-4 rounded-lg ${
              uploadStatus === "success"
                ? "bg-green-500/20 text-green-400"
                : "bg-red-500/20 text-red-400"
            }`}
          >
            {uploadStatus === "success"
              ? "File uploaded successfully!"
              : "Please upload a PDF file only"}
          </div>
        )}

        {/* File Preview */}
        {filePreview && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-300 mb-4">
              Document Preview
            </h2>
            <div className="rounded-lg overflow-hidden border border-gray-700">
              <iframe
                src={filePreview}
                title="PDF Preview"
                className="w-full h-[600px] bg-white"
              />
            </div>
          </div>
        )}

        {/* Document Type Selection */}
        <div className="mt-8">
          <select
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-800 text-gray-300 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-300"
          >
            <option value="">Select Document Type</option>
            {Object.keys(documentDetails).map((type) => (
              <option key={type} value={type}>
                {type
                  .split("_")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </option>
            ))}
          </select>
        </div>

        {/* Process Button */}
        <button
          onClick={handleProcessDocument}
          disabled={!file || !documentType|| loading}
          className={`mt-8 w-full py-4 rounded-lg font-medium text-white transition-all duration-300 
            ${
              file && documentType
                ? "bg-gradient-to-r from-blue-500 to-cyan-400 hover:shadow-lg hover:shadow-blue-500/25 transform hover:scale-[1.02]"
                : "bg-gray-700 cursor-not-allowed"
            }`}
        >
            {loading ? "Processing..." : "Process Document"}
        </button>
        {loading && (
            <div className="absolute inset-0 bg-gray-800/50 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
            </div>
          )}

{extractedData && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-300 mb-4">
              Extracted Details
            </h2>
            <div className="p-4 bg-gray-800 rounded-lg">
              {Object.entries(extractedData).map(([key, value]) => (
                <div key={key}>
                  <strong>{key.replace(/_/g, " ")}:</strong> {value}
                </div>
              ))}
              <div className="mt-4">
                <button
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      JSON.stringify(extractedData, null, 2)
                    );
                  }}
                >
                  Copy to Clipboard
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


export default DocumentUpload;
