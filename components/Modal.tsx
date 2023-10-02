'use client'
import { useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import { Icons } from './icons';

type ModalProps = {
  children: React.ReactNode;
  title?: string;
  size?: string;
  close?: () => void;
};

const Modal = ({ children, title, size = '', close }: ModalProps) => {
  const overlay = useRef<HTMLDivElement | null>(null);
  const wrapper = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const onDismiss = useCallback(() => {
    if (close) {
      close();
    } else {
      document.body.classList.remove('no-scroll-body');
      document.documentElement.style.overflow = 'auto';
      router.back();
    }
  }, [close, router]);

  const onClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (e.target === overlay.current || e.target === wrapper.current) {
        onDismiss();
      }
    },
    [onDismiss]
  );

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onDismiss();
      }
    },
    [onDismiss]
  );

  useEffect(() => {
    document.documentElement.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.documentElement.style.overflow = 'auto';
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [onKeyDown]);

  return (
    <div
      ref={overlay}
      className="fixed z-50 left-0 right-0 top-0 bottom-0 mx-auto bg-black/60 overlay"
      onClick={onClick}
    >
      <div
        ref={wrapper}
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 ${size} rounded`}
      >
        <div className="h-full w-full">
          <div className="h-[5%] flex items-center px-6 py-4 p-4">
            <strong className="text-center text-sm sm:text-base flex-grow text-black dark:text-white">
              {title}
            </strong>
            <button onClick={onDismiss} className="close-button text-black dark:text-white">
              <Icons.close />
            </button>
          </div>
          <div className='h-[95%] overflow-y-auto border-t border-gray-300 text-black dark:text-white'>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
