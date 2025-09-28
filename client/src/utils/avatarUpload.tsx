// components/AvatarUpload.tsx
import React, { useRef, useState } from 'react';
import { useAvatarUpload } from '../hooks/useAvatarUpload';

interface AvatarUploadProps {
  onAvatarChange: (file: File | null) => void;
  currentAvatar?: string;
  disabled?: boolean;
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({
  onAvatarChange,
  currentAvatar,
  disabled = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { isUploading, uploadProgress } = useAvatarUpload();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB');
      return;
    }

    // Create preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Notify parent component
    onAvatarChange(file);

    // Cleanup function
    return () => URL.revokeObjectURL(objectUrl);
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    onAvatarChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className='avatar-upload'>
      <input
        type='file'
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept='image/*'
        style={{ display: 'none' }}
        disabled={disabled || isUploading}
      />

      <div className='avatar-preview-container'>
        {(previewUrl || currentAvatar) && (
          <div className='avatar-preview'>
            <img
              src={previewUrl || currentAvatar}
              alt='Avatar preview'
              className='avatar-image'
            />
            {!disabled && !isUploading && (
              <button
                type='button'
                onClick={handleRemove}
                className='remove-avatar-btn'
              >
                ×
              </button>
            )}
          </div>
        )}

        {!previewUrl && !currentAvatar && (
          <div
            className={`avatar-placeholder ${disabled ? 'disabled' : ''}`}
            onClick={handleClick}
          >
            {isUploading ? (
              <div className='upload-progress'>
                <div className='progress-text'>
                  Uploading... {uploadProgress}%
                </div>
                <div className='progress-bar'>
                  <div
                    className='progress-fill'
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            ) : (
              <span>Click to upload avatar</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
