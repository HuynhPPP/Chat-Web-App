import { SidebarInset } from "../ui/sidebar";
import ChatWindowHeader from "./layout/ChatWindowHeader";
import { MessageSquarePlus, UserPlus, Search } from "lucide-react";
import { Button } from "../ui/button";
import { useAuthStore } from "@/stores/useAuthStore";

const ChatWelcomeScreen = () => {
  // Lấy thông tin user từ Store
  const { user } = useAuthStore();

  // Lấy tên hiển thị: Ưu tiên displayName -> firstName -> username -> "Bạn"
  const displayName = user?.displayName || user?.username || "Bạn";

  return (
    <SidebarInset className="flex w-full h-full bg-background relative overflow-hidden">
      <ChatWindowHeader />

      {/* --- LỚP BACKGROUND AURORA --- */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-[128px] opacity-50 animate-blob"></div>
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-blue-500/30 rounded-full mix-blend-multiply filter blur-[128px] opacity-50 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-20 w-96 h-96 bg-primary/30 rounded-full mix-blend-multiply filter blur-[128px] opacity-50 animate-blob animation-delay-4000"></div>
      </div>

      {/* --- CONTENT CHÍNH --- */}
      <div className="flex flex-1 flex-col items-center justify-center p-6 relative z-10">
        {/* ICON CONTAINER */}
        <div className="relative group mb-8">
          <div className="absolute inset-0 bg-linear-to-r from-primary/40 to-purple-500/40 rounded-full blur-2xl transform group-hover:scale-110 transition-transform duration-500"></div>
          <div className="relative size-32 bg-background/40 backdrop-blur-xl border border-white/20 shadow-2xl rounded-[2.5rem] flex items-center justify-center animate-float">
            <span className="text-6xl drop-shadow-2xl filter grayscale-[0.1] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-300 cursor-default select-none">
              💬
            </span>
            <div className="absolute inset-0 rounded-[2.5rem] ring-1 ring-inset ring-white/20 pointer-events-none"></div>
          </div>
        </div>

        {/* TYPOGRAPHY */}
        <div className="text-center max-w-md space-y-3 mb-10">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Xin chào,
            <span className="bg-clip-text text-transparent bg-linear-to-r from-primary to-purple-500 ml-2">
              {displayName}!
            </span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Chào mừng bạn đến với Chat-App!
          </p>
          <p className="text-muted-foreground text-lg">
            Chọn một cuộc hội thoại để bắt đầu chat!
          </p>
        </div>

        {/* QUICK ACTIONS */}
        <div className="flex flex-wrap items-center justify-center gap-3 w-full max-w-lg">
          <QuickActionButton
            icon={<MessageSquarePlus className="size-4" />}
            label="Nhóm mới"
          />
          <QuickActionButton
            icon={<UserPlus className="size-4" />}
            label="Thêm bạn"
          />
          <QuickActionButton
            icon={<Search className="size-4" />}
            label="Tìm kiếm"
          />
        </div>
      </div>
    </SidebarInset>
  );
};

const QuickActionButton = ({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) => (
  <Button
    variant="outline"
    className="h-12 px-6 rounded-xl border-white/10 bg-background/50 backdrop-blur-md hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all duration-300 shadow-sm group"
  >
    <span className="mr-2 text-muted-foreground group-hover:text-primary transition-colors">
      {icon}
    </span>
    {label}
  </Button>
);

export default ChatWelcomeScreen;
