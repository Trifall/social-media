/* eslint-disable @typescript-eslint/no-unused-vars */
import type { FileWithPath } from '@uploadthing/react';
import { useDropzone } from '@uploadthing/react/hooks';
import { useCallback, useState } from 'react';
import { generateClientDropzoneAccept } from 'uploadthing/client';
import { useUploadThing } from '../utils/uploadthing';

export function MultiUploader() {
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

	const fileTypes = permittedFileInfo?.config ? Object.keys(permittedFileInfo?.config) : [];

	const { getRootProps, getInputProps } = useDropzone({
		onDrop,
		accept: fileTypes ? generateClientDropzoneAccept(fileTypes) : undefined,
	});

	// call startUpload with the files on form submit
	return (
		<div
			className='py-6 border-2 gap-4 border-blue-500 hover:cursor-pointer flex flex-col justify-center items-center'
			{...getRootProps()}
		>
			<input {...getInputProps()} />
			File dropzone
			<div className=''>
				{files.length > 0 && (
					<span className='bg-blue-600 p-2 rounded-sm'>
						{files.length} file{files.length > 1 ? 's' : ''} queued
					</span>
				)}
			</div>
		</div>
	);
}
