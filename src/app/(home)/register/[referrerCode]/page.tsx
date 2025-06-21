import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { RegisterPageContent } from "./RegisterPageContent";

interface RegisterPageProps {
  params: Promise<{ referrerCode: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

function RegisterPageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8 space-y-4">
          <Skeleton className="h-12 w-80 mx-auto" />
          <Skeleton className="h-6 w-96 mx-auto" />
          <Skeleton className="h-8 w-48 mx-auto" />
        </div>

        <div className="max-w-2xl mx-auto">
          <Skeleton className="h-24 w-full mb-6" />
          <div className="bg-card border rounded-lg p-6 space-y-6">
            <Skeleton className="h-8 w-64 mx-auto" />
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function RegisterPage({
  params,
  searchParams
}: RegisterPageProps) {
  const { referrerCode } = await params;
  const searchParamsResolved = await searchParams;

  const lado = searchParamsResolved.lado as string;
  const position = lado === "izquierda" ? "LEFT" : lado === "derecha" ? "RIGHT" : null;

  return (
    <div className="flex flex-col">
      <main className="flex-1">
        <Suspense fallback={<RegisterPageSkeleton />}>
          <RegisterPageContent
            referrerCode={referrerCode}
            position={position}
          />
        </Suspense>
      </main>


    </div>
  );
}