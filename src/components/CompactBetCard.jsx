import React from 'react';
import { useBets } from '../context/BetContext';

const CompactBetCard = ({ bet, onEdit }) => {
  const { deleteBet } = useBets();
  const isWin = bet.profit > 0;

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this bet?')) {
      try {
        await deleteBet(bet.id);
      } catch (err) {
        alert('Failed to delete bet: ' + (err.message || 'Unknown error'));
      }
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(bet);
    }
  };

  return (
    <div className="card" style={{
      padding: '0.75rem',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      border: `1px solid ${isWin ? 'var(--success)' : 'var(--danger)'}`,
      borderWidth: '1px 0 0 3px'
    }}>
      {/* Action Buttons */}
      <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', display: 'flex', gap: '0.25rem', zIndex: 10 }}>
        {onEdit && (
          <button
            onClick={handleEdit}
            style={{
              background: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '0.625rem'
            }}
            title="Edit Bet"
          >
            ✎
          </button>
        )}
        <button
          onClick={handleDelete}
          style={{
            background: 'rgba(0, 0, 0, 0.5)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '20px',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '0.75rem'
          }}
          title="Delete Bet"
        >
          ×
        </button>
      </div>

      {/* Content */}
      <div style={{ paddingRight: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
          <div style={{ flex: 1 }}>
            <h4 style={{ fontWeight: 'bold', fontSize: '0.9375rem', marginBottom: '0.25rem' }}>{bet.game}</h4>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center', fontSize: '0.75rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>{bet.dateDisplay || bet.date}</span>
              {bet.sportLeague && (
                <span style={{
                  padding: '0.125rem 0.375rem',
                  borderRadius: '999px',
                  backgroundColor: 'rgba(99, 102, 241, 0.1)',
                  color: '#818cf8',
                  fontSize: '0.6875rem'
                }}>
                  {bet.sportLeague}
                </span>
              )}
              {bet.cashedOut && (
                <span style={{
                  padding: '0.125rem 0.375rem',
                  borderRadius: '999px',
                  backgroundColor: 'rgba(251, 191, 36, 0.1)',
                  color: '#fbbf24',
                  fontSize: '0.6875rem'
                }}>
                  CASHED OUT
                </span>
              )}
              {bet.live && (
                <span style={{
                  padding: '0.125rem 0.375rem',
                  borderRadius: '999px',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  color: '#ef4444',
                  fontSize: '0.6875rem'
                }}>
                  LIVE
                </span>
              )}
            </div>
          </div>
          <span style={{
            padding: '0.125rem 0.5rem',
            borderRadius: '999px',
            fontSize: '0.6875rem',
            fontWeight: 'bold',
            backgroundColor: isWin ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            color: isWin ? 'var(--success)' : 'var(--danger)',
            flexShrink: 0
          }}>
            {isWin ? 'WIN' : 'LOSS'}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginTop: '0.5rem', fontSize: '0.8125rem' }}>
          <div>
            <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginBottom: '0.125rem' }}>Stake</p>
            <p style={{ fontWeight: '500' }}>${bet.stake}</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginBottom: '0.125rem' }}>Return</p>
            <p style={{ fontWeight: 'bold', color: isWin ? 'var(--success)' : 'var(--text-main)' }}>
              ${bet.returnAmount}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginBottom: '0.125rem' }}>Profit</p>
            <p style={{ fontWeight: 'bold', color: isWin ? 'var(--success)' : 'var(--danger)' }}>
              ${bet.profit > 0 ? '+' : ''}{bet.profit.toFixed(2)}
            </p>
          </div>
        </div>
        {(bet.odds || bet.category) && (
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem', fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
            {bet.odds && (
              <span>Odds: {bet.odds > 0 ? '+' : ''}{bet.odds}</span>
            )}
            {bet.category && (
              <span>Category: {bet.category}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompactBetCard;


