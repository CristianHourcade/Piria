import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function NotificacionesLoading() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-10 w-40" />
      </div>

      <Tabs defaultValue="todas">
        <TabsList className="bg-gray-100 dark:bg-gray-800">
          <TabsTrigger value="todas" disabled>
            Todas
          </TabsTrigger>
          <TabsTrigger value="no-leidas" disabled>
            No leídas
          </TabsTrigger>
          <TabsTrigger value="leidas" disabled>
            Leídas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="todas" className="mt-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>
                <Skeleton className="h-6 w-32" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="p-4 rounded-lg border">
                    <div className="flex items-start">
                      <Skeleton className="h-10 w-10 rounded-full mr-4" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <Skeleton className="h-5 w-40 mb-2" />
                          <div className="flex items-center space-x-2">
                            <Skeleton className="h-5 w-16" />
                            <Skeleton className="h-8 w-8 rounded-full" />
                          </div>
                        </div>
                        <Skeleton className="h-4 w-full mb-1" />
                        <Skeleton className="h-4 w-3/4 mb-2" />
                        <div className="flex items-center justify-between mt-2">
                          <Skeleton className="h-3 w-24" />
                          <Skeleton className="h-3 w-20" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
