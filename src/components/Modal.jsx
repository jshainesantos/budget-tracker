import React from "react";

export default function Modal({ isOpen, title, children, onClose, actions }) {
  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        {title && <h3 className="font-bold text-lg">{title}</h3>}
        <div className="py-2">{children}</div>
        {actions ? (
          <div className="modal-action">{actions}</div>
        ) : onClose ? (
          <div className="modal-action">
            <button className="btn" onClick={onClose}>
              Close
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
