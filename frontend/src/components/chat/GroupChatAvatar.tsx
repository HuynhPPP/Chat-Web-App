import type { Participant } from "@/types/chat";
import UserAvatar from "./UserAvatar";
import { Ellipsis } from "lucide-react";

interface GroupChatAvatarProps {
  participants: Participant[];
  type: "sidebar" | "chat";
}

const GroupChatAvatar = ({ participants, type }: GroupChatAvatarProps) => {
  const avatarts = [];
  const limit = Math.min(participants.length, 4);

  for (let i = 0; i < limit; i++) {
    const member = participants[i];
    avatarts.push(
      <UserAvatar
        key={i}
        type={type}
        name={member.displayName}
        avatarUrl={member.avatarUrl ?? undefined}
      />
    );
  }
  return (
    <div className="relative flex -space-x-2 *:data-[slot=avatar]:ring-background *:data-[slot=avatar]:ring-2 ">
      {avatarts}
      {/* nếu group nhiều hơn 4 thì render ... */}
      {participants.length > 4 && (
        <div className="flex items-center z-10 justify-center bg-muted rounded-full size-8 ring-background text-muted-foreground">
          <Ellipsis className="size-4" />
        </div>
      )}
    </div>
  );
};

export default GroupChatAvatar;
