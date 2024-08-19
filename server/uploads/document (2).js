// import React, { useState, useEffect, useRef } from 'react';
// import "./document.css";
// import del from "./doc_images/del3.png";
// import back from "./doc_images/back1.png";
// import close from "./doc_images/close.png";
// import download from "./doc_images/download.png"
// import logo from './doc_images/logo.png';
// import service_icon from "./doc_images/service-icon3.png"
// import folder from "./doc_images/folder.png"
// import AWS from 'aws-sdk';
// import S3 from 'aws-sdk/clients/s3';
// import { Link, useNavigate } from 'react-router-dom';
// import addfile from "./doc_images/add file 2.png";
// import { Auth } from 'aws-amplify';
// import Swal from 'sweetalert2';
// import swal from 'sweetalert';
// import Spinner from './Spinner';
// import HeaderBar from '../HeaderBar';
// import Spinner2 from "./Folder_Spinner"


// import "@tensorflow/tfjs-backend-cpu";
// import * as cocoSsd from "@tensorflow-models/coco-ssd";
// import setupSessionTimeout from "../SessionTimeout";



// import { useProject } from '../BldgServiceContext';

// import DatePicker from 'react-datepicker';
// import "react-datepicker/dist/react-datepicker.css";
// import { registerLocale } from "react-datepicker";
// import enGB from 'date-fns/locale/en-GB';

// import { getCurrentStorageUsage, updateStorageUsage } from './UserStorage';


// registerLocale('en-GB', enGB);






// const DocumentPage = () => {
//     const [folders, setFolders] = useState([]);
//     // const [defaultFolders, setDefaultFolders] = useState([]);
//     const [uploadedFiles, setUploadedFiles] = useState([]);
//     const [uploading, setUploading] = useState();
//     const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//     const [selectedPdf, setSelectedPdf] = useState(null);
//     const dropdownRef = useRef(null);
//     const [selectedFolder, setSelectedFolder] = useState(null);
//     const [selectedFile, setSelectedFile] = useState(null);
//     const fileBoxRef = useRef(null);

//     const { selectedProject } = useProject();

//     const [modalOpen, setModalOpen] = useState(false);
//     const [files, setFiles] = useState([]);
//     const fileInputRef = useRef(null);
//     const dropZoneRef = useRef(null);
//     const [fileType, setFileType] = useState('---None---');
//     const fileViewerRef = useRef(null);
//     const firstFileRef = useRef(null); // Ref to the first file







//     //-----file validation------//


//     const imageRef = useRef();
//     const [isLoading, setIsLoading] = useState(false);
//     const [isLoading2, setIsLoading2] = useState(false);

//     const [errorMessage, setErrorMessage] = useState("");
//     const [model, setModel] = useState(null);
//     const [timeoutAlert, setTimeoutAlert] = useState(false);
//     const [timeoutAlert2, setTimeoutAlert2] = useState(false);




//     const [fromDate, setFromDate] = useState('');
//     const [toDate, setToDate] = useState('');


//     const today = new Date();

//     const navigate = useNavigate();



//     useEffect(() => {
//         // Automatically click the first file if available
//         if (uploadedFiles.length > 0 && firstFileRef.current) {
//             firstFileRef.current.click();
//         }
//     }, [uploadedFiles]);




//     useEffect(() => {
//         const cleanupSessionTimeout = setupSessionTimeout();

//         return () => {
//             cleanupSessionTimeout(); // Cleanup function to remove event listeners and clear timeout
//         };
//     }, []);




//     // useEffect(() => {
//     //     // Push a dummy state to the history to prevent unintended navigation
//     //     window.history.pushState(null, "", window.location.href);

//     //     // Handle popstate event to prevent navigation
//     //     const handlePopState = (event) => {
//     //         window.history.pushState(null, "", window.location.href);
//     //     };

//     //     window.addEventListener("popstate", handlePopState);

//     //     return () => {
//     //         window.removeEventListener("popstate", handlePopState);
//     //     };
//     // }, []);




//     let timeout;
//     useEffect(() => {
//         if (isLoading) {
//             timeout = setTimeout(() => {
//                 setIsLoading(false);
//                 alert("Timeout");
//             }, 30000);
//         } else {
//             clearTimeout(timeout);
//             setTimeoutAlert(false);
//         }

//         return () => clearTimeout(timeout);
//     }, [isLoading]);




//     let timeout2;
//     useEffect(() => {
//         if (isLoading2) {
//             timeout2 = setTimeout(() => {
//                 setIsLoading2(false);
//                 alert("Timeout");
//             }, 30000);
//         } else {
//             clearTimeout(timeout2);
//             setTimeoutAlert2(false);
//         }

//         return () => clearTimeout(timeout2);
//     }, [isLoading2]);



//     const readImage = (file) => {
//         return new Promise((resolve, reject) => {
//             if (!(file instanceof Blob)) {
//                 reject(new Error("Invalid file type. Please select a valid file."));
//                 return;
//             }

//             const fileReader = new FileReader();
//             fileReader.onload = () => resolve(fileReader.result);
//             fileReader.onerror = () => reject(fileReader.error);
//             fileReader.readAsDataURL(file);
//         });
//     };

//     const detectObjectsOnImage = async (imageElement, imgSize) => {
//         if (!model) return [];
//         const predictions = await model.detect(imageElement, 6);
//         return normalizePredictions(predictions, imgSize);
//     };

//     const normalizePredictions = (predictions, imgSize) => {
//         if (!predictions || !imgSize || !imageRef.current) return predictions || [];
//         return predictions.map((prediction) => {
//             const { bbox } = prediction;
//             const oldX = bbox[0];
//             const oldY = bbox[1];
//             const oldWidth = bbox[2];
//             const oldHeight = bbox[3];

//             const imgWidth = imageRef.current.width;
//             const imgHeight = imageRef.current.height;

//             const x = (oldX * imgWidth) / imgSize.width;
//             const y = (oldY * imgHeight) / imgSize.height;
//             const width = (oldWidth * imgWidth) / imgSize.width;
//             const height = (oldHeight * imgHeight) / imgSize.height;

//             return { ...prediction, bbox: [x, y, width, height] };
//         });
//     };



//     //-----file validation------//







//     const handleClickOutsidebox = (event) => {
//         if (fileBoxRef.current && !fileBoxRef.current.contains(event.target)) {
//             setSelectedFile(null);
//         }
//     };



//     useEffect(() => {
//         document.addEventListener('mousedown', handleClickOutsidebox);
//         return () => {
//             document.removeEventListener('mousedown', handleClickOutsidebox);
//         };
//     }, []);

//     const handleFolderClick = (folderName) => {
//         setSelectedFolder(folderName);
//         setSelectedFile(null);
//         setUploadedFiles([]);
//         setSelectedPdf(false)

//         storeSelectedFolderToS3(folderName)
//             .then(() => fetchUploadedFilesFromS3(folderName))
//             .catch((error) => console.error('Error storing selected folder:', error));
//     };

//     useEffect(() => {
//         createUserFolders();

//     }, []);


//     useEffect(() => {
//         const currentUser = async () => {
//             const currentUser = await Auth.currentAuthenticatedUser();
//             return currentUser;
//         };
//         currentUser().then((user) => {
//             fetchFoldersFromS3(user.attributes.email);
//         });
//     }, []);

//     useEffect(() => {
//         fetchSelectedFolderFromS3()
//             .then((folderName) => {
//                 if (folderName) {
//                     setSelectedFolder(folderName);
//                     fetchUploadedFilesFromS3(folderName);
//                 }
//             })
//             .catch((error) => {
//                 console.error('Error fetching selected folder:', error);
//             });
//     }, []);


//     useEffect(() => {
//         if (selectedFolder) {
//             fetchUploadedFilesFromS3(selectedFolder);
//         }
//     }, [selectedFolder]);


//     const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];


//     const toggleDropdown = () => {
//         setIsDropdownOpen(!isDropdownOpen);
//     };

//     const handleDropdownItemClick = (item) => {
//         console.log(item);
//         setIsDropdownOpen(false);
//     };

//     const handleClickOutside = (event) => {
//         if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//             setIsDropdownOpen(false);
//         }
//     };

//     useEffect(() => {
//         document.addEventListener("mousedown", handleClickOutside);
//         return () => {
//             document.removeEventListener("mousedown", handleClickOutside);
//         };
//     }, []);

//     // console.log(selectedProject);



//     useEffect(() => {
//         const loadFolders = async () => {
//             setIsLoading2(true);
//             try {
//                 const currentUser = await Auth.currentAuthenticatedUser();
//                 const email = currentUser.attributes.email;
//                 const fetchedFolders = await fetchFoldersFromS3(email);
//                 setFolders(fetchedFolders);
//             } catch (error) {
//                 console.error('Error loading folders:', error);
//             }
//             setIsLoading2(false);
//         };

//         loadFolders();
//     }, [selectedProject]);

//     //---------- new code for folder--------------//



//     const BucketName = "s3testa55fa-sesapp"
//     const defaultFileFolders = "default_files"
//     const createUserFolders = async () => {
//         try {
//             const currentUser = await Auth.currentAuthenticatedUser();
//             const email = currentUser.attributes.email;

