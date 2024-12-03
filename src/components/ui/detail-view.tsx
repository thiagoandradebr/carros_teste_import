import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  type: "update" | "create" | "delete" | "info";
}

interface DetailSection {
  title: string;
  content: React.ReactNode;
}

interface DetailViewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  status?: {
    label: string;
    color: string;
  };
  sections: DetailSection[];
  timeline?: TimelineEvent[];
}

const timelineColors = {
  update: "bg-blue-500",
  create: "bg-green-500",
  delete: "bg-red-500",
  info: "bg-gray-500",
} as const;

export function DetailView({
  open,
  onOpenChange,
  title,
  description,
  status,
  sections,
  timeline,
}: DetailViewProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <DialogTitle>{title}</DialogTitle>
            {status && (
              <Badge className={status.color}>{status.label}</Badge>
            )}
          </div>
          {description && (
            <DialogDescription>{description}</DialogDescription>
          )}
        </DialogHeader>

        <Tabs defaultValue="details" className="h-full">
          <TabsList>
            <TabsTrigger value="details">Detalhes</TabsTrigger>
            {timeline && timeline.length > 0 && (
              <TabsTrigger value="timeline">Histórico</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="details" className="h-[calc(100%-2.5rem)]">
            <ScrollArea className="h-full pr-4">
              <div className="space-y-6">
                {sections.map((section, index) => (
                  <section key={index} className="space-y-3">
                    <h3 className="text-lg font-semibold">{section.title}</h3>
                    <div className="pl-4 border-l-2 border-gray-100">
                      {section.content}
                    </div>
                  </section>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          {timeline && timeline.length > 0 && (
            <TabsContent value="timeline" className="h-[calc(100%-2.5rem)]">
              <ScrollArea className="h-full pr-4">
                <div className="space-y-4">
                  {timeline.map((event) => (
                    <div
                      key={event.id}
                      className="relative pl-6 pb-4 border-l-2 border-gray-100 last:pb-0"
                    >
                      <div
                        className={cn(
                          "absolute left-[-5px] w-2 h-2 rounded-full",
                          timelineColors[event.type]
                        )}
                      />
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium">{event.title}</h4>
                          <time className="text-sm text-gray-500">
                            {format(new Date(event.date), "PPp", {
                              locale: ptBR,
                            })}
                          </time>
                        </div>
                        <p className="text-sm text-gray-600">
                          {event.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          )}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
