import { Suspense } from "react";
import { ProfilePageContent } from "./components/ProfilePageContent";
import { ProfilePageSkeleton } from "./components/ProfilePageSkeleton";

export default function ProfilePage() {
    return (
        <Suspense fallback={<ProfilePageSkeleton />}>
            <ProfilePageContent />
        </Suspense>
    );
}