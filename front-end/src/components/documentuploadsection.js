import React, { useState, useEffect } from 'react';
import { Upload, File, Link as LinkIcon, Loader2, AlertCircle, Download } from 'lucide-react';
import { gql, useMutation, useQuery } from '@apollo/client';

// GraphQL mutations and queries
const INSERT_DOCUMENT = gql`
  mutation InsertDocument($doc1: String!, $student_id: Int!) {
    insert_documents_one(object: {
      doc1: $doc1,
      student_id: $student_id
    }) {
      document_id
      doc1
      student_id
    }
  }
`;

const GET_STUDENT_DOCUMENTS = gql`
  query GetStudentDocuments($student_id: Int!) {
    documents(where: {student_id: {_eq: $student_id}}) {
      document_id
      doc1
      student_id
    }
  }
`;

const DocumentUploadSection = ({ studentId }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [currentDocument, setCurrentDocument] = useState(null);

  const [insertDocument] = useMutation(INSERT_DOCUMENT);
  const { data: documentsData, loading: documentsLoading, refetch: refetchDocuments } = useQuery(GET_STUDENT_DOCUMENTS, {
    variables: { student_id: studentId }
  });

  // Function to convert file to base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const validateFileSize = (file) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error('File size should not exceed 5MB');
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      // Validate file size
      validateFileSize(file);

      // Convert file to base64
      const base64String = await convertToBase64(file);

      // Store file info
      const fileInfo = {
        name: file.name,
        type: file.type,
        content: base64String,
        uploadDate: new Date().toISOString()
      };

      // Insert document
      await insertDocument({
        variables: {
          doc1: JSON.stringify(fileInfo),
          student_id: studentId
        }
      });

      // Refetch documents to update the list
      await refetchDocuments();
      
      // Clear input
      e.target.value = '';

    } catch (error) {
      console.error('Error uploading document:', error);
      setError(error.message || 'Failed to upload document');
    } finally {
      setIsUploading(false);
    }
  };

  const handleLinkSubmit = async (e) => {
    e.preventDefault();
    const link = e.target.link.value;
    if (!link) return;

    setIsUploading(true);
    setError(null);

    try {
      // Store link info
      const linkInfo = {
        type: 'link',
        url: link,
        uploadDate: new Date().toISOString()
      };

      // Insert document with link
      await insertDocument({
        variables: {
          doc1: JSON.stringify(linkInfo),
          student_id: studentId
        }
      });

      // Refetch documents to update the list
      await refetchDocuments();

      // Clear the input
      e.target.reset();

    } catch (error) {
      console.error('Error saving link:', error);
      setError('Failed to save link');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = (docString) => {
    try {
      const doc = JSON.parse(docString);
      
      if (doc.type === 'link') {
        window.open(doc.url, '_blank', 'noopener,noreferrer');
        return;
      }

      // For files
      const link = document.createElement('a');
      link.href = doc.content;
      link.download = doc.name || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading document:', error);
      setError('Failed to download document');
    }
  };

  const getDisplayName = (docString) => {
    try {
      const doc = JSON.parse(docString);
      if (doc.type === 'link') {
        return new URL(doc.url).hostname;
      }
      return doc.name || 'Unnamed file';
    } catch {
      return 'Invalid document';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Document Management</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center text-red-600">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}
        
        {/* Upload Section */}
        <div className="space-y-6">
          {/* File Upload */}
          <div className="relative">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-2 text-gray-500" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">PDF, DOC, or images (MAX. 5MB)</p>
              </div>
              <input
                type="file"
                className="hidden"
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
              />
            </label>
          </div>

          {/* Link Submission */}
          <div>
            <form onSubmit={handleLinkSubmit} className="flex space-x-2">
              <input
                type="url"
                name="link"
                placeholder="Or paste a link here"
                className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                <LinkIcon className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Documents List */}
          {documentsLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            </div>
          ) : (
            <div className="space-y-4 mt-8">
              <h3 className="text-lg font-semibold text-gray-700">Uploaded Documents</h3>
              {documentsData?.documents.map((doc) => (
                <div key={doc.document_id} className="p-3 bg-white border border-gray-200 rounded-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                      <File className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <button
                        onClick={() => handleDownload(doc.doc1)}
                        className="text-blue-600 hover:text-blue-800 truncate cursor-pointer flex items-center"
                      >
                        <span className="truncate">{getDisplayName(doc.doc1)}</span>
                        <Download className="w-4 h-4 ml-2" />
                      </button>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(JSON.parse(doc.doc1).uploadDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
              {documentsData?.documents.length === 0 && (
                <p className="text-gray-500 text-center py-4">No documents uploaded yet</p>
              )}
            </div>
          )}
        </div>

        {/* Loading Overlay */}
        {isUploading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg flex items-center space-x-4">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              <span className="text-gray-700">Processing document...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentUploadSection;