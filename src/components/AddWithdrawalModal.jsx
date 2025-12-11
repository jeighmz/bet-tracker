import React, { useState } from 'react';

const AddWithdrawalModal = ({ isOpen, onClose, onAddWithdrawal, onUpdateWithdrawal, editingWithdrawal }) => {
    const [formData, setFormData] = useState({
        platform: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        screenshot: null
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Update form when editingWithdrawal changes
    React.useEffect(() => {
        if (editingWithdrawal) {
            const withdrawalDate = editingWithdrawal.date || new Date().toISOString().split('T')[0];
            setFormData({
                platform: editingWithdrawal.platform || '',
                amount: editingWithdrawal.amount || '',
                date: withdrawalDate.includes('T') ? withdrawalDate.split('T')[0] : withdrawalDate,
                screenshot: editingWithdrawal.screenshot || null
            });
        } else {
            // Reset form for new withdrawal
            setFormData({
                platform: '',
                amount: '',
                date: new Date().toISOString().split('T')[0],
                screenshot: null
            });
        }
    }, [editingWithdrawal, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Create withdrawal object
            const withdrawalDate = new Date(formData.date);
            const withdrawalData = {
                id: editingWithdrawal ? editingWithdrawal.id : Date.now(),
                platform: formData.platform,
                amount: parseFloat(formData.amount),
                date: withdrawalDate.toISOString().split('T')[0],
                dateDisplay: withdrawalDate.toLocaleDateString(),
                screenshot: formData.screenshot
            };

            if (editingWithdrawal) {
                await onUpdateWithdrawal(withdrawalData);
            } else {
                await onAddWithdrawal(withdrawalData);
            }
            onClose();
        } catch (err) {
            setError(err.message || 'Failed to save withdrawal');
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, screenshot: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(4px)'
        }}>
            <div className="card" style={{ width: '100%', maxWidth: '500px', margin: '1rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
                    {editingWithdrawal ? 'Edit Withdrawal' : 'Add New Withdrawal'}
                </h2>

                {error && (
                    <div style={{
                        padding: '0.75rem',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        color: 'var(--danger)',
                        marginBottom: '1rem',
                        fontSize: '0.875rem'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Platform</label>
                        <input
                            type="text"
                            required
                            value={formData.platform}
                            onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--border)',
                                backgroundColor: 'var(--bg-dark)',
                                color: 'var(--text-main)',
                                outline: 'none'
                            }}
                            placeholder="e.g. Stake.com, DraftKings, FanDuel"
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Amount ($)</label>
                            <input
                                type="number"
                                required
                                min="0"
                                step="0.01"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--border)',
                                    backgroundColor: 'var(--bg-dark)',
                                    color: 'var(--text-main)',
                                    outline: 'none'
                                }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Date</label>
                            <input
                                type="date"
                                required
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--border)',
                                    backgroundColor: 'var(--bg-dark)',
                                    color: 'var(--text-main)',
                                    outline: 'none',
                                    colorScheme: 'dark'
                                }}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Withdrawal Slip Screenshot</label>
                        <div style={{
                            border: '2px dashed var(--border)',
                            borderRadius: 'var(--radius-md)',
                            padding: '1.5rem',
                            textAlign: 'center',
                            cursor: 'pointer',
                            backgroundColor: 'var(--bg-dark)'
                        }}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                style={{ display: 'none' }}
                                id="withdrawal-screenshot-upload"
                            />
                            <label htmlFor="withdrawal-screenshot-upload" style={{ cursor: 'pointer', color: 'var(--primary)' }}>
                                {formData.screenshot ? 'Change Image' : 'Click to Upload Withdrawal Slip'}
                            </label>
                            {formData.screenshot && (
                                <div style={{ marginTop: '1rem' }}>
                                    <img src={formData.screenshot} alt="Preview" style={{ maxHeight: '100px', borderRadius: 'var(--radius-sm)' }} />
                                </div>
                            )}
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                flex: 1,
                                padding: '0.75rem',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--border)',
                                color: 'var(--text-muted)'
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ flex: 1 }}
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : (editingWithdrawal ? 'Update Withdrawal' : 'Add Withdrawal')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddWithdrawalModal;