//             const s3 = new AWS.S3();
//             const folderNames = [
//                 'Registration Documents',
//                 'Municipality Documents',
//                 'Legal Documents',
//                 'Architecture Documents',
//                 'Application forms',
//                 'Structural Documents',
//                 'Tax Receipts',
//                 'Shared Folder'
//             ];

//             // Create folders in S3
//             for (let folderName of folderNames) {
//                 await s3.putObject({
//                     Bucket: 's3testa55fa-sesapp',
//                     Key: `${email}/Projects/${selectedProject}/${folderName}/`,
//                     Body: ''
//                 }).promise();
//             }

//             const defaultFiles = [
//                 { folder: 'Application forms', name: 'Affidavit.pdf' },
//                 { folder: 'Application forms', name: 'Bond of Assurance.pdf' },
//                 { folder: 'Application forms', name: 'Indemnity Bond.pdf' },
//                 { folder: 'Application forms', name: 'Borewell Application Form.pdf' },
//             ];

//             for (let file of defaultFiles) {
//                 await s3.copyObject({
//                     Bucket: 's3testa55fa-sesapp',
//                     CopySource: `${BucketName}/${defaultFileFolders}/${file.name}`,
//                     Key: `${email}/Projects/${selectedProject}/${file.folder}/${file.name}`,
//                 }).promise();
//             }

//             // Fetch and set user folders
//             const fetchedFolders = await fetchFoldersFromS3(email);
//             console.log('Fetched User Folders:', fetchedFolders);
//             setFolders(fetchedFolders);
//         } catch (error) {
//             console.error('Error creating user folders:', error);
//         }
//     };


//     const fetchFoldersFromS3 = async (email) => {
//         try {
//             const s3 = new AWS.S3();
//             const data = await s3.listObjectsV2({
//                 Bucket: 's3testa55fa-sesapp',
//                 Prefix: `${email}/Projects/${selectedProject}/`
//             }).promise();

//             console.log("Data from S3:", data);

//             const folderNames = data.Contents
//                 .map(object => {
//                     const parts = object.Key.split('/');
//                     if (parts.length > 3 && parts[1] === 'Projects' && parts[2] === selectedProject) {
//                         return parts[3];
//                     }
//                     return null;
//                 })
//                 .filter(folderName => folderName && folderName.trim() !== ''); // Filter out any null or empty folder names

//             return [...new Set(folderNames)]; // Remove duplicates
//         } catch (error) {
//             console.error('Error fetching user folders from S3:', error);
//             return [];
//         }
//     };




//     const fetchUploadedFilesFromS3 = async (folderName) => {
//         try {
//             const currentUser = await Auth.currentAuthenticatedUser();
//             // const userId = currentUser.attributes.sub;
//             const email = currentUser.attributes.email;


//             const s3 = new AWS.S3();
//             const data = await s3.listObjectsV2({
//                 Bucket: 's3testa55fa-sesapp',
//                 Prefix: `${email}/Projects/${selectedProject}/${folderName}/`
//             }).promise();
//             const files = data.Contents.map(file => ({
//                 name: file.Key.split('/').pop(),
//                 size: file.Size,
//                 type: 'application/pdf',
//                 folderName: folderName,

//             }));
//             setUploadedFiles(files);

//             const defaultFile = files.find(file => file.name === 'Affidavit.pdf');
//             if (defaultFile) {
//                 viewPdf(defaultFile);
//             }
//         } catch (error) {
//             console.error('Error fetching uploaded files from S3:', error);
//         }
//     };






//     const s3 = new AWS.S3();

//     const fetchSelectedFolderFromS3 = async () => {
//         try {
//             const data = await s3.getObject({
//                 Bucket: 's3testa55fa-sesapp',
//                 Key: 'selectedFolder.json'
//             }).promise();
//             return JSON.parse(data.Body.toString()).folderName;
//         } catch (error) {
//             console.error('Error fetching selected folder:', error);
//             throw error;
//         }
//     };

//     // Function to store selected folder information to S3
//     const storeSelectedFolderToS3 = async (folderName) => {
//         try {
//             // Make a request to store the selected folder information to S3
//             await s3.putObject({
//                 Bucket: 's3testa55fa-sesapp',
//                 Key: 'selectedFolder.json',
//                 Body: JSON.stringify({ folderName }), // Assuming you want to store the folder name in 'selectedFolder.json'
//                 ContentType: 'application/json'
//             }).promise();
//             console.log('Selected folder stored successfully: ', folderName);
//         } catch (error) {
//             console.error('Error storing selected folder:', error);
//             throw error;
//         }
//     };






//     const deleteFile = async (fileIndex) => {
//         swal({
//             title: "Are you sure?",
//             text: "Once deleted, you will not be able to recover this file!",
//             icon: "warning",
//             buttons: ["Cancel", "Delete"],
//             dangerMode: true,
//         })
//             .then(async (willDelete) => {
//                 if (willDelete) {
//                     try {
//                         const currentUser = await Auth.currentAuthenticatedUser();
//                         // const userId = currentUser.attributes.sub;
//                         const email = currentUser.attributes.email;

//                         const bucketName = 's3testa55fa-sesapp'; // Set the bucket name

//                         const s3 = new AWS.S3();

//                         const fileToDelete = uploadedFiles[fileIndex];
//                         const fileKey = `${email}/Projects/${selectedProject}/${fileToDelete.folderName}/${fileToDelete.name}`; // Construct the S3 key

//                         console.log('File to delete:', fileKey); // Log file path

//                         // Delete the file object from S3
//                         await s3.deleteObject({ Bucket: bucketName, Key: fileKey }).promise();

//                         // Update the local state to remove the file
//                         setUploadedFiles(prevFiles => {
//                             const updatedFiles = prevFiles.filter((file, index) => index !== fileIndex);

//                             // Check if the file being deleted is the currently viewed file
//                             if (selectedPdf && fileToDelete.name === selectedPdf.name && fileToDelete.folderName === selectedPdf.folderName) {
//                                 setSelectedPdf(null); // Clear the selected PDF state if it's the same file
//                             }

//                             return updatedFiles;
//                         });

//                         swal("Poof! Your file has been deleted!", {
//                             icon: "success",
//                             timer: 1000,
//                             button: false,
//                         });
//                     } catch (error) {
//                         console.error('Error deleting file from S3:', error);
//                         swal("Oops!", "Error deleting file: " + error.message, "error");
//                     }
//                 } else {
//                     // Cancelled deletion
//                 }
//             })
//             .catch(error => {
//                 console.error('Error during file deletion confirmation:', error);
//             });
//     };



//     const handleFileDownload = async (folderName, fileName) => {
//         try {
//             const currentUser = await Auth.currentAuthenticatedUser();
//             const email = currentUser.attributes.email;

//             const s3 = new AWS.S3();
//             const params = {
//                 Bucket: 's3testa55fa-sesapp',
//                 Key: `${email}/Projects/${selectedProject}/${folderName}/${fileName}`
//             };

//             const key = `${email}/Projects/${selectedProject}/${folderName}/${fileName}`;
//             console.log("key is", key);

//             // Get a pre-signed URL for the file
//             const url = await s3.getSignedUrlPromise('getObject', params);

//             // Fetch the file blob to determine its MIME type
//             const response = await fetch(url);
//             const blob = await response.blob();

//             // Create a temporary anchor element to trigger the download
//             const link = document.createElement('a');
//             link.href = URL.createObjectURL(blob);
//             link.setAttribute('download', fileName);
//             document.body.appendChild(link);
//             link.click();
//             document.body.removeChild(link);

//             // Release the object URL to avoid memory leaks
//             URL.revokeObjectURL(link.href);
//         } catch (error) {
//             console.error('Error downloading file:', error);
//             swal({
//                 title: 'Error',
//                 text: 'Error downloading file: Please refresh the page and try again',
//                 icon: 'error',
//                 button: false,
//                 timer: 1000,
//             });
//         }
//     };









//     const viewPdf = async (file) => {
//         try {
//             const currentUser = await Auth.currentAuthenticatedUser();
//             const email = currentUser.attributes.email;

//             const s3 = new AWS.S3();
//             const params = {
//                 Bucket: 's3testa55fa-sesapp',
//                 Key: `${email}/Projects/${selectedProject}/${file.folderName}/${file.name}`
//             };

//             // Get a pre-signed URL for the file
//             const url = await s3.getSignedUrlPromise('getObject', params);
//             console.log('Generated URL:', url); // Log the URL to verify it

//             // Fetch the file content
//             const response = await fetch(url);
//             const blob = await response.blob();
//             console.log('Fetched Blob:', blob); // Debugging log

//             setSelectedPdf({ body: blob, type: blob.type, name: file.name, folderName: file.folderName }); // Store the file content and metadata
//         } catch (error) {
//             console.error('Error fetching file URL:', error);
//             swal({
//                 title: 'Error',
//                 text: 'Error fetching file URL: ' + error.message,
//                 icon: 'error',
//                 button: 'OK',
//             });
//         }
//     };





//     const handlePrint = () => {
//         const printWindow = window.open(URL.createObjectURL(selectedPdf.body), '_blank');
//         if (printWindow) {
//             printWindow.onload = () => {
//                 printWindow.print();
//             };
//         }
//     };



