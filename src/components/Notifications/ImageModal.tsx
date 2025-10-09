import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "react-router-dom";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  alt?: string;
}

export const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  alt,
}) => {
  //   if (!isOpen) return null;

  const modalRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const pathname = location.pathname;
  //   const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
  //     // Only close if the backdrop itself is clicked
  //     if (e.target === e.currentTarget) {
  //       onClose();
  //     }
  //   };

  // Close modal on outside click
  const handleClickOutside = (e: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      e.stopPropagation(); // prevent drawer from catching click
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden"; // lock scroll
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className={`fixed inset-0 bg-black/50 flex items-center justify-center ${
        pathname.startsWith("/module/geo-ranking") ? "z-[500]" : "z-[55]"
      }`}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg p-2 max-w-[90%] max-h-[90%] overflow-auto"
        onClick={(e) => e.stopPropagation()} // prevent modal click from bubbling
      >
        <img src={imageUrl} alt={alt} className="max-w-full max-h-[80vh]" />
      </div>
    </div>,
    document.body
  );
};
