import React, { useState } from 'react';
import { useBets } from '../context/BetContext';
import BetCard from './BetCard';
import AddBetModal from './AddBetModal';

const Dashboard = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBet, setEditingBet] = useState(null);
    const { bets, addBet, updateBet, stats } = useBets();

    const handleEdit = (bet) => {
        setEditingBet(bet);
        setIsModalOpen(true);
    };

    const handleClose = () => {
        setIsModalOpen(false);
        setEditingBet(null);
    };

    // Show only recent 6 bets on dashboard
    const recentBets = bets.slice(0, 6);

    return (
        <div>
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Overview</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Track your latest wins and performance.</p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => {
                        setEditingBet(null);
                        setIsModalOpen(true);
                    }}
                >
                    + Add New Bet
                </button>
            </header>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                <div className="card">
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Total Profit</p>
                    <p style={{
                        fontSize: '2rem',
                        fontWeight: 'bold',
                        color: stats.totalProfit >= 0 ? 'var(--success)' : 'var(--danger)'
                    }}>
                        ${stats.totalProfit.toLocaleString()}
                    </p>
                </div>
                <div className="card">
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Win Rate</p>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{stats.winRate}%</p>
                </div>
                <div className="card">
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Best Win</p>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--success)' }}>${stats.bestWin.toLocaleString()}</p>
                </div>
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Recent Activity</h3>

            {/* Bet List */}
            {recentBets.length === 0 ? (
                <div className="card" style={{ display: 'flex', justifyContent: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    No bets recorded yet. Start tracking your wins!
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {recentBets.map(bet => (
                        <BetCard key={bet.id} bet={bet} onEdit={handleEdit} />
                    ))}
                </div>
            )}

            <AddBetModal
                isOpen={isModalOpen}
                onClose={handleClose}
                onAddBet={addBet}
                onUpdateBet={updateBet}
                editingBet={editingBet}
            />
        </div>
    );
};

export default Dashboard;
