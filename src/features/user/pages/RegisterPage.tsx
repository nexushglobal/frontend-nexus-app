'use client';
import { useParams, useSearchParams } from 'next/navigation';
import { RegisterPageContent } from '../components/RegisterPageContent';

const RegisterPage = () => {
  const params = useParams<{ referrerCode: string }>();
  const searchParams = useSearchParams();
  const position =
    (searchParams.get('position') as 'LEFT' | 'RIGHT' | null) || null;
  return (
    <div className="flex flex-col">
      <main className="flex-1">
        <RegisterPageContent
          referrerCode={params.referrerCode}
          position={position}
        />
      </main>
    </div>
  );
};

export default RegisterPage;
