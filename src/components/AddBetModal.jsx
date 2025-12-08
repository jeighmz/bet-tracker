import React, { useState } from 'react';

const AddBetModal = ({ isOpen, onClose, onAddBet, onUpdateBet, editingBet }) => {
    const [formData, setFormData] = useState({
        game: '',
        stake: '',
        returnAmount: '',
        date: new Date().toISOString().split('T')[0],
        screenshot: null,
        sportLeague: '',
        cashedOut: false,
        live: false,
        odds: '',
        category: ''
    });

    // Update form when editingBet changes
    React.useEffect(() => {
        if (editingBet) {
            const betDate = editingBet.date || new Date().toISOString().split('T')[0];
            setFormData({
                game: editingBet.game || '',
                stake: editingBet.stake || '',
                returnAmount: editingBet.returnAmount || '',
                date: betDate.includes('T') ? betDate.split('T')[0] : betDate,
                screenshot: editingBet.screenshot || null,
                sportLeague: editingBet.sportLeague || '',
                cashedOut: editingBet.cashedOut || false,
                live: editingBet.live || false,
                odds: editingBet.odds || '',
                category: editingBet.category || ''
            });
        } else {
            // Reset form for new bet
            setFormData({
                game: '',
                stake: '',
                returnAmount: '',
                date: new Date().toISOString().split('T')[0],
                screenshot: null,
                sportLeague: '',
                cashedOut: false,
                live: false,
                odds: '',
                category: ''
            });
        }
    }, [editingBet, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        const profit = parseFloat(formData.returnAmount) - parseFloat(formData.stake);

        // Create bet object
        const betDate = new Date(formData.date);
        const betData = {
            id: editingBet ? editingBet.id : Date.now(),
            game: formData.game,
            stake: parseFloat(formData.stake),
            returnAmount: parseFloat(formData.returnAmount),
            profit: profit,
            date: betDate.toISOString().split('T')[0], // Store as ISO date string for easier parsing
            dateDisplay: betDate.toLocaleDateString(), // Format date for display
            screenshot: formData.screenshot, // In a real app, this would be a URL from a storage bucket
            sportLeague: formData.sportLeague || null,
            cashedOut: formData.cashedOut,
            live: formData.live,
            odds: formData.odds ? parseFloat(formData.odds) : null,
            category: formData.category || null
        };

        if (editingBet) {
            onUpdateBet(betData);
        } else {
            onAddBet(betData);
        }
        onClose();
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
                    {editingBet ? 'Edit Bet' : 'Add New Bet'}
                </h2>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Game / Casino</label>
                        <input
                            type="text"
                            required
                            value={formData.game}
                            onChange={(e) => setFormData({ ...formData, game: e.target.value })}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--border)',
                                backgroundColor: 'var(--bg-dark)',
                                color: 'var(--text-main)',
                                outline: 'none'
                            }}
                            placeholder="e.g. Blackjack, Stake.com"
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Stake ($)</label>
                            <input
                                type="number"
                                required
                                min="0"
                                step="0.01"
                                value={formData.stake}
                                onChange={(e) => setFormData({ ...formData, stake: e.target.value })}
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
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Return ($)</label>
                            <input
                                type="number"
                                required
                                min="0"
                                step="0.01"
                                value={formData.returnAmount}
                                onChange={(e) => setFormData({ ...formData, returnAmount: e.target.value })}
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
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Sport League (Optional)</label>
                            <input
                                type="text"
                                value={formData.sportLeague}
                                onChange={(e) => setFormData({ ...formData, sportLeague: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--border)',
                                    backgroundColor: 'var(--bg-dark)',
                                    color: 'var(--text-main)',
                                    outline: 'none'
                                }}
                                placeholder="e.g. NFL, NBA, Premier League"
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Odds (Optional)</label>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.odds}
                                onChange={(e) => setFormData({ ...formData, odds: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--border)',
                                    backgroundColor: 'var(--bg-dark)',
                                    color: 'var(--text-main)',
                                    outline: 'none'
                                }}
                                placeholder="e.g. 2.50, -150"
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Category (Optional)</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--border)',
                                    backgroundColor: 'var(--bg-dark)',
                                    color: 'var(--text-main)',
                                    outline: 'none'
                                }}
                            >
                                <option value="">Select Category</option>
                                <option value="Moneyline">Moneyline</option>
                                <option value="Props">Props</option>
                                <option value="Spread">Spread</option>
                                <option value="Over/Under">Over/Under</option>
                                <option value="Parlay">Parlay</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={formData.cashedOut}
                                onChange={(e) => setFormData({ ...formData, cashedOut: e.target.checked })}
                                style={{
                                    width: '18px',
                                    height: '18px',
                                    cursor: 'pointer'
                                }}
                            />
                            <span style={{ fontSize: '0.875rem' }}>Cashed Out</span>
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={formData.live}
                                onChange={(e) => setFormData({ ...formData, live: e.target.checked })}
                                style={{
                                    width: '18px',
                                    height: '18px',
                                    cursor: 'pointer'
                                }}
                            />
                            <span style={{ fontSize: '0.875rem' }}>Live</span>
                        </label>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Screenshot</label>
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
                                id="screenshot-upload"
                            />
                            <label htmlFor="screenshot-upload" style={{ cursor: 'pointer', color: 'var(--primary)' }}>
                                {formData.screenshot ? 'Change Image' : 'Click to Upload Screenshot'}
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
                        >
                            {editingBet ? 'Update Bet' : 'Add Bet'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddBetModal;
