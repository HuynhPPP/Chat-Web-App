import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useUserStore } from '@/stores/useUserStore';
import { Camera, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const AvatarUploader = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadAvatarUrl } = useUserStore();
  const [isUploading, setIsUploading] = useState(false);

  const handleClick = () => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file ảnh');
      return;
    }

    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Kích thước file không được vượt quá 2MB');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    const result = await uploadAvatarUrl(formData);

    if (result.success) {
      toast.success('Cập nhật ảnh đại diện thành công');
    } else {
      toast.error(result.message || 'Có lỗi xảy ra khi cập nhật ảnh đại diện');
    }

    setIsUploading(false);
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <Button
        size='icon'
        variant='secondary'
        onClick={handleClick}
        disabled={isUploading}
        className='absolute -bottom-2 -right-2 size-9 rounded-full shadow-md hover:scale-115 transition duration-300 hover:bg-background disabled:opacity-50 disabled:cursor-not-allowed'
      >
        {isUploading ? (
          <Loader2 className='size-4 animate-spin' />
        ) : (
          <Camera className='size-4' />
        )}
      </Button>

      <input
        type='file'
        hidden
        ref={fileInputRef}
        onChange={handleUpload}
        accept='image/*'
      />
    </>
  );
};

export default AvatarUploader;
