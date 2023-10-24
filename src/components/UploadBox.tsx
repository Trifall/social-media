/* eslint-disable @typescript-eslint/no-unused-vars */
import type { FileWithPath } from '@uploadthing/react';
import { useDropzone } from '@uploadthing/react/hooks';
import { forwardRef, useCallback, useEffect, useState } from 'react';
import { FieldError } from 'react-hook-form';
import { generateClientDropzoneAccept } from 'uploadthing/client';
import { useUploadThing } from '../utils/uploadthing';

type MultiUploaderProps = {
	onChange?: (files: File[]) => void;
	error?: FieldError;
};

const MultiUploader = forwardRef((props: MultiUploaderProps, _ref) => {
	const { onChange, error } = props;
	const [files, setFiles] = useState<File[]>([]);
	const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
		setFiles(acceptedFiles);
	}, []);

	const { startUpload, permittedFileInfo } = useUploadThing('imageUploader', {
		onClientUploadComplete: () => {
			alert('uploaded successfully!');
		},
		onUploadError: () => {
			alert('error occurred while uploading');
		},
		onUploadBegin: () => {
			alert('upload has begun');
		},
	});

	useEffect(() => {
		onChange?.(files);
	}, [files, onChange]);

	const fileTypes = permittedFileInfo?.config ? Object.keys(permittedFileInfo?.config) : [];

	const { getRootProps, getInputProps } = useDropzone({
		onDrop,
		accept: fileTypes ? generateClientDropzoneAccept(fileTypes) : undefined,
		maxFiles: 4,
		maxSize: 4000000,
		onError: (error) => {
			alert(error.message);
		},
		onDropRejected(fileRejections) {
			if (fileRejections[0].errors[0].code === 'TOO_MANY_FILES') {
				alert(`File(s) Rejected: You can only upload up to 4 files.`);
			} else if (fileRejections[0].errors[0].code === 'FILE_TOO_LARGE') {
				alert(`File(s) Rejected: File size must be less than 4MB.`);
			} else if (fileRejections[0].errors[0].code === 'FILE_INVALID_TYPE') {
				alert(`File(s) Rejected: File must an image.`);
			} else {
				alert(`File(s) Rejected: ${fileRejections[0].errors[0].message}`);
			}
		},
	});

	// call startUpload with the files on form submit
	return (
		<div
			className={`py-6 border-2 gap-4  ${
				error ? `border-red-500` : `border-blue-500`
			} hover:cursor-pointer flex flex-col justify-center items-center`}
			{...getRootProps()}
		>
			<input {...getInputProps()} />
			File dropzone
			<div className=''>
				{files.length > 0 && (
					<span className={`bg-blue-600 p-2 rounded-sm`}>
						{files.length} file{files.length > 1 ? 's' : ''} queued
					</span>
				)}
			</div>
			{error?.message && <span className='text-red-400'>{error.message}</span>}
		</div>
	);
});

MultiUploader.displayName = 'MultiUploader';
export default MultiUploader;
