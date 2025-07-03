import { Button } from '@/components/ui/button';
import { Kanban } from 'lucide-react';


type Props = {
 
}

function Header({  }: Props) {
  return (
      <div className="mb-6 flex w-full px-10 justify-between items-center">
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Kanban className="w-6 h-6 text-blue-600" />
              Kanban Board
          </h2>
          
          {/* ✅ Add Member */}
          <Button>Add Member</Button>

      </div>
  )
}

export default Header