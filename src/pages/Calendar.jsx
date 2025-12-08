import React, { useState } from 'react';
import { useBets } from '../context/BetContext';
import CompactBetCard from '../components/CompactBetCard';
import AddBetModal from '../components/AddBetModal';

const Calendar = () => {
    const { bets, addBet, updateBet } = useBets();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBet, setEditingBet] = useState(null);
    const [sortBy, setSortBy] = useState('profit'); // 'date', 'profit', 'stake'
    const [sortOrder, setSortOrder] = useState('desc'); // 'asc', 'desc'

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    // Calculate daily profits and bets
    const dailyData = {};
    bets.forEach(bet => {
        if (!bet.date) return;
        // Parse date string (YYYY-MM-DD) directly to avoid timezone issues
        const dateParts = bet.date.split('-');
        if (dateParts.length !== 3) return;
        const betYear = parseInt(dateParts[0], 10);
        const betMonth = parseInt(dateParts[1], 10) - 1; // Month is 0-indexed
        const betDay = parseInt(dateParts[2], 10);

        if (isNaN(betYear) || isNaN(betMonth) || isNaN(betDay)) return;

        if (betYear === year && betMonth === month) {
            if (!dailyData[betDay]) {
                dailyData[betDay] = { profit: 0, bets: [] };
            }
            dailyData[betDay].profit += bet.profit;
            dailyData[betDay].bets.push(bet);
        }
    });

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const goToPreviousMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
        setSelectedDate(null); // Clear selection when changing months
    };

    const goToNextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
        setSelectedDate(null); // Clear selection when changing months
    };

    const goToToday = () => {
        const today = new Date();
        setCurrentDate(today);
        // Select today if it's in the current view
        if (today.getFullYear() === year && today.getMonth() === month) {
            setSelectedDate(today.getDate());
        } else {
            setSelectedDate(null);
        }
    };

    const getProfitColor = (profit) => {
        if (profit > 0) return 'var(--success)';
        if (profit < 0) return 'var(--danger)';
        return 'var(--text-muted)';
    };

    const handleDayClick = (day) => {
        if (day) {
            setSelectedDate(selectedDate === day ? null : day); // Toggle selection
        }
    };

    const getSelectedDateString = () => {
        if (!selectedDate) return null;
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}`;
        return dateStr;
    };

    const selectedDateBets = selectedDate
        ? (dailyData[selectedDate]?.bets || []).sort((a, b) => {
            let comparison = 0;
            if (sortBy === 'date') {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                comparison = dateA - dateB;
            } else if (sortBy === 'profit') {
                comparison = a.profit - b.profit;
            } else if (sortBy === 'stake') {
                comparison = a.stake - b.stake;
            }
            return sortOrder === 'asc' ? comparison : -comparison;
        })
        : [];

    const handleSortToggle = () => {
        // If clicking the same sort, toggle order; otherwise change sort type
        const sortOptions = ['date', 'profit', 'stake'];
        const currentIndex = sortOptions.indexOf(sortBy);
        
        // If clicking on the same sort button, toggle order
        if (sortBy === sortOptions[currentIndex]) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            // Otherwise cycle to next sort option
            const nextIndex = (currentIndex + 1) % sortOptions.length;
            setSortBy(sortOptions[nextIndex]);
            setSortOrder('desc');
        }
    };

    const days = [];
    // Empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
        days.push(null);
    }
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        days.push(day);
    }

    const handleEdit = (bet) => {
        setEditingBet(bet);
        setIsModalOpen(true);
    };

    const handleClose = () => {
        setIsModalOpen(false);
        setEditingBet(null);
    };

    // Check if today is in current month view
    const today = new Date();
    const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
    const todayDay = isCurrentMonth ? today.getDate() : null;

    return (
        <div>
            <header style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Calendar</h2>
                <p style={{ color: 'var(--text-muted)' }}>View your bets by day. Click on a day to see details.</p>
            </header>

            {/* Calendar */}
            <div className="card" style={{ overflow: 'hidden', width: '100%', maxWidth: '100%', marginBottom: '2rem' }}>
                <div className="calendar-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0, lineHeight: '1.5', flexShrink: 0 }}>Daily Profit Calendar</h3>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexShrink: 0, flexWrap: 'nowrap' }}>
                        <button
                            onClick={goToToday}
                            style={{
                                padding: '0.5rem 0.75rem',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--border)',
                                backgroundColor: 'var(--bg-dark)',
                                color: 'var(--text-main)',
                                cursor: 'pointer',
                                fontSize: '0.875rem',
                                height: '44px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                whiteSpace: 'nowrap',
                                flexShrink: 0
                            }}
                        >
                            Today
                        </button>
                        <button
                            className="calendar-nav-button"
                            onClick={goToPreviousMonth}
                            style={{
                                padding: '0.5rem',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--border)',
                                backgroundColor: 'var(--bg-dark)',
                                color: 'var(--text-main)',
                                cursor: 'pointer',
                                width: '44px',
                                height: '44px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                            }}
                            aria-label="Previous month"
                        >
                            ←
                        </button>
                        <span style={{ minWidth: '120px', maxWidth: '160px', textAlign: 'center', fontWeight: '500', lineHeight: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9375rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flexShrink: 0 }}>
                            {monthNames[month]} {year}
                        </span>
                        <button
                            className="calendar-nav-button"
                            onClick={goToNextMonth}
                            style={{
                                padding: '0.5rem',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--border)',
                                backgroundColor: 'var(--bg-dark)',
                                color: 'var(--text-main)',
                                cursor: 'pointer',
                                width: '44px',
                                height: '44px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                            }}
                            aria-label="Next month"
                        >
                            →
                        </button>
                    </div>
                </div>

                <div className="calendar-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
                    gap: '0.5rem',
                    width: '100%',
                    maxWidth: '100%',
                    overflow: 'hidden',
                    boxSizing: 'border-box'
                }}>
                    {dayNames.map(day => (
                        <div key={day} className="calendar-day-header" style={{
                            textAlign: 'center',
                            padding: '0.5rem',
                            fontWeight: 'bold',
                            fontSize: '0.875rem',
                            color: 'var(--text-muted)',
                            minWidth: 0,
                            overflow: 'hidden'
                        }}>
                            {day}
                        </div>
                    ))}
                    {days.map((day, index) => {
                        const dayData = day ? dailyData[day] : null;
                        const isSelected = day === selectedDate;
                        const isToday = day === todayDay;
                        const hasBets = dayData && dayData.bets.length > 0;

                        return (
                            <div
                                key={index}
                                className="calendar-day"
                                onClick={() => handleDayClick(day)}
                                style={{
                                    aspectRatio: '1',
                                    minHeight: '0',
                                    padding: '0.375rem 0.25rem',
                                    borderRadius: 'var(--radius-sm)',
                                    backgroundColor: day
                                        ? (isSelected
                                            ? 'var(--primary)'
                                            : (hasBets
                                                ? 'var(--bg-dark)'
                                                : 'transparent'))
                                        : 'transparent',
                                    border: day
                                        ? (isSelected
                                            ? '2px solid var(--primary)'
                                            : (isToday
                                                ? '2px solid var(--accent)'
                                                : (hasBets
                                                    ? `2px solid ${getProfitColor(dayData.profit)}`
                                                    : '1px solid var(--border)')))
                                        : '1px solid transparent',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'flex-start',
                                    cursor: day ? 'pointer' : 'default',
                                    transition: 'all 0.2s',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    boxSizing: 'border-box',
                                    gap: '0.0625rem'
                                }}
                                title={day && dayData
                                    ? `${dayData.bets.length} bet${dayData.bets.length !== 1 ? 's' : ''} - Profit: $${dayData.profit.toFixed(2)}`
                                    : day
                                        ? 'No bets'
                                        : ''}
                            >
                                {day && (
                                    <>
                                        <span className="calendar-day-number" style={{
                                            fontSize: '0.8125rem',
                                            fontWeight: isToday ? 'bold' : '500',
                                            color: isSelected
                                                ? 'white'
                                                : (dayData
                                                    ? 'var(--text-main)'
                                                    : 'var(--text-muted)'),
                                            lineHeight: '1',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            maxWidth: '100%',
                                            flexShrink: 0,
                                            marginTop: '0.125rem'
                                        }}>
                                            {day}
                                        </span>
                                        {dayData && dayData.profit !== undefined && (
                                            <span className="calendar-day-profit" style={{
                                                fontSize: '0.5625rem',
                                                fontWeight: 'bold',
                                                color: isSelected
                                                    ? 'white'
                                                    : getProfitColor(dayData.profit),
                                                lineHeight: '1',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                maxWidth: '100%',
                                                flexShrink: 0
                                            }}>
                                                ${dayData.profit.toFixed(0)}
                                            </span>
                                        )}
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Selected Day Bets */}
            {selectedDate && (
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
                            {monthNames[month]} {selectedDate}, {year}
                            {dailyData[selectedDate] && (
                                <span style={{
                                    fontSize: '1rem',
                                    fontWeight: 'normal',
                                    color: 'var(--text-muted)',
                                    marginLeft: '0.5rem'
                                }}>
                                    - {dailyData[selectedDate].bets.length} bet{dailyData[selectedDate].bets.length !== 1 ? 's' : ''} • 
                                    <span style={{
                                        color: getProfitColor(dailyData[selectedDate].profit),
                                        marginLeft: '0.25rem'
                                    }}>
                                        ${dailyData[selectedDate].profit > 0 ? '+' : ''}{dailyData[selectedDate].profit.toFixed(2)} profit
                                    </span>
                                </span>
                            )}
                        </h3>
                        <button
                            onClick={handleSortToggle}
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--border)',
                                backgroundColor: sortBy !== 'profit' ? 'var(--primary)' : 'var(--bg-dark)',
                                color: sortBy !== 'profit' ? 'white' : 'var(--text-main)',
                                cursor: 'pointer',
                                fontSize: '0.875rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                            title={`Sort by: ${sortBy} (${sortOrder === 'asc' ? 'ascending' : 'descending'}) - Click to change`}
                        >
                            <span>Sort: {sortBy === 'date' ? 'Date' : sortBy === 'profit' ? 'Profit' : 'Stake'}</span>
                            <span style={{ fontSize: '0.75rem' }}>
                                {sortOrder === 'asc' ? '↑' : '↓'}
                            </span>
                        </button>
                    </div>

                    {selectedDateBets.length === 0 ? (
                        <div className="card" style={{ display: 'flex', justifyContent: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                            No bets recorded for this day.
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                            {selectedDateBets.map(bet => (
                                <CompactBetCard key={bet.id} bet={bet} onEdit={handleEdit} />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {!selectedDate && (
                <div className="card" style={{ display: 'flex', justifyContent: 'center', padding: '2rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                    <p>Click on a day to view bets for that date</p>
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

export default Calendar;