//     useEffect(() => {
//         if (selectedPdf && fileViewerRef.current) {
//             const element = fileViewerRef.current;
//             const rect = element.getBoundingClientRect();
//             const offset = window.innerHeight - rect.height;

//             // Scroll to bottom of the iframe or image
//             window.scrollTo({
//                 top: window.scrollY + rect.top + offset,
//                 behavior: 'smooth'
//             });
//         }
//     }, [selectedPdf]);







//     const handleModalOpen = () => {
//         setModalOpen(true);
//     };

//     const handleModalClose = () => {
//         setModalOpen(false);
//     };

//     const handleDragOver = (e) => {
//         e.preventDefault();
//         dropZoneRef.current.classList.add('dragging');
//     };

//     const handleDragLeave = () => {
//         dropZoneRef.current.classList.remove('dragging');
//     };

//     const handleDrop = (e) => {
//         e.preventDefault();
//         dropZoneRef.current.classList.remove('dragging');
//         const selectedFiles = Array.from(e.dataTransfer.files);
//         setFiles(selectedFiles);
//         if (selectedFiles.length > 0) {
//             dropZoneRef.current.textContent = selectedFiles.map(file => file.name).join(', ');
//         }
//     };

//     const handleFileSelect = () => {
//         fileInputRef.current.click();
//     };

//     const handleFileChange = (e) => {
//         const selectedFiles = Array.from(e.target.files);
//         setFiles(selectedFiles);
//         if (selectedFiles.length > 0) {
//             dropZoneRef.current.textContent = selectedFiles.map(file => file.name).join(', ');
//         }
//     };


//     const formatDate = (date) => {
//         if (!date) return null;
//         const formattedDate = new Intl.DateTimeFormat('en-GB', {
//             month: 'short',
//             year: 'numeric',
//         }).format(date);

//         const [month, year] = formattedDate.split(' ');
//         return `${month.toUpperCase()}${year}`;
//     };



//     //HandleUpload is only for municipality folder
//     const handleUpload = async () => {

//         const formattedFromDate = formatDate(fromDate);
//         const formattedToDate = formatDate(toDate);
//         console.log('From Date:', formattedFromDate);
//         console.log('To Date:', formattedToDate);


//         if (selectedFolder === 'Municipality Documents' && fileType === '---None---') {
//             swal({
//                 title: 'Error',
//                 text: 'Please select a file type from the dropdown.',
//                 icon: 'error',
//                 button: 'OK',
//             });
//             return;
//         }

//         if (selectedFolder === 'Municipality Documents' && fileType === 'Encumbrance certificate' && (!fromDate || !toDate)) {
//             swal({
//                 title: 'Error',
//                 text: 'Please enter the to and from dates.',
//                 icon: 'error',
//                 button: 'OK',
//             });

//             setModalOpen(true);
//             return;
//         }

//         if (selectedFolder === 'Tax Receipts') {
//             navigate('/tax');
//             return;
//         }

//         // const folderName = "Municipality Documents";
//         await handleFileUpload(selectedFolder, files, fileType);
//         setFileType('---None---');
//         setFiles([]);
//         handleModalClose();
//         setFromDate(null);
//         setToDate(null);
//     };















//     const handleFileUpload = async (folderName, files, fileType) => {
//         if (files && files.length > 0) {
//             setIsLoading(true);
//             setErrorMessage("");
//             const allowedTypes = ['application/pdf', 'image/png'];
//             const validFiles = [];
//             const invalidFiles = [];
//             const s3 = new AWS.S3();

//             const MAX_STORAGE_LIMIT = 10 * 1024 * 1024 * 1024;

//             try {
//                 if (!model) {
//                     const loadedModel = await cocoSsd.load();
//                     setModel(loadedModel);
//                 }

//                 const currentUser = await Auth.currentAuthenticatedUser();
//                 const email = currentUser.attributes.email;


//                 const currentUsage = await getCurrentStorageUsage(email);
//                 const totalSize = files.reduce((acc, file) => acc + file.size, 0);

//                 if (currentUsage + totalSize > MAX_STORAGE_LIMIT) {
//                     setIsLoading(false);
//                     Swal.fire({
//                         title: 'Error',
//                         text: 'Uploading these files would exceed your 10GB storage limit.',
//                         icon: 'error',
//                         button: 'OK',
//                     });
//                     return;
//                 }



//                 const listParams = {
//                     Bucket: 's3testa55fa-sesapp',
//                     Prefix: `${email}/Projects/${selectedProject}/${folderName}/`
//                 };
//                 const existingFiles = await s3.listObjectsV2(listParams).promise();
//                 const existingFileNames = existingFiles.Contents.map(file => file.Key.split('/').pop());

//                 for (let file of files) {
//                     if (!allowedTypes.includes(file.type)) {
//                         invalidFiles.push(file);
//                         continue;
//                     }

//                     if (file.type.startsWith('image/')) {
//                         try {
//                             const imgData = await readImage(file);
//                             const imageElement = new Image();
//                             imageElement.src = imgData;

//                             imageElement.onload = async () => {
//                                 const imgSize = {
//                                     width: imageElement.width,
//                                     height: imageElement.height,
//                                 };
//                                 const predictions = await detectObjectsOnImage(imageElement, imgSize);
//                                 const hasHumanOrAnimal = predictions.some(
//                                     (prediction) =>
//                                         ['person', 'bird', 'cat', 'dog'].includes(prediction.class)
//                                 );
//                                 if (!hasHumanOrAnimal) {
//                                     validFiles.push(file);
//                                 } else {
//                                     invalidFiles.push(file);
//                                 }

//                                 if (validFiles.length + invalidFiles.length === files.length) {
//                                     setIsLoading(false);
//                                     showValidationResults(validFiles, invalidFiles, folderName, s3, email, existingFileNames, fileType);
//                                 }
//                             };
//                         } catch (error) {
//                             console.error('Error processing image:', error);
//                             setIsLoading(false);
//                         }
//                     } else if (file.type === 'application/pdf') {
//                         validFiles.push(file);
//                     } else {
//                         invalidFiles.push(file);
//                     }
//                 }

//                 if (validFiles.length + invalidFiles.length === files.length) {
//                     setIsLoading(false);
//                     showValidationResults(validFiles, invalidFiles, folderName, s3, email, existingFileNames, fileType);
//                 }


//                 const newStorageUsed = currentUsage + totalSize;
//                 await updateStorageUsage(email, newStorageUsed);



//             } catch (error) {
//                 console.error('Error loading model or processing images:', error);
//                 setUploading(false);
//                 setIsLoading(false);

//                 Swal.fire({
//                     title: 'Network Error',
//                     text: 'Failed to upload files due to a network error. Please check your internet connection and try again.',
//                     icon: 'error',
//                     button: 'OK',
//                 });
//             }
//         } else {
//             Swal.fire({
//                 title: 'Please select files to upload.',
//                 icon: 'warning',
//                 button: 'OK',
//             });
//         }
//     }


//     const showValidationResults = async (validFiles, invalidFiles, folderName, s3, email, existingFileNames, fileType) => {
//         try {
//             const invalidFileNames = invalidFiles.map((file) => file.name).join(", ");
//             let duplicateFileMessage = '';
//             let fileSizeExceedMessage = '';
//             let invalidFileTypeMessage = '';
//             const uploadedFilesInfo = [];

//             // Valid file types
//             const validFileTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif'];

//             // Show message for invalid files first
//             if (invalidFiles.length > 0) {
//                 Swal.fire({
//                     title: 'Invalid Files',
//                     html: `The following files are invalid and will not be uploaded:<strong style="color: red;"><br>${invalidFileNames}</strong>`,
//                     icon: 'error',
//                     button: "OK",
//                 });
//             }

//             for (let file of validFiles) {
//                 let newFileName = file.name;

//                 // Check for valid file type
//                 if (!validFileTypes.includes(file.type)) {
//                     invalidFileTypeMessage += `${file.name} is not a valid file type.\n`;
//                     continue;
//                 }

//                 // Rename file if necessary
//                 if (folderName === 'Municipality Documents') {
//                     if (fileType === 'Encumbrance certificate') {
//                         const formattedFromDate = formatDate(fromDate);
//                         const formattedToDate = formatDate(toDate);
//                         newFileName = `EC ${formattedFromDate}-${formattedToDate}${file.name.substring(file.name.lastIndexOf('.'))}`;
//                     } else {
//                         newFileName = `${fileType}${file.name.substring(file.name.lastIndexOf('.'))}`;
//                     }
//                 }

//                 // Check for duplicate files
//                 if (existingFileNames.includes(newFileName)) {
//                     duplicateFileMessage += `${newFileName} is already uploaded.\n`;
//                     continue;
//                 }

//                 // Check for file size limit
//                 if (file.size > 2 * 1024 * 1024) {
//                     fileSizeExceedMessage += `${file.name} exceeds the limit of 2 MB.\n`;
//                     continue;
//                 }

//                 // Upload file
//                 const params = {
//                     Bucket: 's3testa55fa-sesapp',
//                     Key: `${email}/Projects/${selectedProject}/${folderName}/${newFileName}`, // Removed the trailing slash
//                     Body: file,
//                     ContentType: file.type,
//                 };

