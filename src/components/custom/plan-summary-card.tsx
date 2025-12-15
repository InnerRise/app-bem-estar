"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Check, Eye } from "lucide-react";

interface PlanAction {
  id: string;
  day: string;
  activity: string;
  time: string;
  completed?: boolean;
}

interface PlanSummaryCardProps {
  title: string;
  icon: React.ReactNode;
  actions: PlanAction[];
  gradient: string;
  borderColor: string;
  badgeColor: string;
  onViewAction?: (actionId: string) => void;
  onCompleteAction?: (actionId: string) => void;
}

export function PlanSummaryCard({
  title,
  icon,
  actions,
  gradient,
  borderColor,
  badgeColor,
  onViewAction,
  onCompleteAction
}: PlanSummaryCardProps) {
  return (
    <Card className={`bg-gradient-to-br ${gradient} border-2 ${borderColor} backdrop-blur-sm`}>
      <CardContent className="p-6 md:p-8 space-y-4">
        <div className="flex items-center gap-3">
          {icon}
          <h2 className="text-2xl font-bold text-white">{title}</h2>
        </div>
        <div className="space-y-4">
          {actions.map((item) => (
            <div 
              key={item.id} 
              className={`flex items-center justify-between p-4 bg-black/30 rounded-lg border ${borderColor.replace('border-', 'border-').replace('/50', '/30')} transition-all duration-300 ${
                item.completed ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                <Badge className={`${badgeColor} border-opacity-50`}>
                  {item.day}
                </Badge>
                <div>
                  <p className={`font-medium ${item.completed ? 'line-through text-gray-400' : 'text-white'}`}>
                    {item.activity}
                  </p>
                  <p className="text-sm text-gray-400">{item.time}</p>
                </div>
              </div>
              {!item.completed && (
                <div className="flex gap-2">
                  {onViewAction && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className={`${borderColor.replace('border-', 'border-').replace('/50', '/50')} ${badgeColor.split(' ')[0].replace('bg-', 'text-')} hover:bg-opacity-20`}
                      onClick={() => onViewAction(item.id)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Ver
                    </Button>
                  )}
                  {onCompleteAction && (
                    <Button 
                      size="sm" 
                      className={`bg-gradient-to-r ${gradient.split(' ').slice(1).join(' ')} hover:opacity-90 border-0`}
                      onClick={() => onCompleteAction(item.id)}
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Concluir
                    </Button>
                  )}
                </div>
              )}
              {item.completed && (
                <Badge className="bg-green-500/20 text-green-300 border-green-500/50">
                  ✓ Concluído
                </Badge>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
