import React, { useState } from 'react';
import { useBets } from '../context/BetContext';
import WithdrawalRow from '../components/WithdrawalRow';
import AddWithdrawalModal from '../components/AddWithdrawalModal';

const CashedOut = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingWithdrawal, setEditingWithdrawal] = useState(null);
    const { withdrawals, addWithdrawal, updateWithdrawal } = useBets();

    const handleEdit = (withdrawal) => {
        setEditingWithdrawal(withdrawal);
        setIsModalOpen(true);
    };

    const handleClose = () => {
        setIsModalOpen(false);
        setEditingWithdrawal(null);
    };
    
    const [sort, setSort] = useState('date'); // date, amount

    const sortedWithdrawals = [...withdrawals].sort((a, b) => {
        if (sort === 'date') return new Date(b.date) - new Date(a.date);
        if (sort === 'amount') return b.amount - a.amount;
        return 0;
    });

    // Calculate stats for withdrawals
    const totalWithdrawn = withdrawals.reduce((acc, withdrawal) => acc + withdrawal.amount, 0);
    const totalWithdrawals = withdrawals.length;
    const averageWithdrawal = totalWithdrawals > 0 ? totalWithdrawn / totalWithdrawals : 0;

    return (
        <div>
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Cashed Out</h2>
                    <p style={{ color: 'var(--text-muted)' }}>View your withdrawal slips and platform withdrawals.</p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => {
                        setEditingWithdrawal(null);
                        setIsModalOpen(true);
                    }}
                >
                    + Add Withdrawal
                </button>
            </header>

            {/* Stats Summary */}
            {withdrawals.length > 0 && (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '1rem',
                    marginBottom: '2rem'
                }}>
                    <div style={{
                        padding: '1.25rem',
                        borderRadius: 'var(--radius-lg)',
                        backgroundColor: 'var(--bg-card)',
                        border: '1px solid var(--border)'
                    }}>
                        <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Withdrawn</p>
                        <p style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                            ${totalWithdrawn.toFixed(2)}
                        </p>
                    </div>
                    <div style={{
                        padding: '1.25rem',
                        borderRadius: 'var(--radius-lg)',
                        backgroundColor: 'var(--bg-card)',
                        border: '1px solid var(--border)'
                    }}>
                        <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Withdrawals</p>
                        <p style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--text-main)' }}>
                            {totalWithdrawals}
                        </p>
                    </div>
                    <div style={{
                        padding: '1.25rem',
                        borderRadius: 'var(--radius-lg)',
                        backgroundColor: 'var(--bg-card)',
                        border: '1px solid var(--border)'
                    }}>
                        <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Average</p>
                        <p style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--text-main)' }}>
                            ${averageWithdrawal.toFixed(2)}
                        </p>
                    </div>
                </div>
            )}

            {/* Sort Controls */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem',
                flexWrap: 'wrap',
                gap: '1rem'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Sort By:</span>
                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        style={{
                            padding: '0.5rem 0.75rem',
                            borderRadius: 'var(--radius-md)',
                            backgroundColor: 'var(--bg-dark)',
                            color: 'var(--text-main)',
                            border: '1px solid var(--border)',
                            fontSize: '0.875rem',
                            cursor: 'pointer'
                        }}
                    >
                        <option value="date">Date (Newest)</option>
                        <option value="amount">Highest Amount</option>
                    </select>
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    {sortedWithdrawals.length} {sortedWithdrawals.length === 1 ? 'withdrawal' : 'withdrawals'}
                </div>
            </div>

            {/* Withdrawals List */}
            {sortedWithdrawals.length === 0 ? (
                <div style={{
                    textAlign: 'center',
                    padding: '4rem 2rem',
                    color: 'var(--text-muted)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px dashed var(--border)',
                    backgroundColor: 'var(--bg-card)'
                }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>💸</div>
                    <p style={{ fontSize: '1rem', marginBottom: '0.5rem', fontWeight: '500' }}>No withdrawals recorded yet</p>
                    <p style={{ fontSize: '0.875rem' }}>Click "Add Withdrawal" to track your platform withdrawals.</p>
                </div>
            ) : (
                <div style={{
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--bg-card)',
                    overflow: 'hidden'
                }}>
                    {/* Table Header */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '80px 1fr 150px 120px 80px',
                        gap: '1rem',
                        padding: '1rem',
                        backgroundColor: 'var(--bg-dark)',
                        borderBottom: '1px solid var(--border)',
                        fontWeight: '600',
                        fontSize: '0.8125rem',
                        color: 'var(--text-muted)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                    }}>
                        <div>Image</div>
                        <div>Platform & Date</div>
                        <div style={{ textAlign: 'right' }}>Amount</div>
                        <div style={{ textAlign: 'right' }}>Actions</div>
                    </div>

                    {/* Withdrawals Rows */}
                    {sortedWithdrawals.map(withdrawal => (
                        <WithdrawalRow key={withdrawal.id} withdrawal={withdrawal} onEdit={handleEdit} />
                    ))}
                </div>
            )}

            <AddWithdrawalModal
                isOpen={isModalOpen}
                onClose={handleClose}
                onAddWithdrawal={addWithdrawal}
                onUpdateWithdrawal={updateWithdrawal}
                editingWithdrawal={editingWithdrawal}
            />
        </div>
    );
};

export default CashedOut;