//                 await s3.upload(params).promise();
//                 uploadedFilesInfo.push({ name: newFileName, size: file.size, type: file.type, folderName });
//             }

//             // Show specific error messages if encountered
//             if (invalidFileTypeMessage) {
//                 Swal.fire({
//                     title: 'Invalid File Type',
//                     text: invalidFileTypeMessage,
//                     icon: 'warning',
//                     button: 'OK',
//                 });
//             }

//             if (duplicateFileMessage) {
//                 Swal.fire({
//                     title: 'Duplicate Files',
//                     text: duplicateFileMessage,
//                     icon: 'warning',
//                     button: 'OK',
//                 });
//             }

//             if (fileSizeExceedMessage) {
//                 Swal.fire({
//                     title: 'File Size Exceeded',
//                     text: fileSizeExceedMessage,
//                     icon: 'error',
//                     button: 'OK',
//                 });
//             }

//             // Show success message if files were uploaded
//             if (uploadedFilesInfo.length > 0) {
//                 Swal.fire({
//                     title: 'Files uploaded successfully',
//                     icon: 'success',
//                     timer: 1500,
//                     showConfirmButton: false
//                 });

//                 setUploadedFiles(prevFiles => {
//                     console.log([...prevFiles, ...uploadedFilesInfo]);
//                     return [...prevFiles, ...uploadedFilesInfo];
//                 });
//                 console.log("Files uploaded:", uploadedFilesInfo);
//             }

//         } catch (error) {
//             console.error('Network error:', error);
//             setUploading(false);
//             Swal.fire({
//                 title: 'Network Error',
//                 text: 'Failed to upload files due to a network error. Please check your internet connection and try again.',
//                 icon: 'error',
//                 button: 'OK',
//             });
//         }
//     };






//     const getPath = (fileName) => {
//         switch (fileName) {
//             case 'Borewell Application Form.pdf':
//                 return '/document/borewell';

//             case 'Affidavit.pdf':
//                 return '/document/affidavit';

//             case 'Bond of Assurance.pdf':
//                 return '/document/bondofassurance';

//             case 'Indemnity Bond.pdf':
//                 return '/document/indemnitybond';

//             default:
//                 return '#'; // Default path or a fallback
//         }
//     };



//     // useEffect(() => {
//     //     fetch('/Affidavit.pdf')
//     //         .then(response => response.blob())
//     //         .then(blob => {
//     //             setSelectedPdf({
//     //                 type: 'application/pdf',
//     //                 body: blob,
//     //                 name: 'Affidavit.pdf'
//     //             });
//     //         });
//     // }, []);






//     useEffect(() => {
//         const fetchFiles = async () => {
//             await fetchUploadedFilesFromS3('Application forms');
//         };

//         fetchFiles();
//     }, []);















//     return (
//         <div className="document-page-container">

//             <HeaderBar />


//             <div className='back-btn'>
//                 <Link to="/"><img className='back-btn-arch' src={back} alt=""></img></Link>
//             </div>

//             <div className='title'>
//                 <h1 className="page-title-doc">Documents</h1>
//             </div>


//             <div className='folder-section-box'>


//                 <div className="folders-wrapper">
//                     <div className="folder-box">
//                         {/* Default Folder */}

//                         <div className="folder">
//                             <h3 className="folder_head">Folders</h3>
//                             <div className="folder_content">
//                                 {isLoading2 ? (
//                                     <div className="spinner-folder">
//                                         <Spinner2 />
//                                     </div>
//                                 ) : (
//                                     <ul className="folder_list">
//                                         {folders.map((folderName, index) => (
//                                             <li className={`folder_names ${selectedFolder === folderName ? 'selected-folder-doc' : ''}`} key={index} onClick={() => handleFolderClick(folderName)}>                                    <img className="folder_img" src={folder} alt="" />
//                                                 {folderName}
//                                             </li>
//                                         ))}
//                                     </ul>
//                                 )}
//                             </div>
//                         </div><br></br>

//                         {/* Render file upload box if selectedFolder is truthy */}
//                         {selectedFolder && (
//                             <div className="folder" ref={fileBoxRef}>
//                                 <h4 className='folder_title'>{selectedFolder}</h4>
//                                 <label className="upload-icon">
//                                     {selectedFolder == 'Tax Receipts' && (<img onClick={handleUpload} className='add_file_img' src={addfile} alt="Add File" />) || (<img onClick={handleModalOpen} className='add_file_img' src={addfile} alt="Add File" />)}
//                                 </label>
//                                 {modalOpen && (
//                                     <div className="modal" style={modalStyles}>
//                                         <div className="modal-content" style={modalContentStyles}>
//                                             <span className="close" onClick={handleModalClose} style={closeStyles}>&times;</span>
//                                             <h2>Upload Files</h2>
//                                             <div id="dropZone" ref={dropZoneRef} style={dropZoneStyles}
//                                                 onDragOver={handleDragOver}
//                                                 onDragLeave={handleDragLeave}
//                                                 onDrop={handleDrop}
//                                             >
//                                                 <p>Drag & Drop files here</p>
//                                                 <p>or</p>
//                                                 <button className='select-files-text' onClick={handleFileSelect}>Select Files</button>
//                                                 <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple={selectedFolder !== 'Municipality Documents'} style={{ display: 'none' }} />
//                                             </div>
//                                             {selectedFolder === 'Municipality Documents' && (
//                                                 <div>
//                                                     <label className="file_type" htmlFor="fileType">Select File Type:</label>
//                                                     <select value={fileType} onChange={(e) => setFileType(e.target.value)}>
//                                                         <option value="---None---">-------None-------</option>
//                                                         <option value="Environmental Clearance">Environmental Clearance</option>
//                                                         <option value="Building Plan">Building Plan</option>
//                                                         <option value="Katha Copy">Katha Copy</option>
//                                                         <option value="Encumbrance certificate">Encumbrance certificate</option>
//                                                         <option value="Application Form">Application Form</option>
//                                                         <option value="Title Deed">Title Deed</option>
//                                                         <option value="Building Estimation">Building Estimations</option>
//                                                         <option value="Tax Receipt">Tax Receipt</option>
//                                                     </select>
//                                                     {fileType === 'Encumbrance certificate' && (
//                                                         <div className='date-selector-ec'>
//                                                             <label htmlFor="fromDate"><b>From Year:</b></label>
//                                                             <DatePicker
//                                                                 selected={fromDate}
//                                                                 onChange={(date) => setFromDate(date)}
//                                                                 dateFormat="MM/yyyy"
//                                                                 showMonthYearPicker
//                                                                 locale="en-GB"
//                                                                 maxDate={today}
//                                                             />

//                                                             <label htmlFor="toDate"><b>To Year:</b></label>
//                                                             <DatePicker
//                                                                 selected={toDate}
//                                                                 onChange={(date) => setToDate(date)}
//                                                                 dateFormat="MM/yyyy"
//                                                                 showMonthYearPicker
//                                                                 locale="en-GB"
//                                                                 maxDate={today}
//                                                             />
//                                                         </div>
//                                                     )}
//                                                 </div>
//                                             )}

//                                             <button className='upload-btn' onClick={() => { handleUpload(); handleModalClose(); }}>Upload</button>

//                                         </div>
//                                     </div>
//                                 )}

//                                 {uploadedFiles.length > 0 ? (
//                                     uploadedFiles.map((file, fileIndex) => (
//                                         file.name ? (
//                                             <div className={`file-list ${selectedFile === fileIndex ? 'selected' : ''}`} key={fileIndex} onClick={() => setSelectedFile(fileIndex)}>
//                                                 <p className='file-name' onClick={() => viewPdf(file)}>{file.name}</p>
//                                                 <img className='download-icon' src={download} alt='Download' onClick={() => selectedFile === fileIndex && handleFileDownload(file.folderName, file.name)} style={{ filter: selectedFile === fileIndex ? 'none' : 'grayscale(100%)' }} />
//                                                 <img className='del_file_img' src={del} alt='Delete' onClick={() => selectedFile === fileIndex && deleteFile(fileIndex)} style={{ filter: selectedFile === fileIndex ? 'none' : 'grayscale(100%)' }} />

//                                             </div>
//                                         ) : null
//                                     ))
//                                 ) : (
//                                     <p></p>
//                                 )}
//                             </div>
//                         )}
//                     </div>
//                 </div>

//                 <div className='spinner-doc'>
//                     {isLoading && <Spinner />}
//                 </div>

//                 {selectedPdf && (
//                     <div ref={fileViewerRef}>
//                         {selectedPdf.type === "application/pdf" ? (
//                             <div className="file-viewer-doc">
//                                 <iframe src={URL.createObjectURL(selectedPdf.body)} type="application/pdf" width="100%" height="600px" />
//                                 <img className="close-btn-file" src={close} alt="Close" onClick={() => setSelectedPdf(null)} />
//                                 {selectedPdf.folderName === 'Application forms' && (
//                                     <Link to={getPath(selectedPdf.name)}>
//                                         <button className='edit-button'>Edit</button>
//                                     </Link>
//                                 )}                                
//                                 <button onClick={handlePrint} className="print-button">
//                                     Open
//                                 </button>
//                             </div>
//                         ) : (
//                             <div className="file-viewer-img">
//                                 <img src={URL.createObjectURL(selectedPdf.body)} alt="Selected File" width="100%" height="600px" />
//                                 <img className="close-btn-img" src={close} alt="Close" onClick={() => setSelectedPdf(null)} />
//                             </div>
//                         )}


