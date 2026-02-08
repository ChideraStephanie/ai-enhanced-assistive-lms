
import React from 'react';

interface AvatarProps {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ src, name, size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-[10px]',
    md: 'w-10 h-10 text-[12px]',
    lg: 'w-16 h-16 text-[18px]',
    xl: 'w-32 h-32 text-[32px]'
  };

  if (src && (src.startsWith('data:image') || src.startsWith('blob:'))) {
    return (
      <img
        src={src}
        alt={name}
        className={`${sizeClasses[size]} rounded-full object-cover border-2 border-white shadow-sm ${className}`}
      />
    );
  }

  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  // Generate a consistent color based on name
  const colors = ['bg-indigo-600', 'bg-emerald-600', 'bg-rose-600', 'bg-amber-600', 'bg-cyan-600', 'bg-violet-600'];
  const colorIndex = name.length % colors.length;
  const bgColor = colors[colorIndex];

  return (
    <div className={`${sizeClasses[size]} ${bgColor} rounded-full flex items-center justify-center text-white font-black tracking-tighter border-2 border-white shadow-sm ${className}`}>
      {initials || '?'}
    </div>
  );
};

export default Avatar;
