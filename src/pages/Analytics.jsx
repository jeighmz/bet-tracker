import React, { useState } from 'react';
import { useBets } from '../context/BetContext';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, BarChart, Bar, Legend, ScatterChart, Scatter, ZAxis
} from 'recharts';

const CalendarView = ({ bets }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    // Calculate daily profits
    const dailyProfits = {};
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
            if (!dailyProfits[betDay]) {
                dailyProfits[betDay] = 0;
            }
            dailyProfits[betDay] += bet.profit;
        }
    });
    
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                       'July', 'August', 'September', 'October', 'November', 'December'];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    const goToPreviousMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };
    
    const goToNextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };
    
    const getProfitColor = (profit) => {
        if (profit > 0) return 'var(--success)';
        if (profit < 0) return 'var(--danger)';
        return 'var(--text-muted)';
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
    
    return (
        <div className="card" style={{ overflow: 'hidden', width: '100%', maxWidth: '100%' }}>
            <div className="calendar-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Daily Profit Calendar</h3>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <button
                        className="calendar-nav-button"
                        onClick={goToPreviousMonth}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--border)',
                            backgroundColor: 'var(--bg-dark)',
                            color: 'var(--text-main)',
                            cursor: 'pointer'
                        }}
                    >
                        ←
                    </button>
                    <span style={{ minWidth: '200px', textAlign: 'center', fontWeight: '500' }}>
                        {monthNames[month]} {year}
                    </span>
                    <button
                        className="calendar-nav-button"
                        onClick={goToNextMonth}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--border)',
                            backgroundColor: 'var(--bg-dark)',
                            color: 'var(--text-main)',
                            cursor: 'pointer'
                        }}
                    >
                        →
                    </button>
                </div>
            </div>
            
            <div className="calendar-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: '0.5rem', width: '100%', maxWidth: '100%', overflow: 'hidden', boxSizing: 'border-box' }}>
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
                {days.map((day, index) => (
                    <div
                        key={index}
                        className="calendar-day"
                        style={{
                            aspectRatio: '1',
                            padding: '0.5rem',
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: day ? (dailyProfits[day] ? 'var(--bg-dark)' : 'transparent') : 'transparent',
                            border: day && dailyProfits[day] ? `2px solid ${getProfitColor(dailyProfits[day])}` : '1px solid transparent',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: day ? 'pointer' : 'default'
                        }}
                        title={day && dailyProfits[day] ? `Profit: $${dailyProfits[day].toFixed(2)}` : ''}
                    >
                        {day && (
                            <>
                                <span className="calendar-day-number" style={{ 
                                    fontSize: '0.875rem', 
                                    fontWeight: '500',
                                    color: dailyProfits[day] ? 'var(--text-main)' : 'var(--text-muted)'
                                }}>
                                    {day}
                                </span>
                                {dailyProfits[day] !== undefined && (
                                    <span className="calendar-day-profit" style={{ 
                                        fontSize: '0.75rem', 
                                        fontWeight: 'bold',
                                        color: getProfitColor(dailyProfits[day]),
                                        marginTop: '0.25rem'
                                    }}>
                                        ${dailyProfits[day] > 0 ? '+' : ''}{dailyProfits[day].toFixed(0)}
                                    </span>
                                )}
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

const Analytics = () => {
    const { bets, deposits, stats, addDeposit, deleteDeposit } = useBets();
    const [showAddDeposit, setShowAddDeposit] = useState(false);
    const [depositAmount, setDepositAmount] = useState('');
    const [depositDate, setDepositDate] = useState(new Date().toISOString().split('T')[0]);

    // Prepare data for Profit Trend
    // Sort by date ascending for the chart
    const sortedBets = [...bets].sort((a, b) => {
        const dateA = a.date ? new Date(a.date) : new Date(0);
        const dateB = b.date ? new Date(b.date) : new Date(0);
        return dateA - dateB;
    });
    let cumulativeProfit = 0;
    const profitTrendData = sortedBets.map(bet => {
        cumulativeProfit += bet.profit;
        return {
            name: bet.game, // or date
            profit: cumulativeProfit,
            date: bet.date
        };
    });

    // Prepare data for Win/Loss Pie
    const wins = bets.filter(b => b.profit > 0).length;
    const losses = bets.filter(b => b.profit <= 0).length;
    const pieData = [
        { name: 'Wins', value: wins },
        { name: 'Losses', value: losses }
    ];
    const COLORS = ['#10b981', '#ef4444'];

    // Prepare data for Game Performance
    const gameStats = bets.reduce((acc, bet) => {
        if (!acc[bet.game]) {
            acc[bet.game] = { name: bet.game, profit: 0, bets: 0 };
        }
        acc[bet.game].profit += bet.profit;
        acc[bet.game].bets += 1;
        return acc;
    }, {});
    const barData = Object.values(gameStats);

    // Prepare data for Sport League Performance
    const leagueStats = bets
        .filter(bet => bet.sportLeague)
        .reduce((acc, bet) => {
            if (!acc[bet.sportLeague]) {
                acc[bet.sportLeague] = { name: bet.sportLeague, profit: 0, bets: 0, totalStake: 0 };
            }
            acc[bet.sportLeague].profit += bet.profit;
            acc[bet.sportLeague].bets += 1;
            acc[bet.sportLeague].totalStake += bet.stake;
            return acc;
        }, {});
    const leagueData = Object.values(leagueStats);
    const leagueROIData = Object.values(leagueStats).map(league => ({
        ...league,
        roi: league.totalStake > 0 ? parseFloat(((league.profit / league.totalStake) * 100).toFixed(1)) : 0
    }));

    // Prepare data for Profit vs Stake Correlation (Scatter Plot)
    const profitStakeData = bets.map(bet => ({
        stake: bet.stake,
        profit: bet.profit,
        isWin: bet.profit > 0
    }));

    // Calculate Average Odds on Wins vs Losses
    const betsWithOdds = bets.filter(bet => bet.odds !== null && bet.odds !== undefined);
    const winsWithOdds = betsWithOdds.filter(bet => bet.profit > 0);
    const lossesWithOdds = betsWithOdds.filter(bet => bet.profit <= 0);
    
    const avgOddsWins = winsWithOdds.length > 0 
        ? (winsWithOdds.reduce((sum, bet) => sum + bet.odds, 0) / winsWithOdds.length).toFixed(2)
        : null;
    const avgOddsLosses = lossesWithOdds.length > 0
        ? (lossesWithOdds.reduce((sum, bet) => sum + bet.odds, 0) / lossesWithOdds.length).toFixed(2)
        : null;
    
    // Average odds calculation
    const averageOdds = betsWithOdds.length > 0
        ? (betsWithOdds.reduce((sum, bet) => sum + bet.odds, 0) / betsWithOdds.length).toFixed(2)
        : null;

    const oddsComparisonData = [
        { name: 'Wins', avgOdds: avgOddsWins ? parseFloat(avgOddsWins) : 0, count: winsWithOdds.length },
        { name: 'Losses', avgOdds: avgOddsLosses ? parseFloat(avgOddsLosses) : 0, count: lossesWithOdds.length }
    ];

    // Prepare data for Category Split Analytics
    const categoryStats = bets
        .filter(bet => bet.category)
        .reduce((acc, bet) => {
            // Create category name with Live prefix if applicable
            const categoryName = bet.live ? `Live ${bet.category}` : bet.category;
            if (!acc[categoryName]) {
                acc[categoryName] = { name: categoryName, profit: 0, bets: 0, wins: 0, totalStake: 0 };
            }
            acc[categoryName].profit += bet.profit;
            acc[categoryName].bets += 1;
            acc[categoryName].totalStake += bet.stake;
            if (bet.profit > 0) {
                acc[categoryName].wins += 1;
            }
            return acc;
        }, {});
    const categoryData = Object.values(categoryStats).map(cat => ({
        ...cat,
        winRate: cat.bets > 0 ? Math.round((cat.wins / cat.bets) * 100) : 0,
        roi: cat.totalStake > 0 ? parseFloat(((cat.profit / cat.totalStake) * 100).toFixed(1)) : 0
    }));

    // Calculate Average Profit Per Win
    const winningBets = bets.filter(bet => bet.profit > 0);
    const totalWinProfit = winningBets.reduce((sum, bet) => sum + bet.profit, 0);
    const averageProfitPerWin = winningBets.length > 0 
        ? (totalWinProfit / winningBets.length).toFixed(2)
        : 0;

    // Additional Stats Calculations
    const losingBets = bets.filter(bet => bet.profit <= 0);
    const totalLossAmount = losingBets.reduce((sum, bet) => sum + Math.abs(bet.profit), 0);
    const averageLossPerLoss = losingBets.length > 0 
        ? (totalLossAmount / losingBets.length).toFixed(2)
        : 0;
    
    const totalAmountRisked = bets.reduce((sum, bet) => sum + bet.stake, 0);
    const averageStake = bets.length > 0 
        ? (totalAmountRisked / bets.length).toFixed(2)
        : 0;
    
    const overallROI = totalAmountRisked > 0 
        ? ((stats.totalProfit / totalAmountRisked) * 100).toFixed(1)
        : 0;
    
    const biggestLoss = losingBets.length > 0
        ? Math.min(...losingBets.map(bet => bet.profit))
        : 0;
    
    const winLossProfitRatio = totalLossAmount > 0 
        ? (totalWinProfit / totalLossAmount).toFixed(2)
        : totalWinProfit > 0 ? '∞' : '0';
    
    // Calculate Profit Efficiency Score (combines ROI, Win Rate, Win/Loss Ratio)
    const efficiencyROI = parseFloat(overallROI) || 0;
    const efficiencyWinRate = stats.winRate || 0;
    const efficiencyWinLossRatio = winLossProfitRatio === '∞' ? 3 : (parseFloat(winLossProfitRatio) || 0);
    
    // Normalize components (ROI: -100 to +∞, Win Rate: 0-100, Win/Loss: 0 to ∞)
    // Score formula: (ROI/100 * 0.4) + (WinRate/100 * 0.3) + (min(WinLossRatio, 3)/3 * 0.3) * 100
    const normalizedROI = Math.max(-1, Math.min(1, efficiencyROI / 100)); // Cap at -100% to +100%
    const normalizedWinRate = efficiencyWinRate / 100;
    const normalizedWinLoss = Math.min(3, Math.max(0, efficiencyWinLossRatio)) / 3; // Cap at 3:1 ratio
    
    const profitEfficiencyScore = ((normalizedROI * 0.4) + (normalizedWinRate * 0.3) + (normalizedWinLoss * 0.3)) * 100;
    
    // Calculate Risk-Adjusted Returns (Sharpe-like metric)
    // Formula: (Average Return) / (Standard Deviation of Returns)
    // Using profit per bet as returns
    const averageProfitPerBet = bets.length > 0 ? (stats.totalProfit / bets.length) : 0;
    
    // Calculate standard deviation of profit per bet
    const profitVariance = bets.length > 0
        ? bets.reduce((sum, bet) => {
            const diff = bet.profit - averageProfitPerBet;
            return sum + (diff * diff);
        }, 0) / bets.length
        : 0;
    const profitStdDev = Math.sqrt(profitVariance);
    
    const riskAdjustedReturn = profitStdDev > 0 
        ? (averageProfitPerBet / profitStdDev).toFixed(2)
        : averageProfitPerBet > 0 ? '∞' : '0';
    
    // Calculate current streak
    const sortedBetsByDate = [...bets].sort((a, b) => {
        const dateA = a.date ? new Date(a.date) : new Date(0);
        const dateB = b.date ? new Date(b.date) : new Date(0);
        return dateB - dateA; // Most recent first
    });
    
    let currentStreak = 0;
    let streakType = null;
    if (sortedBetsByDate.length > 0) {
        const mostRecentBet = sortedBetsByDate[0];
        streakType = mostRecentBet.profit > 0 ? 'win' : 'loss';
        for (const bet of sortedBetsByDate) {
            if ((streakType === 'win' && bet.profit > 0) || (streakType === 'loss' && bet.profit <= 0)) {
                currentStreak++;
            } else {
                break;
            }
        }
    }
    // Prepare data for Live vs Non-Live Performance
    const liveBets = bets.filter(bet => bet.live);
    const nonLiveBets = bets.filter(bet => !bet.live);
    
    const liveStats = {
        name: 'Live',
        profit: liveBets.reduce((sum, bet) => sum + bet.profit, 0),
        bets: liveBets.length,
        wins: liveBets.filter(bet => bet.profit > 0).length
    };
    
    const nonLiveStats = {
        name: 'Non-Live',
        profit: nonLiveBets.reduce((sum, bet) => sum + bet.profit, 0),
        bets: nonLiveBets.length,
        wins: nonLiveBets.filter(bet => bet.profit > 0).length
    };
    
    const liveComparisonData = [liveStats, nonLiveStats].map(stat => ({
        ...stat,
        winRate: stat.bets > 0 ? Math.round((stat.wins / stat.bets) * 100) : 0
    }));

    // Calculate Value at Risk (VaR) - Potential loss at confidence level
    // Using historical simulation method (95% confidence level)
    const calculateVaR = (confidenceLevel = 0.95) => {
        if (bets.length === 0) return null;
        
        // Sort profits from worst to best
        const sortedProfits = [...bets].map(bet => bet.profit).sort((a, b) => a - b);
        
        // Calculate the index for the confidence level
        // For 95% VaR, we want the 5th percentile (worst 5% of outcomes)
        const percentileIndex = Math.floor((1 - confidenceLevel) * sortedProfits.length);
        const varValue = sortedProfits[percentileIndex];
        
        // VaR is the negative of the profit at this percentile (since it's a loss)
        return varValue < 0 ? Math.abs(varValue) : 0;
    };
    
    const var95 = calculateVaR(0.95);
    const var99 = calculateVaR(0.99);

    // Calculate Edge (Expected Value)
    // Edge = (Win Rate × Average Win) - (Loss Rate × Average Loss)
    const calculateEdge = () => {
        if (bets.length === 0) return null;
        
        const winRateDecimal = wins / bets.length;
        const lossRateDecimal = 1 - winRateDecimal;
        
        const avgWin = winningBets.length > 0 
            ? winningBets.reduce((sum, bet) => sum + bet.profit, 0) / winningBets.length
            : 0;
        
        const avgLoss = losingBets.length > 0
            ? losingBets.reduce((sum, bet) => sum + Math.abs(bet.profit), 0) / losingBets.length
            : 0;
        
        const edge = (winRateDecimal * avgWin) - (lossRateDecimal * avgLoss);
        const edgePercentage = totalAmountRisked > 0 ? (edge / (totalAmountRisked / bets.length)) * 100 : 0;
        
        return {
            absolute: edge,
            percentage: edgePercentage
        };
    };
    
    const edge = calculateEdge();

    // Calculate Kelly Criterion
    // Kelly % = (Win Probability × (Odds + 1) - 1) / Odds
    // Simplified: Kelly % = (p × b - q) / b
    // Where p = win probability, b = net odds (return/stake - 1), q = loss probability
    const calculateKelly = () => {
        if (bets.length === 0 || totalAmountRisked === 0) return null;
        
        const winProb = wins / bets.length;
        const lossProb = 1 - winProb;
        
        // Calculate average return ratio for winning bets only
        // This gives us the average odds when we win
        const winningBetsWithReturns = winningBets.filter(bet => bet.stake > 0 && bet.returnAmount > 0);
        if (winningBetsWithReturns.length === 0) return null;
        
        const avgWinReturnRatio = winningBetsWithReturns.reduce((sum, bet) => {
            return sum + (bet.returnAmount / bet.stake);
        }, 0) / winningBetsWithReturns.length;
        
        // Net odds when winning = return ratio - 1
        const netOdds = avgWinReturnRatio - 1;
        
        if (netOdds <= 0) return null;
        
        // Kelly % = (p × b - q) / b
        // Where b = net odds, p = win probability, q = loss probability
        const kellyPercent = ((winProb * netOdds) - lossProb) / netOdds;
        
        // Kelly should be between 0 and 1 (0% to 100% of bankroll)
        // Negative Kelly means the bet is not profitable
        return Math.max(0, Math.min(1, kellyPercent)) * 100;
    };
    
    const kellyPercent = calculateKelly();

    // Prepare data for Win Rate Over Time (Rolling Win Rate Chart)
    const calculateRollingWinRate = (windowSize = 10) => {
        if (sortedBets.length === 0) return [];
        
        const rollingData = [];
        for (let i = 0; i < sortedBets.length; i++) {
            const windowStart = Math.max(0, i - windowSize + 1);
            const windowBets = sortedBets.slice(windowStart, i + 1);
            const windowWins = windowBets.filter(bet => bet.profit > 0).length;
            const windowWinRate = windowBets.length > 0 ? (windowWins / windowBets.length) * 100 : 0;
            
            rollingData.push({
                betNumber: i + 1,
                winRate: parseFloat(windowWinRate.toFixed(1)),
                date: sortedBets[i].date || sortedBets[i].dateDisplay
            });
        }
        
        return rollingData;
    };
    
    const rollingWinRateData = calculateRollingWinRate(10);

    // Prepare deposit data for chart
    const depositData = deposits.map(deposit => ({
        date: deposit.date,
        amount: deposit.amount
    }));

    const handleAddDeposit = (e) => {
        e.preventDefault();
        if (depositAmount && parseFloat(depositAmount) > 0) {
            const depositDateObj = new Date(depositDate);
            addDeposit({
                id: Date.now(),
                amount: parseFloat(depositAmount),
                date: depositDate,
                dateDisplay: depositDateObj.toLocaleDateString()
            });
            setDepositAmount('');
            setDepositDate(new Date().toISOString().split('T')[0]);
            setShowAddDeposit(false);
        }
    };

    return (
        <div>
            <style>{`
                @media (max-width: 768px) {
                    .analytics-header h2 {
                        font-size: 1.5rem !important;
                    }
                    .analytics-summary-grid {
                        grid-template-columns: repeat(2, 1fr) !important;
                        gap: 1rem !important;
                        margin-bottom: 2rem !important;
                    }
                    .analytics-card {
                        padding: 1rem !important;
                    }
                    .analytics-card-title {
                        font-size: 0.75rem !important;
                    }
                    .analytics-card-value {
                        font-size: 1.25rem !important;
                    }
                    .analytics-charts-grid {
                        grid-template-columns: 1fr !important;
                        gap: 1.5rem !important;
                    }
                    .analytics-chart-card {
                        height: 300px !important;
                        overflow: hidden !important;
                    }
                    .analytics-chart-title {
                        font-size: 1rem !important;
                        margin-bottom: 1rem !important;
                    }
                    .pie-chart-container {
                        overflow: hidden !important;
                        width: 100% !important;
                        max-width: 100% !important;
                    }
                    .pie-chart-container svg {
                        max-width: 100% !important;
                        height: auto !important;
                    }
                    .calendar-header {
                        flex-direction: column !important;
                        gap: 1rem !important;
                    }
                    .calendar-header h3 {
                        font-size: 1rem !important;
                    }
                    .calendar-grid {
                        gap: 0.25rem !important;
                        width: 100% !important;
                        max-width: 100% !important;
                        overflow: hidden !important;
                    }
                    .calendar-day {
                        padding: 0.25rem !important;
                        font-size: 0.75rem !important;
                        min-width: 0 !important;
                        min-height: 0 !important;
                    }
                    .calendar-day-number {
                        font-size: 0.75rem !important;
                    }
                    .calendar-day-profit {
                        font-size: 0.625rem !important;
                    }
                    .card:has(.calendar-grid) {
                        overflow: hidden !important;
                        width: 100% !important;
                        max-width: 100% !important;
                    }
                    .analytics-form-grid {
                        grid-template-columns: 1fr !important;
                    }
                    .analytics-deposit-form {
                        flex-direction: column !important;
                    }
                    .analytics-deposit-form > div {
                        flex: 1 !important;
                    }
                    .calendar-nav-button {
                        min-width: 44px !important;
                        min-height: 44px !important;
                    }
                }
                @media (max-width: 480px) {
                    .analytics-summary-grid {
                        grid-template-columns: 1fr !important;
                    }
                    .analytics-chart-card {
                        height: 250px !important;
                    }
                    .pie-chart-container .recharts-legend-wrapper {
                        font-size: 0.625rem !important;
                        padding: 0.5rem 0 !important;
                    }
                    .pie-chart-container .recharts-legend-item {
                        margin-right: 0.5rem !important;
                    }
                    .calendar-header span {
                        min-width: 150px !important;
                        font-size: 0.875rem !important;
                    }
                    .calendar-grid {
                        gap: 0.15rem !important;
                    }
                    .calendar-day {
                        padding: 0.15rem !important;
                    }
                    .calendar-day-number {
                        font-size: 0.625rem !important;
                    }
                    .calendar-day-profit {
                        font-size: 0.5rem !important;
                    }
                    .calendar-day-header {
                        font-size: 0.625rem !important;
                        padding: 0.25rem 0.15rem !important;
                    }
                }
            `}</style>
            <header className="analytics-header" style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Analytics</h2>
                <p style={{ color: 'var(--text-muted)' }}>Deep dive into your betting performance.</p>
            </header>

            {/* Summary Cards */}
            <div className="analytics-summary-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                <div className="card analytics-card">
                    <p className="analytics-card-title" style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Total Profit</p>
                    <p className="analytics-card-value" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: stats.totalProfit >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                        ${stats.totalProfit.toLocaleString()}
                    </p>
                    {stats.totalDeposits > 0 && (
                        <p style={{ 
                            fontSize: '0.75rem', 
                            color: stats.totalProfit >= 0 ? 'var(--success)' : 'var(--danger)',
                            marginTop: '0.25rem'
                        }}>
                            {stats.totalProfit >= 0 ? '+' : ''}{((stats.totalProfit / stats.totalDeposits) * 100).toFixed(1)}% {stats.totalProfit >= 0 ? 'gain' : 'loss'}
                        </p>
                    )}
                </div>
                <div className="card analytics-card">
                    <p className="analytics-card-title" style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Total Deposits</p>
                    <p className="analytics-card-value" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-main)' }}>
                        ${stats.totalDeposits.toLocaleString()}
                    </p>
                    <button
                        onClick={() => setShowAddDeposit(!showAddDeposit)}
                        style={{
                            marginTop: '0.5rem',
                            padding: '0.25rem 0.5rem',
                            fontSize: '0.75rem',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--border)',
                            backgroundColor: 'var(--bg-dark)',
                            color: 'var(--text-main)',
                            cursor: 'pointer'
                        }}
                    >
                        {showAddDeposit ? 'Cancel' : '+ Add Deposit'}
                    </button>
                </div>
                <div className="card analytics-card">
                    <p className="analytics-card-title" style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Win Rate</p>
                    <p className="analytics-card-value" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{stats.winRate}%</p>
                </div>
                <div className="card analytics-card">
                    <p className="analytics-card-title" style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Total Bets</p>
                    <p className="analytics-card-value" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{stats.totalBets}</p>
                </div>
                <div className="card analytics-card">
                    <p className="analytics-card-title" style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Cashed Out</p>
                    <p className="analytics-card-value" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{stats.cashedOutBets}</p>
                </div>
                {winningBets.length > 0 && (
                    <div className="card analytics-card">
                        <p className="analytics-card-title" style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Avg Profit Per Win</p>
                        <p className="analytics-card-value" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--success)' }}>
                            ${parseFloat(averageProfitPerWin).toLocaleString()}
                        </p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                            {winningBets.length} wins
                        </p>
                    </div>
                )}
                <div className="card analytics-card">
                    <p className="analytics-card-title" style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Total Amount Risked</p>
                    <p className="analytics-card-value" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-main)' }}>
                        ${totalAmountRisked.toLocaleString()}
                    </p>
                    {totalAmountRisked > 0 && (
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                            Avg: ${parseFloat(averageStake).toLocaleString()}
                        </p>
                    )}
                </div>
                <div className="card analytics-card">
                    <p className="analytics-card-title" style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Overall ROI</p>
                    <p className="analytics-card-value" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: parseFloat(overallROI) >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                        {parseFloat(overallROI) >= 0 ? '+' : ''}{overallROI}%
                    </p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                        Profit ÷ Risked
                    </p>
                </div>
                {losingBets.length > 0 && (
                    <div className="card analytics-card">
                        <p className="analytics-card-title" style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Avg Loss Per Loss</p>
                        <p className="analytics-card-value" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--danger)' }}>
                            ${parseFloat(averageLossPerLoss).toLocaleString()}
                        </p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                            {losingBets.length} losses
                        </p>
                    </div>
                )}
                {biggestLoss < 0 && (
                    <div className="card analytics-card">
                        <p className="analytics-card-title" style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Biggest Loss</p>
                        <p className="analytics-card-value" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--danger)' }}>
                            ${Math.abs(biggestLoss).toLocaleString()}
                        </p>
                    </div>
                )}
                {stats.bestWin > 0 && (
                    <div className="card analytics-card">
                        <p className="analytics-card-title" style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Best Win</p>
                        <p className="analytics-card-value" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--success)' }}>
                            ${stats.bestWin.toLocaleString()}
                        </p>
                    </div>
                )}
                {winningBets.length > 0 && losingBets.length > 0 && (
                    <div className="card analytics-card">
                        <p className="analytics-card-title" style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Win/Loss Ratio</p>
                        <p className="analytics-card-value" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: parseFloat(winLossProfitRatio) >= 1 ? 'var(--success)' : 'var(--danger)' }}>
                            {winLossProfitRatio}:1
                        </p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                            Win $ ÷ Loss $
                        </p>
                    </div>
                )}
                {currentStreak > 0 && (
                    <div className="card analytics-card">
                        <p className="analytics-card-title" style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Current Streak</p>
                        <p className="analytics-card-value" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: streakType === 'win' ? 'var(--success)' : 'var(--danger)' }}>
                            {currentStreak} {streakType === 'win' ? 'Wins' : 'Losses'}
                        </p>
                    </div>
                )}
                {averageOdds && (
                    <div className="card analytics-card">
                        <p className="analytics-card-title" style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Avg Odds</p>
                        <p className="analytics-card-value" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-main)' }}>
                            {parseFloat(averageOdds) >= 0 ? '+' : ''}{averageOdds}
                        </p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                            {betsWithOdds.length} bets tracked
                        </p>
                    </div>
                )}
                {bets.length > 0 && (
                    <div className="card analytics-card">
                        <p className="analytics-card-title" style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Profit Efficiency Score</p>
                        <p className="analytics-card-value" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: profitEfficiencyScore >= 50 ? 'var(--success)' : profitEfficiencyScore >= 25 ? '#fbbf24' : 'var(--danger)' }}>
                            {profitEfficiencyScore.toFixed(1)}
                        </p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                            ROI + Win Rate + Ratio
                        </p>
                    </div>
                )}
                {bets.length > 1 && profitStdDev > 0 && (
                    <div className="card analytics-card">
                        <p className="analytics-card-title" style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Risk-Adjusted Return</p>
                        <p className="analytics-card-value" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: parseFloat(riskAdjustedReturn) >= 1 ? 'var(--success)' : parseFloat(riskAdjustedReturn) >= 0.5 ? '#fbbf24' : 'var(--danger)' }}>
                            {riskAdjustedReturn}
                        </p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                            Avg Return ÷ Std Dev
                        </p>
                    </div>
                )}
                {var95 !== null && bets.length > 0 && (
                    <div className="card analytics-card">
                        <p className="analytics-card-title" style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Value at Risk (95%)</p>
                        <p className="analytics-card-value" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--danger)' }}>
                            ${var95.toFixed(2)}
                        </p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                            Potential loss at 95% confidence
                        </p>
                    </div>
                )}
                {var99 !== null && bets.length > 0 && (
                    <div className="card analytics-card">
                        <p className="analytics-card-title" style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Value at Risk (99%)</p>
                        <p className="analytics-card-value" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--danger)' }}>
                            ${var99.toFixed(2)}
                        </p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                            Potential loss at 99% confidence
                        </p>
                    </div>
                )}
                {edge !== null && bets.length > 0 && (
                    <div className="card analytics-card">
                        <p className="analytics-card-title" style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Edge (Expected Value)</p>
                        <p className="analytics-card-value" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: edge.absolute >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                            ${edge.absolute >= 0 ? '+' : ''}{edge.absolute.toFixed(2)}
                        </p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                            {edge.percentage >= 0 ? '+' : ''}{edge.percentage.toFixed(2)}% per bet
                        </p>
                    </div>
                )}
                {kellyPercent !== null && bets.length > 0 && (
                    <div className="card analytics-card">
                        <p className="analytics-card-title" style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Kelly Criterion</p>
                        <p className="analytics-card-value" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: kellyPercent > 0 ? 'var(--success)' : 'var(--danger)' }}>
                            {kellyPercent.toFixed(2)}%
                        </p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                            Optimal bet size (% of bankroll)
                        </p>
                    </div>
                )}
            </div>

            {/* Add Deposit Form */}
            {showAddDeposit && (
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Add Deposit</h3>
                    <form className="analytics-deposit-form" onSubmit={handleAddDeposit} style={{ display: 'flex', gap: '1rem', alignItems: 'end' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Amount ($)</label>
                            <input
                                type="number"
                                required
                                min="0"
                                step="0.01"
                                value={depositAmount}
                                onChange={(e) => setDepositAmount(e.target.value)}
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
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Date</label>
                            <input
                                type="date"
                                required
                                value={depositDate}
                                onChange={(e) => setDepositDate(e.target.value)}
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
                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ padding: '0.75rem 1.5rem' }}
                        >
                            Add
                        </button>
                    </form>
                </div>
            )}

            {/* Deposits List */}
            {deposits.length > 0 && (
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Recent Deposits</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {deposits.slice(0, 5).map(deposit => (
                            <div key={deposit.id} style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center',
                                padding: '0.75rem',
                                backgroundColor: 'var(--bg-dark)',
                                borderRadius: 'var(--radius-sm)'
                            }}>
                                <span style={{ color: 'var(--text-muted)' }}>{deposit.dateDisplay || deposit.date}</span>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <span style={{ fontWeight: 'bold' }}>${deposit.amount.toFixed(2)}</span>
                                    <button
                                        onClick={() => deleteDeposit(deposit.id)}
                                        style={{
                                            padding: '0.25rem 0.5rem',
                                            fontSize: '0.75rem',
                                            borderRadius: 'var(--radius-sm)',
                                            border: '1px solid var(--border)',
                                            backgroundColor: 'transparent',
                                            color: 'var(--danger)',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="analytics-charts-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))', gap: '2rem' }}>

                {/* Profit Trend */}
                <div className="card analytics-chart-card" style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
                    <h3 className="analytics-chart-title" style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', flexShrink: 0 }}>Profit Trend</h3>
                    <div style={{ flex: 1, minHeight: 0 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={profitTrendData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                            <XAxis dataKey="date" stroke="var(--text-muted)" />
                            <YAxis stroke="var(--text-muted)" />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}
                                itemStyle={{ color: 'var(--text-main)' }}
                            />
                            <Line type="monotone" dataKey="profit" stroke="var(--accent)" strokeWidth={2} dot={{ r: 4 }} />
                        </LineChart>
                    </ResponsiveContainer>
                    </div>
                </div>

                {/* Win/Loss Ratio */}
                <div className="card analytics-chart-card" style={{ height: '400px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <h3 className="analytics-chart-title" style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', flexShrink: 0 }}>Win/Loss Ratio</h3>
                    <div className="pie-chart-container" style={{ flex: 1, minHeight: 0, width: '100%', overflow: 'hidden' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius="40%"
                                outerRadius="70%"
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}
                                itemStyle={{ color: 'var(--text-main)' }}
                            />
                            <Legend wrapperStyle={{ fontSize: '0.75rem' }} />
                        </PieChart>
                    </ResponsiveContainer>
                    </div>
                </div>

                {/* Profit by Game */}
                <div className="card" style={{ height: '400px', gridColumn: '1 / -1', display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', flexShrink: 0 }}>Profit by Game</h3>
                    <div style={{ flex: 1, minHeight: 0 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                            <XAxis dataKey="name" stroke="var(--text-muted)" />
                            <YAxis stroke="var(--text-muted)" />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}
                                itemStyle={{ color: 'var(--text-main)' }}
                                cursor={{ fill: 'var(--bg-card-hover)' }}
                            />
                            <Bar dataKey="profit" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                </div>

                {/* Profit by Sport League */}
                {leagueData.length > 0 && (
                    <div className="card analytics-chart-card" style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
                        <h3 className="analytics-chart-title" style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', flexShrink: 0 }}>Profit by Sport League</h3>
                        <div style={{ flex: 1, minHeight: 0 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={leagueData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                    <XAxis dataKey="name" stroke="var(--text-muted)" />
                                    <YAxis stroke="var(--text-muted)" />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}
                                        itemStyle={{ color: 'var(--text-main)' }}
                                        cursor={{ fill: 'var(--bg-card-hover)' }}
                                    />
                                    <Bar dataKey="profit" fill="#818cf8" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

                {/* ROI by Sport League */}
                {leagueROIData.length > 0 && (
                    <div className="card analytics-chart-card" style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
                        <h3 className="analytics-chart-title" style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', flexShrink: 0 }}>ROI by Sport League</h3>
                        <div style={{ flex: 1, minHeight: 0 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={leagueROIData} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                    <XAxis 
                                        type="number" 
                                        stroke="var(--text-muted)"
                                        label={{ value: 'ROI (%)', position: 'insideBottom', offset: -5 }}
                                    />
                                    <YAxis dataKey="name" type="category" stroke="var(--text-muted)" width={100} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}
                                        itemStyle={{ color: 'var(--text-main)' }}
                                        formatter={(value, name) => {
                                            if (name === 'roi') return [`${value >= 0 ? '+' : ''}${value.toFixed(1)}%`, 'ROI'];
                                            if (name === 'profit') return [`$${value.toFixed(2)}`, 'Profit'];
                                            if (name === 'totalStake') return [`$${value.toFixed(2)}`, 'Total Risked'];
                                            return [value, name];
                                        }}
                                        cursor={{ fill: 'var(--bg-card-hover)' }}
                                    />
                                    <Bar dataKey="roi" fill="#10b981" radius={[0, 4, 4, 0]}>
                                        {leagueROIData.map((entry, index) => (
                                            <Cell 
                                                key={`cell-${index}`} 
                                                fill={entry.roi >= 0 ? '#10b981' : '#ef4444'} 
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

                {/* Deposits Over Time */}
                {depositData.length > 0 && (
                    <div className="card analytics-chart-card" style={{ height: '400px', gridColumn: '1 / -1', display: 'flex', flexDirection: 'column' }}>
                        <h3 className="analytics-chart-title" style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', flexShrink: 0 }}>Deposits Over Time</h3>
                        <div style={{ flex: 1, minHeight: 0 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={depositData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                    <XAxis dataKey="date" stroke="var(--text-muted)" />
                                    <YAxis stroke="var(--text-muted)" />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}
                                        itemStyle={{ color: 'var(--text-main)' }}
                                        cursor={{ fill: 'var(--bg-card-hover)' }}
                                    />
                                    <Bar dataKey="amount" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

                {/* Average Odds: Wins vs Losses */}
                {betsWithOdds.length > 0 && (
                    <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                        <h3 className="analytics-chart-title" style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', flexShrink: 0 }}>Avg Odds: Wins vs Losses</h3>
                        <div style={{ height: '320px', flexShrink: 0 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={oddsComparisonData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                    <XAxis dataKey="name" stroke="var(--text-muted)" />
                                    <YAxis stroke="var(--text-muted)" />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}
                                        itemStyle={{ color: 'var(--text-main)' }}
                                        formatter={(value) => [`${value > 0 ? '+' : ''}${value}`, 'Avg Odds']}
                                        cursor={{ fill: 'var(--bg-card-hover)' }}
                                    />
                                    <Bar dataKey="avgOdds" fill="#8b5cf6" radius={[4, 4, 0, 0]}>
                                        {oddsComparisonData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#ef4444'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div style={{ marginTop: '1rem', paddingTop: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: '1.5' }}>
                            {avgOddsWins && <span>Wins: {avgOddsWins > 0 ? '+' : ''}{avgOddsWins} ({winsWithOdds.length} bets)</span>}
                            {avgOddsWins && avgOddsLosses && <span> • </span>}
                            {avgOddsLosses && <span>Losses: {avgOddsLosses > 0 ? '+' : ''}{avgOddsLosses} ({lossesWithOdds.length} bets)</span>}
                        </div>
                    </div>
                )}

                {/* Category Split Analytics */}
                {categoryData.length > 0 && (
                    <div className="card analytics-chart-card" style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
                        <h3 className="analytics-chart-title" style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', flexShrink: 0 }}>Category Performance</h3>
                        <div style={{ flex: 1, minHeight: 0 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={categoryData} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                    <XAxis type="number" stroke="var(--text-muted)" />
                                    <YAxis dataKey="name" type="category" stroke="var(--text-muted)" width={100} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}
                                        itemStyle={{ color: 'var(--text-main)' }}
                                        formatter={(value, name) => {
                                            if (name === 'profit') return [`$${value.toFixed(2)}`, 'Profit'];
                                            if (name === 'winRate') return [`${value}%`, 'Win Rate'];
                                            return [value, name];
                                        }}
                                        cursor={{ fill: 'var(--bg-card-hover)' }}
                                    />
                                    <Bar dataKey="profit" fill="#6366f1" radius={[0, 4, 4, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

                {/* ROI by Category */}
                {categoryData.length > 0 && (
                    <div className="card analytics-chart-card" style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
                        <h3 className="analytics-chart-title" style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', flexShrink: 0 }}>ROI by Category</h3>
                        <div style={{ flex: 1, minHeight: 0 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={categoryData} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                    <XAxis 
                                        type="number" 
                                        stroke="var(--text-muted)"
                                        label={{ value: 'ROI (%)', position: 'insideBottom', offset: -5 }}
                                    />
                                    <YAxis dataKey="name" type="category" stroke="var(--text-muted)" width={100} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}
                                        itemStyle={{ color: 'var(--text-main)' }}
                                        formatter={(value, name) => {
                                            if (name === 'roi') return [`${value >= 0 ? '+' : ''}${value.toFixed(1)}%`, 'ROI'];
                                            if (name === 'profit') return [`$${value.toFixed(2)}`, 'Profit'];
                                            if (name === 'totalStake') return [`$${value.toFixed(2)}`, 'Total Risked'];
                                            return [value, name];
                                        }}
                                        cursor={{ fill: 'var(--bg-card-hover)' }}
                                    />
                                    <Bar dataKey="roi" fill="#10b981" radius={[0, 4, 4, 0]}>
                                        {categoryData.map((entry, index) => (
                                            <Cell 
                                                key={`cell-${index}`} 
                                                fill={parseFloat(entry.roi) >= 0 ? '#10b981' : '#ef4444'} 
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

                {/* Count by Category */}
                {categoryData.length > 0 && (
                    <div className="card analytics-chart-card" style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
                        <h3 className="analytics-chart-title" style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', flexShrink: 0 }}>Bet Count by Category</h3>
                        <div style={{ flex: 1, minHeight: 0 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={categoryData} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                    <XAxis 
                                        type="number" 
                                        stroke="var(--text-muted)"
                                        label={{ value: 'Number of Bets', position: 'insideBottom', offset: -5 }}
                                    />
                                    <YAxis dataKey="name" type="category" stroke="var(--text-muted)" width={100} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}
                                        itemStyle={{ color: 'var(--text-main)' }}
                                        formatter={(value, name) => {
                                            if (name === 'bets') return [value, 'Number of Bets'];
                                            if (name === 'wins') return [value, 'Wins'];
                                            if (name === 'winRate') return [`${value}%`, 'Win Rate'];
                                            return [value, name];
                                        }}
                                        cursor={{ fill: 'var(--bg-card-hover)' }}
                                    />
                                    <Bar dataKey="bets" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

                {/* Profit vs Stake Correlation */}
                {profitStakeData.length > 0 && (
                    <div className="card analytics-chart-card" style={{ height: '400px', gridColumn: '1 / -1', display: 'flex', flexDirection: 'column' }}>
                        <h3 className="analytics-chart-title" style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', flexShrink: 0 }}>Profit vs Stake Correlation</h3>
                        <div style={{ flex: 1, minHeight: 0 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <ScatterChart>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                    <XAxis 
                                        type="number" 
                                        dataKey="stake" 
                                        name="Stake" 
                                        stroke="var(--text-muted)"
                                        label={{ value: 'Stake ($)', position: 'insideBottom', offset: -5 }}
                                    />
                                    <YAxis 
                                        type="number" 
                                        dataKey="profit" 
                                        name="Profit" 
                                        stroke="var(--text-muted)"
                                        label={{ value: 'Profit ($)', angle: -90, position: 'insideLeft' }}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}
                                        itemStyle={{ color: 'var(--text-main)' }}
                                        cursor={{ strokeDasharray: '3 3' }}
                                        formatter={(value, name) => {
                                            if (name === 'stake') return [`$${value.toFixed(2)}`, 'Stake'];
                                            if (name === 'profit') return [`$${value.toFixed(2)}`, 'Profit'];
                                            return [value, name];
                                        }}
                                    />
                                    <Scatter name="Bets" data={profitStakeData} fill="#8884d8">
                                        {profitStakeData.map((entry, index) => (
                                            <Cell 
                                                key={`cell-${index}`} 
                                                fill={entry.isWin ? '#10b981' : '#ef4444'} 
                                            />
                                        ))}
                                    </Scatter>
                                    <Legend />
                                </ScatterChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

                {/* Live vs Non-Live Performance */}
                {liveBets.length > 0 || nonLiveBets.length > 0 ? (
                    <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                        <h3 className="analytics-chart-title" style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', flexShrink: 0 }}>Live vs Non-Live</h3>
                        <div style={{ height: '320px', flexShrink: 0 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={liveComparisonData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                    <XAxis dataKey="name" stroke="var(--text-muted)" />
                                    <YAxis stroke="var(--text-muted)" />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}
                                        itemStyle={{ color: 'var(--text-main)' }}
                                        formatter={(value, name) => {
                                            if (name === 'profit') return [`$${value.toFixed(2)}`, 'Profit'];
                                            if (name === 'winRate') return [`${value}%`, 'Win Rate'];
                                            if (name === 'bets') return [value, 'Total Bets'];
                                            return [value, name];
                                        }}
                                        cursor={{ fill: 'var(--bg-card-hover)' }}
                                    />
                                    <Bar dataKey="profit" fill="#ef4444" radius={[4, 4, 0, 0]}>
                                        {liveComparisonData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={index === 0 ? '#ef4444' : '#6366f1'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div style={{ marginTop: '1rem', paddingTop: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: '1.5' }}>
                            <span>Live: ${liveStats.profit.toFixed(2)} ({liveStats.bets} bets, {liveStats.wins > 0 ? Math.round((liveStats.wins / liveStats.bets) * 100) : 0}% win rate)</span>
                            <span> • </span>
                            <span>Non-Live: ${nonLiveStats.profit.toFixed(2)} ({nonLiveStats.bets} bets, {nonLiveStats.wins > 0 ? Math.round((nonLiveStats.wins / nonLiveStats.bets) * 100) : 0}% win rate)</span>
                        </div>
                    </div>
                ) : null}

                {/* Rolling Win Rate Over Time */}
                {rollingWinRateData.length > 0 && (
                    <div className="card analytics-chart-card" style={{ height: '400px', gridColumn: '1 / -1', display: 'flex', flexDirection: 'column' }}>
                        <h3 className="analytics-chart-title" style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', flexShrink: 0 }}>Rolling Win Rate Over Time (10-bet window)</h3>
                        <div style={{ flex: 1, minHeight: 0 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={rollingWinRateData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                    <XAxis 
                                        dataKey="betNumber" 
                                        stroke="var(--text-muted)"
                                        label={{ value: 'Bet Number', position: 'insideBottom', offset: -5 }}
                                    />
                                    <YAxis 
                                        stroke="var(--text-muted)"
                                        label={{ value: 'Win Rate (%)', angle: -90, position: 'insideLeft' }}
                                        domain={[0, 100]}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}
                                        itemStyle={{ color: 'var(--text-main)' }}
                                        formatter={(value) => [`${value}%`, 'Win Rate']}
                                        labelFormatter={(value) => `Bet #${value}`}
                                    />
                                    <Line 
                                        type="monotone" 
                                        dataKey="winRate" 
                                        stroke="#10b981" 
                                        strokeWidth={2} 
                                        dot={{ r: 3 }} 
                                        name="Win Rate"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        <div style={{ marginTop: '1rem', paddingTop: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                            Rolling 10-bet window win rate. Shows performance trend over time.
                        </div>
                    </div>
                )}

            </div>

            {/* Calendar View */}
            <div style={{ marginTop: '2rem' }}>
                <CalendarView bets={bets} />
            </div>
        </div>
    );
};

export default Analytics;
