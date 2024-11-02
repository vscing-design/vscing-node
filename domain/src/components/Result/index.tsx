// src/components/Result.tsx
import * as React from 'react';

interface ResultProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  extra?: React.ReactNode;
}

const Result: React.FC<ResultProps> = ({ title, description, icon, extra }) => {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="max-w-md text-center">
        {icon && <div className="mb-4">{icon}</div>}
        <h1 className="mb-2 text-2xl font-bold">{title}</h1>
        {description && <p className="mb-4 text-gray-600">{description}</p>}
        {extra && <div className="flex justify-center">{extra}</div>}
      </div>
    </div>
  );
};

export default Result;