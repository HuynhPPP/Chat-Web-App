import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFriendStore } from '@/stores/useFriendStore';
import SentRequest from './SentRequest';
import ReceivedRequests from './ReceivedRequests';

interface FriendRequestDialogProps {
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
}

export const FriendRequestDialog = ({
  open,
  onOpenChange,
}: FriendRequestDialogProps) => {
  const [tab, setTab] = useState('received');
  const { getAllFriendRequests } = useFriendStore();
  useEffect(() => {
    const loadRequest = async () => {
      try {
        await getAllFriendRequests();
      } catch (error) {
        console.log('Lỗi xảy ra khi load friend request', error);
      }
    };
    loadRequest();
  }, []);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>Lời mời kết bạn</DialogTitle>
        </DialogHeader>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='received'>Đã nhận</TabsTrigger>
            <TabsTrigger value='sent'>Đã gửi</TabsTrigger>
          </TabsList>

          <TabsContent value='received'>
            <ReceivedRequests />
          </TabsContent>

          <TabsContent value='sent'>
            <SentRequest />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
