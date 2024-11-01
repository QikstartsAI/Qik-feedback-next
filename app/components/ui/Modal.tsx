import React, { ReactNode } from 'react'
import { Cross1Icon } from '@radix-ui/react-icons'

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  const modalContainerClasses = isOpen
    ? 'fixed inset-0 flex items-center justify-center overflow-auto z-50'
    : 'hidden'
  const overlayClasses = isOpen ? 'fixed inset-0 bg-black opacity-50' : 'hidden'

  return (
    <div className={modalContainerClasses}>
      <div className={overlayClasses} onClick={onClose} />
      <div className='bg-white shadow-lg rounded-md   px-3 py-4
      mx-10 relative max-w-2xl'>
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
          onClick={onClose}
        >
          <Cross1Icon />
        </button>
        {children}
      </div>
    </div>
  )
}

export default Modal
