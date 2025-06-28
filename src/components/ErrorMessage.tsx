
import React from 'react';

interface ErrorMessageProps {
  message: string | null;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="my-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow" role="alert">
      <strong className="font-bold">エラー: </strong>
      <span className="block sm:inline">{message}</span>
    </div>
  );
};

export default ErrorMessage;
