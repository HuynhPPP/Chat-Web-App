import type { UseFormRegister } from 'react-hook-form';
import type { IFormValues } from '../chat/AddFriendModal';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { DialogClose, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { UserPlus } from 'lucide-react';

interface SendFriendRequestProps {
  register: UseFormRegister<IFormValues>;
  loading: boolean;
  searchedUsername: string;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  onBack?: () => void;
}

const SendFriendRequestForm = ({
  register,
  loading,
  searchedUsername,
  onSubmit,
  onBack,
}: SendFriendRequestProps) => {
  return (
    <form onSubmit={onSubmit} className='space-y-4'>
      <div className='success-message'>
        Tìm thấy{' '}
        <span className='font-semibold'>@{searchedUsername} rồi nè 🎉</span>
      </div>
      <div className='space-y-2'>
        <Label htmlFor='message' className='text-sm font-semibold'>
          Giới thiệu
        </Label>
        <Textarea
          id='message'
          rows={3}
          placeholder='Chào bạn ~ Có thể kết bạn được không?...'
          className='glass border-border/50 focus:border-primary/50 transition-smooth resize-none'
          {...register('message')}
        />
      </div>

      <DialogFooter>
        <Button
          type='button'
          variant='outline'
          onClick={onBack}
          className='flex-1 glass hover:text-destructive'
        >
          Quay lại
        </Button>
        <Button
          type='submit'
          disabled={loading}
          className='flex-1 bg-gradient-chat text-white hover:opacity-90 transition-smooth'
        >
          {loading ? (
            'Đang gửi...'
          ) : (
            <>
              <UserPlus className='size-4 mr-2' /> Kết bạn
            </>
          )}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default SendFriendRequestForm;
