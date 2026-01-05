import { useFriendStore } from '@/stores/useFriendStore';
import FriendRequestItem from './FriendRequestItem';
import { Button } from '../ui/button';
import { toast } from 'sonner';

const ReceivedRequests = () => {
  const { acceptFriendRequest, declineFriendRequest, loading, receivedList } =
    useFriendStore();

  if (!receivedList || receivedList.length === 0) {
    return (
      <p className='text-sm text-muted-foreground'>
        Bạn chưa nhận lời mời kết bạn nào
      </p>
    );
  }

  const handleAccept = async (requestId: string) => {
    try {
      await acceptFriendRequest(requestId);
      toast.success('Đã chấp nhận lời mời kết bạn');
    } catch (error) {
      console.log('Lỗi xảy ra khi chấp nhận lời mời kết bạn', error);
    }
  };

  const handleDecline = async (requestId: string) => {
    try {
      await declineFriendRequest(requestId);
      toast.info('Đã từ chối lời mời kết bạn');
    } catch (error) {
      console.log('Lỗi xảy ra khi từ chối lời mời kết bạn', error);
    }
  };

  return (
    <div className='space-y-3 mt-4'>
      {receivedList.map((request) => (
        <FriendRequestItem
          key={request._id}
          requestInfo={request}
          type='received'
          action={
            <div className='flex gap-2'>
              <Button
                size='sm'
                variant='primary'
                onClick={() => handleAccept(request._id)}
                disabled={loading}
              >
                Chấp nhận
              </Button>
              <Button
                size='sm'
                variant='destructiveOutline'
                onClick={() => handleDecline(request._id)}
                disabled={loading}
              >
                Từ chối
              </Button>
            </div>
          }
        />
      ))}
    </div>
  );
};

export default ReceivedRequests;
