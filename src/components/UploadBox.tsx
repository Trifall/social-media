/* eslint-disable @typescript-eslint/no-unused-vars */
import type { FileWithPath } from '@uploadthing/react';
import { useDropzone } from '@uploadthing/react/hooks';
import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import { FieldError } from 'react-hook-form';
import { AiOutlineUpload } from 'react-icons/ai';
import { generateClientDropzoneAccept } from 'uploadthing/client';

type MultiUploaderProps = {
	onChange?: (files: File[]) => void;
	error?: FieldError;
	permittedFileInfo?: {
		config: Record<string, unknown>;
	};
	disabled?: boolean;
};

const MultiUploader = forwardRef((props: MultiUploaderProps, _ref) => {
	const { onChange, error, permittedFileInfo, disabled } = props;
	const [files, setFiles] = useState<File[]>([]);
	const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
		setFiles(acceptedFiles);
	}, []);

	// form dirtying ref fix
	const isInitialized = useRef<boolean>(false);

	useEffect(() => {
		// fixes the form being marked as dirty when the component mounts
		if (!isInitialized.current) {
			if (files.length <= 0) {
				return;
			} else {
				isInitialized.current = true;
			}
		}

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
		disabled: files.length >= 4 || disabled,
	});

	// call startUpload with the files on form submit
	return (
		<div
			className={`py-4 border-2 gap-2  ${error ? `border-red-500` : `border-blue-500`} ${
				disabled ? `hover:cursor-default opacity-50` : `hover:cursor-pointer`
			} flex flex-col justify-center items-center`}
			{...getRootProps()}
		>
			<input {...getInputProps()} />
			<span>Upload Media</span>
			<AiOutlineUpload className='h-6 w-6' />
			{files.length > 0 && (
				<span className={`bg-blue-600 p-2 rounded-sm text-white `}>
					{files.length} File{files.length > 1 ? 's' : ''} Queued
				</span>
			)}
			{error?.message && <span className='text-red-400'>{error.message}</span>}
		</div>
	);
});

MultiUploader.displayName = 'MultiUploader';
export default MultiUploader;
