import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Skeleton className="h-8 w-64 bg-gray-200 dark:bg-gray-700" />
          <Skeleton className="h-4 w-48 mt-2 bg-gray-200 dark:bg-gray-700" />
        </div>
        <div className="flex space-x-2">
          <Skeleton className="h-9 w-20 bg-gray-200 dark:bg-gray-700" />
          <Skeleton className="h-9 w-20 bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>

      <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 gap-4">
        <div className="w-full md:w-1/2">
          <Skeleton className="h-10 w-full bg-gray-200 dark:bg-gray-700" />
        </div>
        <div className="w-full md:w-1/2">
          <Skeleton className="h-10 w-full bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-36 bg-gray-200 dark:bg-gray-700" />
          <Skeleton className="h-4 w-24 mt-1 bg-gray-200 dark:bg-gray-700" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-12 w-4/12 bg-gray-200 dark:bg-gray-700" />
                <Skeleton className="h-12 w-2/12 bg-gray-200 dark:bg-gray-700" />
                <Skeleton className="h-12 w-2/12 bg-gray-200 dark:bg-gray-700" />
                <Skeleton className="h-12 w-2/12 bg-gray-200 dark:bg-gray-700" />
                <Skeleton className="h-12 w-1/12 bg-gray-200 dark:bg-gray-700" />
                <Skeleton className="h-12 w-1/12 bg-gray-200 dark:bg-gray-700" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
