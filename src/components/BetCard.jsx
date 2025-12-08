import React from 'react';
import { useBets } from '../context/BetContext';

const BetCard = ({ bet, onEdit }) => {
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
    <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* Action Buttons */}
      <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', display: 'flex', gap: '0.5rem', zIndex: 10 }}>
        {onEdit && (
          <button 
            onClick={handleEdit}
            style={{
              background: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '0.75rem'
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
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
          title="Delete Bet"
        >
          ×
        </button>
      </div>

      {/* Screenshot Area */}
      <div style={{ 
        height: '136px', 
        backgroundColor: '#0f172a', 
        backgroundImage: bet.screenshot ? `url(${bet.screenshot})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'top center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottom: '1px solid var(--border)'
      }}>
        {!bet.screenshot && (
          <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No Screenshot</span>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
          <div style={{ flex: 1 }}>
            <h4 style={{ fontWeight: 'bold', fontSize: '1.125rem', marginBottom: '0.25rem' }}>{bet.game}</h4>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{bet.dateDisplay || bet.date}</span>
              {bet.sportLeague && (
                <span style={{ 
                  fontSize: '0.75rem', 
                  padding: '0.125rem 0.5rem',
                  borderRadius: '999px',
                  backgroundColor: 'rgba(99, 102, 241, 0.1)',
                  color: '#818cf8'
                }}>
                  {bet.sportLeague}
                </span>
              )}
              {bet.cashedOut && (
                <span style={{ 
                  fontSize: '0.75rem', 
                  padding: '0.125rem 0.5rem',
                  borderRadius: '999px',
                  backgroundColor: 'rgba(251, 191, 36, 0.1)',
                  color: '#fbbf24'
                }}>
                  CASHED OUT
                </span>
              )}
              {bet.live && (
                <span style={{ 
                  fontSize: '0.75rem', 
                  padding: '0.125rem 0.5rem',
                  borderRadius: '999px',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  color: '#ef4444'
                }}>
                  LIVE
                </span>
              )}
              {bet.category && (
                <span style={{ 
                  fontSize: '0.75rem', 
                  padding: '0.125rem 0.5rem',
                  borderRadius: '999px',
                  backgroundColor: 'rgba(139, 92, 246, 0.1)',
                  color: '#a78bfa'
                }}>
                  {bet.category}
                </span>
              )}
            </div>
          </div>
          <span style={{ 
            padding: '0.25rem 0.5rem', 
            borderRadius: '999px', 
            fontSize: '0.75rem', 
            fontWeight: 'bold',
            backgroundColor: isWin ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            color: isWin ? 'var(--success)' : 'var(--danger)',
            flexShrink: 0
          }}>
            {isWin ? 'WIN' : 'LOSS'}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '1rem' }}>
          <div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Stake</p>
            <p style={{ fontWeight: '500' }}>${bet.stake}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Return</p>
            <p style={{ fontWeight: 'bold', color: isWin ? 'var(--success)' : 'var(--text-main)' }}>
              ${bet.returnAmount}
            </p>
          </div>
        </div>
        {(bet.odds || bet.category) && (
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {bet.odds && (
              <span>Odds: {bet.odds > 0 ? '+' : ''}{bet.odds}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BetCard;
