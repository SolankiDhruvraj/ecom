import React from 'react';

const SuccessMessage = ({ message, onClose }) => {
    return (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded flex justify-between items-center">
            <span>{message}</span>
            {onClose && (
                <button
                    onClick={onClose}
                    className="text-green-700 hover:text-green-900 font-bold"
                >
                    ×
                </button>
            )}
        </div>
    );
};

export default SuccessMessage; 