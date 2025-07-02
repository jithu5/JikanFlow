import { Button } from '@/components/ui/button';
import { Kanban } from 'lucide-react';


type Props = {
    usersMoving: string[],
    user: {
        username:string;
        email: string
    }
}

function Header({ usersMoving,user }: Props) {
  return (
      <div className="mb-6 flex w-full px-10 justify-between items-center">
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Kanban className="w-6 h-6 text-blue-600" />
              Kanban Board
          </h2>
          {usersMoving.length > 0 && (
              <div className="flex items-center gap-2 mt-3 bg-yellow-50 text-yellow-800 px-4 py-2 border border-yellow-300 rounded-lg w-fit">
                  <span className="font-semibold">Moving tasks:</span>
                  {usersMoving.slice(0, 3).map((username, index) => {
                      if (username !== user.username) {
                          return (
                              <span key={index} className="text-sm bg-white text-black px-2 py-0.5 rounded-full">
                                  {username}
                              </span>
                          );
                        }
                        return null;
                    })}
                  {usersMoving.length > 3 && (
                      <span className="text-sm text-yellow-800">+{usersMoving.length - 3} more</span>
                    )}
              </div>
          )}
          {/* ✅ Add Member */}
          <Button>Add Member</Button>

      </div>
  )
}

export default Header