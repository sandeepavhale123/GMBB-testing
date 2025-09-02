// import React from "react";

// interface ImageModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   imageUrl: string;
//   alt?: string;
// }

// export const ImageModal: React.FC<ImageModalProps> = ({
//   isOpen,
//   onClose,
//   imageUrl,
//   alt,
// }) => {
//   if (!isOpen) return null;

//   const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
//     // Close only if the backdrop itself is clicked, not the image
//     if (e.target === e.currentTarget) {
//       onClose();
//     }
//   };

//   return (
//     <div
//       className="fixed inset-0 bg-black/70 z-[1000] flex  justify-center p-6"
//       onClick={handleBackdropClick}
//     >
//       <img
//         src={imageUrl}
//         alt={alt}
//         className="max-w-full max-h-full rounded-lg shadow-lg object-contain"
//       />
//     </div>
//   );
// };

import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
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
