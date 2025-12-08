import React, { useState } from 'react';
import { useBets } from '../context/BetContext';
import BetCard from '../components/BetCard';
import AddBetModal from '../components/AddBetModal';

const History = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBet, setEditingBet] = useState(null);
    const { bets, addBet, updateBet } = useBets();

    const handleEdit = (bet) => {
        setEditingBet(bet);
        setIsModalOpen(true);
    };

    const handleClose = () => {
        setIsModalOpen(false);
        setEditingBet(null);
    };
    const [filter, setFilter] = useState('all'); // all, wins, losses
    const [sort, setSort] = useState('date'); // date, profit, stake

    const filteredBets = bets.filter(bet => {
        if (filter === 'wins') return bet.profit > 0;
        if (filter === 'losses') return bet.profit <= 0;
        return true;
    });

    const sortedBets = [...filteredBets].sort((a, b) => {
        if (sort === 'date') return new Date(b.date) - new Date(a.date);
        if (sort === 'profit') return b.profit - a.profit;
        if (sort === 'stake') return b.stake - a.stake;
        return 0;
    });

    return (
        <div>
            <header style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Bet History</h2>
                <p style={{ color: 'var(--text-muted)' }}>View and filter your complete betting history.</p>
            </header>

            {/* Filters & Sort */}
            <div style={{
                display: 'flex',
                gap: '1rem',
                marginBottom: '2rem',
                flexWrap: 'wrap',
                backgroundColor: 'var(--bg-card)',
                padding: '1rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Filter:</span>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        style={{
                            padding: '0.5rem',
                            borderRadius: 'var(--radius-md)',
                            backgroundColor: 'var(--bg-dark)',
                            color: 'var(--text-main)',
                            border: '1px solid var(--border)'
                        }}
                    >
                        <option value="all">All Bets</option>
                        <option value="wins">Wins Only</option>
                        <option value="losses">Losses Only</option>
                    </select>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Sort By:</span>
                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        style={{
                            padding: '0.5rem',
                            borderRadius: 'var(--radius-md)',
                            backgroundColor: 'var(--bg-dark)',
                            color: 'var(--text-main)',
                            border: '1px solid var(--border)'
                        }}
                    >
                        <option value="date">Date (Newest)</option>
                        <option value="profit">Highest Profit</option>
                        <option value="stake">Highest Stake</option>
                    </select>
                </div>
            </div>

            {/* Grid */}
            {sortedBets.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    No bets match your filters.
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {sortedBets.map(bet => (
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

export default History;