//                     </div>
//                 )}





//             </div>
//         </div>
//     );
// };




// const modalStyles = {
//     display: 'block',
//     position: 'fixed',
//     zIndex: 1,
//     left: 0,
//     top: 0,
//     width: '100%',
//     height: '100%',
//     overflow: 'auto',
//     backgroundColor: 'rgb(0, 0, 0)',
//     backgroundColor: 'rgba(0, 0, 0, 0.4)'
// };

// const modalContentStyles = {
//     backgroundColor: '#fefefe',
//     margin: '15% auto',
//     padding: '20px',
//     border: '1px solid #888',
//     width: '80%',
//     maxWidth: '500px',
//     textAlign: 'center'
// };

// const closeStyles = {
//     color: '#aaa',
//     float: 'right',
//     fontSize: '28px',
//     fontWeight: 'bold',
//     cursor: 'pointer'
// };

// const dropZoneStyles = {
//     border: '2px dashed #ccc',
//     borderRadius: '4px',
//     padding: '20px',
//     textAlign: 'center',
//     cursor: 'pointer',
//     marginBottom: '20px',
//     fontSize: '1rem',
//     color: 'black'
// };

// export default DocumentPage;




import React, { useState, useEffect, useRef } from 'react';
import "./document.css";
import del from "./doc_images/del3.png";
import back from "./doc_images/back1.png";
import close from "./doc_images/close.png";
import download from "./doc_images/download.png"
import logo from './doc_images/logo.png';
import service_icon from "./doc_images/service-icon3.png"
import folder from "./doc_images/folder.png"
import AWS from 'aws-sdk';
import S3 from 'aws-sdk/clients/s3';
import { Link, useNavigate } from 'react-router-dom';
import addfile from "./doc_images/add file 2.png";
import { Auth } from 'aws-amplify';
import Swal from 'sweetalert2';
import swal from 'sweetalert';
import Spinner from './Spinner';
import HeaderBar from '../HeaderBar';
import Spinner2 from "./Folder_Spinner"


import "@tensorflow/tfjs-backend-cpu";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import setupSessionTimeout from "../SessionTimeout";



import { useProject } from '../BldgServiceContext';

import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import enGB from 'date-fns/locale/en-GB';

import { getCurrentStorageUsage, updateStorageUsage } from './UserStorage';


registerLocale('en-GB', enGB);






