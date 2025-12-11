import React, { useState } from 'react';
import { useBets } from '../context/BetContext';

const WithdrawalRow = ({ withdrawal, onEdit }) => {
  const { deleteWithdrawal } = useBets();
  const [showImageModal, setShowImageModal] = useState(false);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this withdrawal?')) {
      try {
        await deleteWithdrawal(withdrawal.id);
      } catch (err) {
        alert('Failed to delete withdrawal: ' + (err.message || 'Unknown error'));
      }
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(withdrawal);
    }
  };

  return (
    <>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '80px 1fr 150px 120px 80px',
        gap: '1rem',
        alignItems: 'center',
        padding: '1rem',
        borderBottom: '1px solid var(--border)',
        transition: 'background-color 0.2s',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)'}
      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
      >
        {/* Thumbnail */}
        <div 
          style={{ 
            width: '60px', 
            height: '60px', 
            borderRadius: 'var(--radius-md)',
            backgroundColor: '#0f172a',
            backgroundImage: withdrawal.screenshot ? `url(${withdrawal.screenshot})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            border: '1px solid var(--border)',
            cursor: withdrawal.screenshot ? 'pointer' : 'default',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onClick={() => withdrawal.screenshot && setShowImageModal(true)}
        >
          {!withdrawal.screenshot && (
            <span style={{ color: 'var(--text-muted)', fontSize: '0.625rem' }}>No Image</span>
          )}
        </div>

        {/* Platform & Date */}
        <div>
          <div style={{ fontWeight: '600', fontSize: '0.9375rem', marginBottom: '0.25rem', color: 'var(--text-main)' }}>
            {withdrawal.platform || 'Withdrawal'}
          </div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            {withdrawal.dateDisplay || withdrawal.date}
          </div>
        </div>

        {/* Amount */}
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontWeight: 'bold', fontSize: '1.125rem', color: 'var(--primary)' }}>
            ${withdrawal.amount?.toFixed(2)}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
          <button
            onClick={handleEdit}
            style={{
              padding: '0.5rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              backgroundColor: 'var(--bg-dark)',
              color: 'var(--text-main)',
              cursor: 'pointer',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '36px',
              height: '36px'
            }}
            title="Edit"
          >
            ✎
          </button>
          <button
            onClick={handleDelete}
            style={{
              padding: '0.5rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              backgroundColor: 'var(--bg-dark)',
              color: 'var(--danger)',
              cursor: 'pointer',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '36px',
              height: '36px'
            }}
            title="Delete"
          >
            ×
          </button>
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && withdrawal.screenshot && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            padding: '2rem',
            cursor: 'pointer'
          }}
          onClick={() => setShowImageModal(false)}
        >
          <div style={{ position: 'relative', maxWidth: '90%', maxHeight: '90%' }}>
            <img
              src={withdrawal.screenshot}
              alt="Withdrawal Slip"
              style={{
                maxWidth: '100%',
                maxHeight: '90vh',
                borderRadius: 'var(--radius-lg)',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
              }}
            />
            <button
              onClick={() => setShowImageModal(false)}
              style={{
                position: 'absolute',
                top: '-2rem',
                right: '-2rem',
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default WithdrawalRow;

