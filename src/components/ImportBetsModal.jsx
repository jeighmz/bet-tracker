import React, { useState } from 'react';
import { useBets } from '../context/BetContext';

const ImportBetsModal = ({ isOpen, onClose }) => {
    const { addBet } = useBets();
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [preview, setPreview] = useState(null);
    const [importedCount, setImportedCount] = useState(0);

    if (!isOpen) return null;

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setError('');
            setPreview(null);
            
            // Preview first few lines
            const reader = new FileReader();
            reader.onload = (event) => {
                const text = event.target.result;
                const lines = text.split('\n').slice(0, 5);
                setPreview(lines);
            };
            reader.readAsText(selectedFile);
        }
    };

    const parseDraftKingsCSV = (csvText) => {
        const lines = csvText.split('\n').filter(line => line.trim());
        if (lines.length < 2) {
            throw new Error('CSV file appears to be empty or invalid');
        }

        // Try to detect headers
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        
        // Common DraftKings CSV formats
        // Format 1: Date, Bet Type, Description, Risk, To Win, Result, Net
        // Format 2: Wager Date, Bet Type, Description, Risk, To Win, Result, Net
        
        const bets = [];
        
        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim());
            if (values.length < 4) continue;

            try {
                // Try to find date column
                let dateIndex = headers.findIndex(h => h.includes('date') || h.includes('wager date'));
                let riskIndex = headers.findIndex(h => h.includes('risk') || h.includes('stake') || h.includes('wager'));
                let winIndex = headers.findIndex(h => h.includes('to win') || h.includes('payout') || h.includes('return'));
                let descIndex = headers.findIndex(h => h.includes('description') || h.includes('bet') || h.includes('game'));
                let resultIndex = headers.findIndex(h => h.includes('result') || h.includes('status'));
                let netIndex = headers.findIndex(h => h.includes('net') || h.includes('profit'));

                // Fallback to positional if headers not found
                if (dateIndex === -1) dateIndex = 0;
                if (riskIndex === -1) riskIndex = 3;
                if (winIndex === -1) winIndex = 4;
                if (descIndex === -1) descIndex = 2;
                if (resultIndex === -1) resultIndex = 5;
                if (netIndex === -1) netIndex = 6;

                const dateStr = values[dateIndex] || new Date().toISOString().split('T')[0];
                const stake = parseFloat(values[riskIndex]?.replace('$', '').replace(',', '')) || 0;
                const toWin = parseFloat(values[winIndex]?.replace('$', '').replace(',', '')) || 0;
                const description = values[descIndex] || 'DraftKings Bet';
                const result = values[resultIndex]?.toLowerCase() || '';
                const net = parseFloat(values[netIndex]?.replace('$', '').replace(',', '')) || null;

                // Parse date (handle various formats)
                let betDate;
                try {
                    betDate = new Date(dateStr);
                    if (isNaN(betDate.getTime())) {
                        // Try MM/DD/YYYY format
                        const parts = dateStr.split('/');
                        if (parts.length === 3) {
                            betDate = new Date(parts[2], parts[0] - 1, parts[1]);
                        } else {
                            betDate = new Date();
                        }
                    }
                } catch {
                    betDate = new Date();
                }

                // Calculate return amount
                let returnAmount = 0;
                if (net !== null) {
                    returnAmount = stake + net;
                } else if (result.includes('win') || result.includes('won')) {
                    returnAmount = stake + toWin;
                } else if (result.includes('loss') || result.includes('lost') || result.includes('lose')) {
                    returnAmount = 0;
                } else {
                    // If result is unknown, assume pending
                    continue; // Skip pending bets
                }

                const profit = returnAmount - stake;

                bets.push({
                    game: `DraftKings - ${description}`,
                    stake: stake,
                    returnAmount: returnAmount,
                    profit: profit,
                    date: betDate.toISOString().split('T')[0],
                    dateDisplay: betDate.toLocaleDateString(),
                    screenshot: null,
                    sportLeague: null,
                    cashedOut: result.includes('cash') || result.includes('cashed'),
                    live: false,
                    odds: null,
                    category: null
                });
            } catch (err) {
                console.warn(`Error parsing line ${i + 1}:`, err);
                continue;
            }
        }

        return bets;
    };

    const handleImport = async () => {
        if (!file) {
            setError('Please select a file');
            return;
        }

        setLoading(true);
        setError('');
        setImportedCount(0);

        try {
            const reader = new FileReader();
            reader.onload = async (event) => {
                try {
                    const csvText = event.target.result;
                    const bets = parseDraftKingsCSV(csvText);

                    if (bets.length === 0) {
                        setError('No valid bets found in the file. Please check the CSV format.');
                        setLoading(false);
                        return;
                    }

                    // Import bets one by one
                    let successCount = 0;
                    for (const bet of bets) {
                        try {
                            await addBet(bet);
                            successCount++;
                        } catch (err) {
                            console.error('Error importing bet:', err);
                        }
                    }

                    setImportedCount(successCount);
                    
                    if (successCount < bets.length) {
                        setError(`Imported ${successCount} of ${bets.length} bets. Some bets may have failed.`);
                    } else {
                        setTimeout(() => {
                            onClose();
                            setFile(null);
                            setPreview(null);
                            setImportedCount(0);
                        }, 2000);
                    }
                } catch (err) {
                    setError(err.message || 'Failed to parse CSV file');
                } finally {
                    setLoading(false);
                }
            };
            reader.onerror = () => {
                setError('Failed to read file');
                setLoading(false);
            };
            reader.readAsText(file);
        } catch (err) {
            setError(err.message || 'Failed to import bets');
            setLoading(false);
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
            <div className="card" style={{ width: '100%', maxWidth: '600px', margin: '1rem', maxHeight: '90vh', overflowY: 'auto' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
                    Import Bets from DraftKings
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

                {importedCount > 0 && (
                    <div style={{
                        padding: '0.75rem',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'rgba(34, 197, 94, 0.1)',
                        color: 'var(--success)',
                        marginBottom: '1rem',
                        fontSize: '0.875rem'
                    }}>
                        Successfully imported {importedCount} bet{importedCount !== 1 ? 's' : ''}!
                    </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                            Select CSV File
                        </label>
                        <input
                            type="file"
                            accept=".csv"
                            onChange={handleFileChange}
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
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                            Export your bet history from DraftKings and upload the CSV file here.
                        </p>
                    </div>

                    {preview && (
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                                File Preview (first 5 lines)
                            </label>
                            <div style={{
                                padding: '0.75rem',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--border)',
                                backgroundColor: 'var(--bg-dark)',
                                fontFamily: 'monospace',
                                fontSize: '0.75rem',
                                maxHeight: '150px',
                                overflowY: 'auto'
                            }}>
                                {preview.map((line, idx) => (
                                    <div key={idx} style={{ marginBottom: '0.25rem' }}>{line}</div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                flex: 1,
                                padding: '0.75rem',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--border)',
                                color: 'var(--text-muted)',
                                cursor: 'pointer'
                            }}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleImport}
                            className="btn btn-primary"
                            style={{ flex: 1 }}
                            disabled={loading || !file}
                        >
                            {loading ? 'Importing...' : 'Import Bets'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImportBetsModal;

