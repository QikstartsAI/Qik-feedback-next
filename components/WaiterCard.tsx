import { Card, CardContent } from "@/components/ui/card";
import { Waiter } from "@/lib/domain/entities";
import { Star } from "lucide-react";

interface WaiterCardProps {
  waiter: Waiter;
}

export function WaiterCard({ waiter }: WaiterCardProps) {
  const { name, lastName, gender, rate } = waiter.payload;
  const fullName = `${name} ${lastName}`.trim();

  // Determine profile image based on gender
  const profileImage =
    gender === "male" ? "/waiter_male.gif" : "/waiter_female.gif";

  return (
    <Card className="shadow-lg border-0 bg-white/95 backdrop-blur mb-4">
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <img
              src={profileImage}
              alt={`${fullName} profile`}
              className="w-16 h-16 rounded-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-800 truncate">
              {fullName}
            </h3>
            <p className="text-sm text-gray-600 mb-2">Hoy te atendí</p>
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium text-gray-700">
                {rate ? rate.toFixed(1) : 'N/A'}
              </span>
              <span className="text-xs text-gray-500">/ 5.0</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
