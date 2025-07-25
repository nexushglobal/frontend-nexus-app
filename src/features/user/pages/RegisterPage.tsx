'use client';
import { RegisterPageContent } from '../components/RegisterPageContent';

const RegisterPage = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const referrerCode = searchParams.get('referrerCode') || 'new';
  const positionParam = searchParams.get('position');
  const position =
    positionParam === 'LEFT' || positionParam === 'RIGHT'
      ? positionParam
      : null;
  return (
    <div className="flex flex-col">
      <main className="flex-1">
        <RegisterPageContent referrerCode={referrerCode} position={position} />
      </main>
    </div>
  );
};

export default RegisterPage;
