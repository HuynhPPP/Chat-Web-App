import type { Dispatch, SetStateAction } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import ProfileCard from './ProfileCard';
import { useAuthStore } from '@/stores/useAuthStore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { PersonalInfoForm } from './PersonalInfoForm';
import PreferencesForm from './PreferencesForm';
import SecurityForm from './SecurityForm';

interface ProfileDiaglogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const ProfileDiaglog = ({ open, setOpen }: ProfileDiaglogProps) => {
  const { user } = useAuthStore();
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className='overflow-y-auto p-0 bg-transparent border-0 shadow-2xl'>
        <div className='bg-gradient-glass'>
          <div className='max-w-4xl mx-auto p-4'>
            {/* heading */}
            <DialogHeader className='mb-6'>
              <DialogTitle className='text-2xl font-bold text-foreground'>
                Thiết lập trang cá nhân
              </DialogTitle>
            </DialogHeader>
            <ProfileCard user={user} />

            {/* tabs */}
            <Tabs defaultValue='personal' className='my-4'>
              <TabsList className='grid w-full grid-cols-3 glass-light'>
                <TabsTrigger value='personal'>Tài khoản</TabsTrigger>
                <TabsTrigger value='preferences'>Cấu hình</TabsTrigger>
                <TabsTrigger value='security'>Bảo mật</TabsTrigger>
              </TabsList>
              <TabsContent value='personal'>
                <PersonalInfoForm userInfo={user} />
              </TabsContent>
              <TabsContent value='preferences'>
                <PreferencesForm />
              </TabsContent>
              <TabsContent value='security'>
                <SecurityForm />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileDiaglog;