const DocumentPage = () => {
    const [folders, setFolders] = useState([]);
    // const [defaultFolders, setDefaultFolders] = useState([]);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [uploading, setUploading] = useState();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedPdf, setSelectedPdf] = useState(null);
    const dropdownRef = useRef(null);
    const [selectedFolder, setSelectedFolder] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const fileBoxRef = useRef(null);

    const { selectedProject } = useProject();

    const [modalOpen, setModalOpen] = useState(false);
    const [files, setFiles] = useState([]);
    const fileInputRef = useRef(null);
    const dropZoneRef = useRef(null);
    const [fileType, setFileType] = useState('---None---');
    const fileViewerRef = useRef(null);
    const firstFileRef = useRef(null); // Ref to the first file







    //-----file validation------//


    const imageRef = useRef();
    const [isLoading, setIsLoading] = useState(false);
    const [isLoading2, setIsLoading2] = useState(false);

    const [errorMessage, setErrorMessage] = useState("");
    const [model, setModel] = useState(null);
    const [timeoutAlert, setTimeoutAlert] = useState(false);
    const [timeoutAlert2, setTimeoutAlert2] = useState(false);




    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');


    const today = new Date();

    const navigate = useNavigate();



    useEffect(() => {
        // Automatically click the first file if available
        if (uploadedFiles.length > 0 && firstFileRef.current) {
            firstFileRef.current.click();
        }
    }, [uploadedFiles]);




    useEffect(() => {
        const cleanupSessionTimeout = setupSessionTimeout();

        return () => {
            cleanupSessionTimeout(); // Cleanup function to remove event listeners and clear timeout
        };
    }, []);




    // useEffect(() => {
    //     // Push a dummy state to the history to prevent unintended navigation
    //     window.history.pushState(null, "", window.location.href);

    //     // Handle popstate event to prevent navigation
    //     const handlePopState = (event) => {
    //         window.history.pushState(null, "", window.location.href);
    //     };

    //     window.addEventListener("popstate", handlePopState);

    //     return () => {
    //         window.removeEventListener("popstate", handlePopState);
    //     };
    // }, []);




    let timeout;
    useEffect(() => {
        if (isLoading) {
            timeout = setTimeout(() => {
                setIsLoading(false);
                alert("Timeout");
            }, 30000);
        } else {
            clearTimeout(timeout);
            setTimeoutAlert(false);
        }

        return () => clearTimeout(timeout);
    }, [isLoading]);




    let timeout2;
    useEffect(() => {
        if (isLoading2) {
            timeout2 = setTimeout(() => {
                setIsLoading2(false);
                alert("Timeout");
            }, 30000);
        } else {
            clearTimeout(timeout2);
            setTimeoutAlert2(false);
        }

        return () => clearTimeout(timeout2);
    }, [isLoading2]);



    const readImage = (file) => {
        return new Promise((resolve, reject) => {
            if (!(file instanceof Blob)) {
                reject(new Error("Invalid file type. Please select a valid file."));
                return;
            }

            const fileReader = new FileReader();
            fileReader.onload = () => resolve(fileReader.result);
            fileReader.onerror = () => reject(fileReader.error);
            fileReader.readAsDataURL(file);
        });
    };

    const detectObjectsOnImage = async (imageElement, imgSize) => {
        if (!model) return [];
        const predictions = await model.detect(imageElement, 6);
        return normalizePredictions(predictions, imgSize);
    };

    const normalizePredictions = (predictions, imgSize) => {
        if (!predictions || !imgSize || !imageRef.current) return predictions || [];
        return predictions.map((prediction) => {
            const { bbox } = prediction;
            const oldX = bbox[0];
            const oldY = bbox[1];
            const oldWidth = bbox[2];
            const oldHeight = bbox[3];

            const imgWidth = imageRef.current.width;
            const imgHeight = imageRef.current.height;

            const x = (oldX * imgWidth) / imgSize.width;
            const y = (oldY * imgHeight) / imgSize.height;
            const width = (oldWidth * imgWidth) / imgSize.width;
            const height = (oldHeight * imgHeight) / imgSize.height;

            return { ...prediction, bbox: [x, y, width, height] };
        });
    };



    //-----file validation------//







    const handleClickOutsidebox = (event) => {
        if (fileBoxRef.current && !fileBoxRef.current.contains(event.target)) {
            setSelectedFile(null);
        }
    };



    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutsidebox);
        return () => {
            document.removeEventListener('mousedown', handleClickOutsidebox);
        };
    }, []);

    const handleFolderClick = (folderName) => {
        setSelectedFolder(folderName);
        setSelectedFile(null);
        setUploadedFiles([]);
        setSelectedPdf(false)

        storeSelectedFolderToS3(folderName)
            .then(() => fetchUploadedFilesFromS3(folderName))
            .catch((error) => console.error('Error storing selected folder:', error));
    };

    useEffect(() => {
        createUserFolders();

    }, []);


    useEffect(() => {
        const currentUser = async () => {
            const currentUser = await Auth.currentAuthenticatedUser();
            return currentUser;
        };
        currentUser().then((user) => {
            fetchFoldersFromS3(user.attributes.email);
        });
    }, []);

    useEffect(() => {
        fetchSelectedFolderFromS3()
            .then((folderName) => {
                if (folderName) {
                    setSelectedFolder(folderName);
                    fetchUploadedFilesFromS3(folderName);
                }
            })
            .catch((error) => {
                console.error('Error fetching selected folder:', error);
            });
    }, []);


    useEffect(() => {
        if (selectedFolder) {
            fetchUploadedFilesFromS3(selectedFolder);
        }
    }, [selectedFolder]);


    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];


    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleDropdownItemClick = (item) => {
        console.log(item);
        setIsDropdownOpen(false);
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsDropdownOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // console.log(selectedProject);



    useEffect(() => {
        const loadFolders = async () => {
            setIsLoading2(true);
            try {
                const currentUser = await Auth.currentAuthenticatedUser();
                const email = currentUser.attributes.email;
                const fetchedFolders = await fetchFoldersFromS3(email);
                setFolders(fetchedFolders);
            } catch (error) {
                console.error('Error loading folders:', error);
            }
            setIsLoading2(false);
        };

        loadFolders();
    }, [selectedProject]);

    //---------- new code for folder--------------//



    const BucketName = "s3testa55fa-sesapp"
    const defaultFileFolders = "default_files"
    const createUserFolders = async () => {
        try {
            const currentUser = await Auth.currentAuthenticatedUser();
            const email = currentUser.attributes.email;

            const s3 = new AWS.S3();
            const folderNames = [
                'Registration Documents',
                'Municipality Documents',
                'Legal Documents',
                'Architecture Documents',
                'Application forms',
                'Structural Documents',
                'Tax Receipts',
                'Shared Folder'
            ];

            // Create folders in S3
            for (let folderName of folderNames) {
                await s3.putObject({
                    Bucket: 's3testa55fa-sesapp',
                    Key: `${email}/Projects/${selectedProject}/${folderName}/`,
                    Body: ''
                }).promise();
            }

            const defaultFiles = [
                { folder: 'Application forms', name: 'Affidavit.pdf' },
                { folder: 'Application forms', name: 'Bond of Assurance.pdf' },
                { folder: 'Application forms', name: 'Indemnity Bond.pdf' },
                { folder: 'Application forms', name: 'Borewell Application Form.pdf' },
            ];

            for (let file of defaultFiles) {
                await s3.copyObject({
                    Bucket: 's3testa55fa-sesapp',
                    CopySource: `${BucketName}/${defaultFileFolders}/${file.name}`,
                    Key: `${email}/Projects/${selectedProject}/${file.folder}/${file.name}`,
                }).promise();
            }

            // Fetch and set user folders
            const fetchedFolders = await fetchFoldersFromS3(email);
            console.log('Fetched User Folders:', fetchedFolders);
            setFolders(fetchedFolders);
        } catch (error) {
            console.error('Error creating user folders:', error);
        }
    };


    const fetchFoldersFromS3 = async (email) => {
        try {
            const s3 = new AWS.S3();
            const data = await s3.listObjectsV2({
                Bucket: 's3testa55fa-sesapp',
                Prefix: `${email}/Projects/${selectedProject}/`
            }).promise();

            console.log("Data from S3:", data);

            const folderNames = data.Contents
                .map(object => {
                    const parts = object.Key.split('/');
                    if (parts.length > 3 && parts[1] === 'Projects' && parts[2] === selectedProject) {
                        return parts[3];
                    }
                    return null;
                })
                .filter(folderName => folderName && folderName.trim() !== ''); // Filter out any null or empty folder names

            return [...new Set(folderNames)]; // Remove duplicates
        } catch (error) {
            console.error('Error fetching user folders from S3:', error);
            return [];
        }
    };




    const fetchUploadedFilesFromS3 = async (folderName) => {
        try {
            const currentUser = await Auth.currentAuthenticatedUser();
            // const userId = currentUser.attributes.sub;
            const email = currentUser.attributes.email;


            const s3 = new AWS.S3();
            const data = await s3.listObjectsV2({
                Bucket: 's3testa55fa-sesapp',
                Prefix: `${email}/Projects/${selectedProject}/${folderName}/`
            }).promise();
            const files = data.Contents.map(file => ({
                name: file.Key.split('/').pop(),
                size: file.Size,
                type: 'application/pdf',
                folderName: folderName,

            }));
            setUploadedFiles(files);

            const defaultFile = files.find(file => file.name === 'Affidavit.pdf');
            if (defaultFile) {
                viewPdf(defaultFile);
            }
        } catch (error) {
            console.error('Error fetching uploaded files from S3:', error);
        }
    };






    const s3 = new AWS.S3();

    const fetchSelectedFolderFromS3 = async () => {
        try {
            const data = await s3.getObject({
                Bucket: 's3testa55fa-sesapp',
                Key: 'selectedFolder.json'
            }).promise();
            return JSON.parse(data.Body.toString()).folderName;
        } catch (error) {
            console.error('Error fetching selected folder:', error);
            throw error;
        }
    };

    // Function to store selected folder information to S3
    const storeSelectedFolderToS3 = async (folderName) => {
        try {
            // Make a request to store the selected folder information to S3
            await s3.putObject({
                Bucket: 's3testa55fa-sesapp',
                Key: 'selectedFolder.json',
                Body: JSON.stringify({ folderName }), // Assuming you want to store the folder name in 'selectedFolder.json'
                ContentType: 'application/json'
            }).promise();
            console.log('Selected folder stored successfully: ', folderName);
        } catch (error) {
            console.error('Error storing selected folder:', error);
            throw error;
        }
    };






    const deleteFile = async (fileIndex) => {
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this file!",
            icon: "warning",
            buttons: ["Cancel", "Delete"],
            dangerMode: true,
        })
            .then(async (willDelete) => {
                if (willDelete) {
                    try {
                        const currentUser = await Auth.currentAuthenticatedUser();
                        // const userId = currentUser.attributes.sub;
                        const email = currentUser.attributes.email;

                        const bucketName = 's3testa55fa-sesapp'; // Set the bucket name

                        const s3 = new AWS.S3();

                        const fileToDelete = uploadedFiles[fileIndex];
                        const fileKey = `${email}/Projects/${selectedProject}/${fileToDelete.folderName}/${fileToDelete.name}`; // Construct the S3 key

                        console.log('File to delete:', fileKey); // Log file path

                        // Delete the file object from S3
                        await s3.deleteObject({ Bucket: bucketName, Key: fileKey }).promise();

                        // Update the local state to remove the file
                        setUploadedFiles(prevFiles => {
                            const updatedFiles = prevFiles.filter((file, index) => index !== fileIndex);

                            // Check if the file being deleted is the currently viewed file
                            if (selectedPdf && fileToDelete.name === selectedPdf.name && fileToDelete.folderName === selectedPdf.folderName) {
                                setSelectedPdf(null); // Clear the selected PDF state if it's the same file
                            }

                            return updatedFiles;
                        });

                        swal("Poof! Your file has been deleted!", {
                            icon: "success",
                            timer: 1000,
                            button: false,
                        });
                    } catch (error) {
                        console.error('Error deleting file from S3:', error);
                        swal("Oops!", "Error deleting file: " + error.message, "error");
                    }
                } else {
                    // Cancelled deletion
                }
            })
            .catch(error => {
                console.error('Error during file deletion confirmation:', error);
            });
    };



    const handleFileDownload = async (folderName, fileName) => {
        try {
            const currentUser = await Auth.currentAuthenticatedUser();
            const email = currentUser.attributes.email;

            const s3 = new AWS.S3();
            const params = {
                Bucket: 's3testa55fa-sesapp',
                Key: `${email}/Projects/${selectedProject}/${folderName}/${fileName}`
            };

            const key = `${email}/Projects/${selectedProject}/${folderName}/${fileName}`;
            console.log("key is", key);

            // Get a pre-signed URL for the file
            const url = await s3.getSignedUrlPromise('getObject', params);

            // Fetch the file blob to determine its MIME type
            const response = await fetch(url);
            const blob = await response.blob();

            // Create a temporary anchor element to trigger the download
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Release the object URL to avoid memory leaks
            URL.revokeObjectURL(link.href);
        } catch (error) {
            console.error('Error downloading file:', error);
            swal({
                title: 'Error',
                text: 'Error downloading file: Please refresh the page and try again',
                icon: 'error',
                button: false,
                timer: 1000,
            });
        }
    };









    const viewPdf = async (file) => {
        try {
            const currentUser = await Auth.currentAuthenticatedUser();
            const email = currentUser.attributes.email;

            const s3 = new AWS.S3();
            const params = {
                Bucket: 's3testa55fa-sesapp',
                Key: `${email}/Projects/${selectedProject}/${file.folderName}/${file.name}`
            };

            // Get a pre-signed URL for the file
            const url = await s3.getSignedUrlPromise('getObject', params);
            console.log('Generated URL:', url); // Log the URL to verify it

            // Fetch the file content
            const response = await fetch(url);
            const blob = await response.blob();
            console.log('Fetched Blob:', blob); // Debugging log

            setSelectedPdf({ body: blob, type: blob.type, name: file.name, folderName: file.folderName }); // Store the file content and metadata
        } catch (error) {
            console.error('Error fetching file URL:', error);
            swal({
                title: 'Error',
                text: 'Error fetching file URL: ' + error.message,
                icon: 'error',
                button: 'OK',
            });
        }
    };





    const handlePrint = () => {
        const printWindow = window.open(URL.createObjectURL(selectedPdf.body), '_blank');
        if (printWindow) {
            printWindow.onload = () => {
                printWindow.print();
            };
        }
    };



    useEffect(() => {
        if (selectedPdf && fileViewerRef.current) {
            const element = fileViewerRef.current;
            const rect = element.getBoundingClientRect();
            const offset = window.innerHeight - rect.height;

            // Scroll to bottom of the iframe or image
            window.scrollTo({
                top: window.scrollY + rect.top + offset,
                behavior: 'smooth'
            });
        }
    }, [selectedPdf]);







    const handleModalOpen = () => {
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        dropZoneRef.current.classList.add('dragging');
    };

    const handleDragLeave = () => {
        dropZoneRef.current.classList.remove('dragging');
    };

    const handleDrop = (e) => {
        e.preventDefault();
        dropZoneRef.current.classList.remove('dragging');
        const selectedFiles = Array.from(e.dataTransfer.files);
        setFiles(selectedFiles);
        if (selectedFiles.length > 0) {
            dropZoneRef.current.textContent = selectedFiles.map(file => file.name).join(', ');
        }
    };

    const handleFileSelect = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles(selectedFiles);
        if (selectedFiles.length > 0) {
            dropZoneRef.current.textContent = selectedFiles.map(file => file.name).join(', ');
        }
    };


    const formatDate = (date) => {
        if (!date) return null;
        const formattedDate = new Intl.DateTimeFormat('en-GB', {
            month: 'short',
            year: 'numeric',
        }).format(date);

        const [month, year] = formattedDate.split(' ');
        return `${month.toUpperCase()}${year}`;
    };



    //HandleUpload is only for municipality folder
    const handleUpload = async () => {

        const formattedFromDate = formatDate(fromDate);
        const formattedToDate = formatDate(toDate);
        console.log('From Date:', formattedFromDate);
        console.log('To Date:', formattedToDate);


        if (selectedFolder === 'Municipality Documents' && fileType === '---None---') {
            swal({
                title: 'Error',
                text: 'Please select a file type from the dropdown.',
                icon: 'error',
                button: 'OK',
            });
            return;
        }

        if (selectedFolder === 'Shared Folder' && fileType === '---None---') {
            swal({
                title: 'Error',
                text: 'Please select a folder type from the dropdown.',
                icon: 'error',
                button: 'OK',
            });
            return;
        }

        if (selectedFolder === 'Municipality Documents' && fileType === 'Encumbrance certificate' && (!fromDate || !toDate)) {
            swal({
                title: 'Error',
                text: 'Please enter the to and from dates.',
                icon: 'error',
                button: 'OK',
            });

            setModalOpen(true);
            return;
        }

        if (selectedFolder === 'Tax Receipts') {
            navigate('/tax');
            return;
        }

        // const folderName = "Municipality Documents";
        await handleFileUpload(selectedFolder, files, fileType);
        setFileType('---None---');
        setFiles([]);
        handleModalClose();
        setFromDate(null);
        setToDate(null);
    };















    const handleFileUpload = async (folderName, files, fileType) => {
        if (files && files.length > 0) {
            setIsLoading(true);
            setErrorMessage("");
            const allowedTypes = ['application/pdf', 'image/png'];
            const validFiles = [];
            const invalidFiles = [];
            const s3 = new AWS.S3();

            const MAX_STORAGE_LIMIT = 10 * 1024 * 1024 * 1024;

            try {
                if (!model) {
                    const loadedModel = await cocoSsd.load();
                    setModel(loadedModel);
                }

                const currentUser = await Auth.currentAuthenticatedUser();
                const email = currentUser.attributes.email;


                const currentUsage = await getCurrentStorageUsage(email);
                const totalSize = files.reduce((acc, file) => acc + file.size, 0);

                if (currentUsage + totalSize > MAX_STORAGE_LIMIT) {
                    setIsLoading(false);
                    Swal.fire({
                        title: 'Error',
                        text: 'Uploading these files would exceed your 10GB storage limit.',
                        icon: 'error',
                        button: 'OK',
                    });
                    return;
                }



                const listParams = {
                    Bucket: 's3testa55fa-sesapp',
                    Prefix: `${email}/Projects/${selectedProject}/${folderName}/`
                };
                const existingFiles = await s3.listObjectsV2(listParams).promise();
                const existingFileNames = existingFiles.Contents.map(file => file.Key.split('/').pop());

                for (let file of files) {
                    if (!allowedTypes.includes(file.type)) {
                        invalidFiles.push(file);
                        continue;
                    }

                    if (file.type.startsWith('image/')) {
                        try {
                            const imgData = await readImage(file);
                            const imageElement = new Image();
                            imageElement.src = imgData;

                            imageElement.onload = async () => {
                                const imgSize = {
                                    width: imageElement.width,
                                    height: imageElement.height,
                                };
                                const predictions = await detectObjectsOnImage(imageElement, imgSize);
                                const hasHumanOrAnimal = predictions.some(
                                    (prediction) =>
                                        ['person', 'bird', 'cat', 'dog'].includes(prediction.class)
                                );
                                if (!hasHumanOrAnimal) {
                                    validFiles.push(file);
                                } else {
                                    invalidFiles.push(file);
                                }

                                if (validFiles.length + invalidFiles.length === files.length) {
                                    setIsLoading(false);
                                    showValidationResults(validFiles, invalidFiles, folderName, s3, email, existingFileNames, fileType);
                                }
                            };
                        } catch (error) {
                            console.error('Error processing image:', error);
                            setIsLoading(false);
                        }
                    } else if (file.type === 'application/pdf') {
                        validFiles.push(file);
                    } else {
                        invalidFiles.push(file);
                    }
                }

                if (validFiles.length + invalidFiles.length === files.length) {
                    setIsLoading(false);
                    showValidationResults(validFiles, invalidFiles, folderName, s3, email, existingFileNames, fileType);
                }


                const newStorageUsed = currentUsage + totalSize;
                await updateStorageUsage(email, newStorageUsed);



            } catch (error) {
                console.error('Error loading model or processing images:', error);
                setUploading(false);
                setIsLoading(false);

                Swal.fire({
                    title: 'Network Error',
                    text: 'Failed to upload files due to a network error. Please check your internet connection and try again.',
                    icon: 'error',
                    button: 'OK',
                });
            }
        } else {
            Swal.fire({
                title: 'Please select files to upload.',
                icon: 'warning',
                button: 'OK',
            });
        }
    }


    const showValidationResults = async (validFiles, invalidFiles, folderName, s3, email, existingFileNames, fileType) => {
        try {
            const invalidFileNames = invalidFiles.map((file) => file.name).join(", ");
            let duplicateFileMessage = '';
            let fileSizeExceedMessage = '';
            let invalidFileTypeMessage = '';
            const uploadedFilesInfo = [];

            // Valid file types
            const validFileTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif'];

            // Show message for invalid files first
            if (invalidFiles.length > 0) {
                Swal.fire({
                    title: 'Invalid Files',
                    html: `The following files are invalid and will not be uploaded:<strong style="color: red;"><br>${invalidFileNames}</strong>`,
                    icon: 'error',
                    button: "OK",
                });
            }

            for (let file of validFiles) {
                let newFileName = file.name;

                // Check for valid file type
                if (!validFileTypes.includes(file.type)) {
                    invalidFileTypeMessage += `${file.name} is not a valid file type.\n`;
                    continue;
                }

                // Rename file if necessary
                if (folderName === 'Municipality Documents') {
                    if (fileType === 'Encumbrance certificate') {
                        const formattedFromDate = formatDate(fromDate);
                        const formattedToDate = formatDate(toDate);
                        newFileName = `EC ${formattedFromDate}-${formattedToDate}${file.name.substring(file.name.lastIndexOf('.'))}`;
                    } else {
                        newFileName = `${fileType}${file.name.substring(file.name.lastIndexOf('.'))}`;
                    }
                }

                if (folderName === 'Shared Folder') {
                    console.log(fileType);

                    const params = {
                        Bucket: 's3testa55fa-sesapp',
                        Key: `${email}/Projects/${selectedProject}/${fileType}/${newFileName}`,
                        Body: file,
                        ContentType: file.type,
                    };

                    
                    const params1 = {
                        Bucket: 's3testa55fa-sesapp',
                        Key: `${email}/Projects/${selectedProject}/${folderName}/${newFileName}`,
                        Body: file,
                        ContentType: file.type,
                    };

                    await s3.upload(params).promise();
                    await s3.upload(params1).promise();
                    uploadedFilesInfo.push({ name: newFileName, size: file.size, type: file.type, fileType });

                    if (uploadedFilesInfo.length > 0) {
                        Swal.fire({
                            title: 'Files uploaded successfully',
                            icon: 'success',
                            timer: 1500,
                            showConfirmButton: false
                        });
        
                        setUploadedFiles(prevFiles => {
                            console.log([...prevFiles, ...uploadedFilesInfo]);
                            return [...prevFiles, ...uploadedFilesInfo];
                        });
                        console.log("Files uploaded:", uploadedFilesInfo);
                    }

                   return;
                }

                // Check for duplicate files
                if (existingFileNames.includes(newFileName)) {
                    duplicateFileMessage += `${newFileName} is already uploaded.\n`;
                    continue;
                }

                // Check for file size limit
                if (file.size > 2 * 1024 * 1024) {
                    fileSizeExceedMessage += `${file.name} exceeds the limit of 2 MB.\n`;
                    continue;
                }

                // Upload file
                const params = {
                    Bucket: 's3testa55fa-sesapp',
                    Key: `${email}/Projects/${selectedProject}/${folderName}/${newFileName}`, // Removed the trailing slash
                    Body: file,
                    ContentType: file.type,
                };

                await s3.upload(params).promise();
                uploadedFilesInfo.push({ name: newFileName, size: file.size, type: file.type, folderName });

            }

            // Show specific error messages if encountered
            if (invalidFileTypeMessage) {
                Swal.fire({
                    title: 'Invalid File Type',
                    text: invalidFileTypeMessage,
                    icon: 'warning',
                    button: 'OK',
                });
            }

            if (duplicateFileMessage) {
                Swal.fire({
                    title: 'Duplicate Files',
                    text: duplicateFileMessage,
                    icon: 'warning',
                    button: 'OK',
                });
            }

            if (fileSizeExceedMessage) {
                Swal.fire({
                    title: 'File Size Exceeded',
                    text: fileSizeExceedMessage,
                    icon: 'error',
                    button: 'OK',
                });
            }

            // Show success message if files were uploaded
            if (uploadedFilesInfo.length > 0) {
                Swal.fire({
                    title: 'Files uploaded successfully',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });

                setUploadedFiles(prevFiles => {
                    console.log([...prevFiles, ...uploadedFilesInfo]);
                    return [...prevFiles, ...uploadedFilesInfo];
                });
                console.log("Files uploaded:", uploadedFilesInfo);
            }

        } catch (error) {
            console.error('Network error:', error);
            setUploading(false);
            Swal.fire({
                title: 'Network Error',
                text: 'Failed to upload files due to a network error. Please check your internet connection and try again.',
                icon: 'error',
                button: 'OK',
            });
        }
    };






    const getPath = (fileName) => {
        switch (fileName) {
            case 'Borewell Application Form.pdf':
                return '/document/borewell';

            case 'Affidavit.pdf':
                return '/document/affidavit';

            case 'Bond of Assurance.pdf':
                return '/document/bondofassurance';

            case 'Indemnity Bond.pdf':
                return '/document/indemnitybond';

            default:
                return '#'; // Default path or a fallback
        }
    };



    // useEffect(() => {
    //     fetch('/Affidavit.pdf')
    //         .then(response => response.blob())
    //         .then(blob => {
    //             setSelectedPdf({
    //                 type: 'application/pdf',
    //                 body: blob,
    //                 name: 'Affidavit.pdf'
    //             });
    //         });
    // }, []);






    useEffect(() => {
        const fetchFiles = async () => {
            await fetchUploadedFilesFromS3('Application forms');
        };

        fetchFiles();
    }, []);















    return (
        <div className="document-page-container">

            <HeaderBar />


            <div className='back-btn'>
                <Link to="/"><img className='back-btn-arch' src={back} alt=""></img></Link>
            </div>

            <div className='title'>
                <h1 className="page-title-doc">Documents</h1>
            </div>


            <div className='folder-section-box'>


                <div className="folders-wrapper">
                    <div className="folder-box">
                        {/* Default Folder */}

                        <div className="folder">
                            <h3 className="folder_head">Folders</h3>
                            <div className="folder_content">
                                {isLoading2 ? (
                                    <div className="spinner-folder">
                                        <Spinner2 />
                                    </div>
                                ) : (
                                    <ul className="folder_list">
                                        {folders.map((folderName, index) => (
                                            <li className={`folder_names ${selectedFolder === folderName ? 'selected-folder-doc' : ''}`} key={index} onClick={() => handleFolderClick(folderName)}>                                    <img className="folder_img" src={folder} alt="" />
                                                {folderName}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div><br></br>

                        {/* Render file upload box if selectedFolder is truthy */}
                        {selectedFolder && (
                            <div className="folder" ref={fileBoxRef}>
                                <h4 className='folder_title'>{selectedFolder}</h4>
                                <label className="upload-icon">
                                    {selectedFolder == 'Tax Receipts' && (<img onClick={handleUpload} className='add_file_img' src={addfile} alt="Add File" />) || (<img onClick={handleModalOpen} className='add_file_img' src={addfile} alt="Add File" />)}
                                </label>
                                {modalOpen && (
                                    <div className="modal" style={modalStyles}>
                                        <div className="modal-content" style={modalContentStyles}>
                                            <span className="close" onClick={handleModalClose} style={closeStyles}>&times;</span>
                                            <h2>Upload Files</h2>
                                            <div id="dropZone" ref={dropZoneRef} style={dropZoneStyles}
                                                onDragOver={handleDragOver}
                                                onDragLeave={handleDragLeave}
                                                onDrop={handleDrop}
                                            >
                                                <p>Drag & Drop files here</p>
                                                <p>or</p>
                                                <button className='select-files-text' onClick={handleFileSelect}>Select Files</button>
                                                <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple={selectedFolder !== 'Municipality Documents'} style={{ display: 'none' }} />
                                            </div>
                                            {selectedFolder === 'Municipality Documents' && (
                                                <div>
                                                    <label className="file_type" htmlFor="fileType">Select File Type:</label>
                                                    <select value={fileType} onChange={(e) => setFileType(e.target.value)}>
                                                        <option value="---None---">-------None-------</option>
                                                        <option value="Environmental Clearance">Environmental Clearance</option>
                                                        <option value="Building Plan">Building Plan</option>
                                                        <option value="Katha Copy">Katha Copy</option>
                                                        <option value="Encumbrance certificate">Encumbrance certificate</option>
                                                        <option value="Application Form">Application Form</option>
                                                        <option value="Title Deed">Title Deed</option>
                                                        <option value="Building Estimation">Building Estimations</option>
                                                        <option value="Tax Receipt">Tax Receipt</option>
                                                    </select>
                                                    {fileType === 'Encumbrance certificate' && (
                                                        <div className='date-selector-ec'>
                                                            <label htmlFor="fromDate"><b>From Year:</b></label>
                                                            <DatePicker
                                                                selected={fromDate}
                                                                onChange={(date) => setFromDate(date)}
                                                                dateFormat="MM/yyyy"
                                                                showMonthYearPicker
                                                                locale="en-GB"
                                                                maxDate={today}
                                                            />

                                                            <label htmlFor="toDate"><b>To Year:</b></label>
                                                            <DatePicker
                                                                selected={toDate}
                                                                onChange={(date) => setToDate(date)}
                                                                dateFormat="MM/yyyy"
                                                                showMonthYearPicker
                                                                locale="en-GB"
                                                                maxDate={today}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                            {selectedFolder === 'Shared Folder' && (
                                                <div>
                                                    <label className="file_type" htmlFor="fileType">Select Folder Name: </label>
                                                    <select value={fileType} onChange={(e) => setFileType(e.target.value)}>
                                                        <option value="---None---">-------None-------</option>
                                                        <option value="Architecture Documents">Architecture Documents</option>
                                                        <option value="Structural Documents">Structural Documents</option>
                                                        <option value="Legal Documents">Legal Documents</option>
                                                        <option value="Registration Documents">Registration Documents</option>
                                                    </select>
                                                </div>
                                            )}

                                            <button className='upload-btn' onClick={() => { handleUpload(); handleModalClose(); }}>Upload</button>

                                        </div>
                                    </div>
                                )}

                                {uploadedFiles.length > 0 ? (
                                    uploadedFiles.map((file, fileIndex) => (
                                        file.name ? (
                                            <div className={`file-list ${selectedFile === fileIndex ? 'selected' : ''}`} key={fileIndex} onClick={() => setSelectedFile(fileIndex)}>
                                                <p className='file-name' onClick={() => viewPdf(file)}>{file.name}</p>
                                                <img className='download-icon' src={download} alt='Download' onClick={() => selectedFile === fileIndex && handleFileDownload(file.folderName, file.name)} style={{ filter: selectedFile === fileIndex ? 'none' : 'grayscale(100%)' }} />
                                                <img className='del_file_img' src={del} alt='Delete' onClick={() => selectedFile === fileIndex && deleteFile(fileIndex)} style={{ filter: selectedFile === fileIndex ? 'none' : 'grayscale(100%)' }} />

                                            </div>
                                        ) : null
                                    ))
                                ) : (
                                    <p></p>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className='spinner-doc'>
                    {isLoading && <Spinner />}
                </div>

                {selectedPdf && (
                    <div ref={fileViewerRef}>
                        {selectedPdf.type === "application/pdf" ? (
                            <div className="file-viewer-doc">
                                <iframe src={URL.createObjectURL(selectedPdf.body)} type="application/pdf" width="100%" height="600px" />
                                <img className="close-btn-file" src={close} alt="Close" onClick={() => setSelectedPdf(null)} />
                                {selectedPdf.folderName === 'Application forms' && (
                                    <Link to={getPath(selectedPdf.name)}>
                                        <button className='edit-button'>Edit</button>
                                    </Link>
                                )}
                                <button onClick={handlePrint} className="print-button">
                                    Open
                                </button>
                            </div>
                        ) : (
                            <div className="file-viewer-img">
                                <img src={URL.createObjectURL(selectedPdf.body)} alt="Selected File" width="100%" height="600px" />
                                <img className="close-btn-img" src={close} alt="Close" onClick={() => setSelectedPdf(null)} />
                            </div>
                        )}


                    </div>
                )}





            </div>
        </div>
    );
};




const modalStyles = {
    display: 'block',
    position: 'fixed',
    zIndex: 1,
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    overflow: 'auto',
    backgroundColor: 'rgb(0, 0, 0)',
    backgroundColor: 'rgba(0, 0, 0, 0.4)'
};

const modalContentStyles = {
    backgroundColor: '#fefefe',
    margin: '15% auto',
    padding: '20px',
    border: '1px solid #888',
    width: '80%',
    maxWidth: '500px',
    textAlign: 'center'
};

const closeStyles = {
    color: '#aaa',
    float: 'right',
    fontSize: '28px',
    fontWeight: 'bold',
    cursor: 'pointer'
};

const dropZoneStyles = {
    border: '2px dashed #ccc',
    borderRadius: '4px',
    padding: '20px',
    textAlign: 'center',
    cursor: 'pointer',
    marginBottom: '20px',
    fontSize: '1rem',
    color: 'black'
};

export default DocumentPage;

