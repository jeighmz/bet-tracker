import React, { createContext, useContext, useState, useEffect } from 'react';

const BetContext = createContext();

export const useBets = () => {
    const context = useContext(BetContext);
    if (!context) {
        throw new Error('useBets must be used within a BetProvider');
    }
    return context;
};

export const BetProvider = ({ children }) => {
    // Helper functions to load from localStorage
    const loadBetsFromStorage = () => {
        try {
            const storedBets = localStorage.getItem('gambling-tracker-bets');
            if (storedBets) {
                return JSON.parse(storedBets);
            }
        } catch (error) {
            console.error('Error loading bets from localStorage:', error);
        }
        // Return dummy data only if no stored data exists
        const today = new Date().toISOString().split('T')[0];
        return [
            {
                id: 1,
                game: 'Blackjack',
                stake: 100,
                returnAmount: 250,
                profit: 150,
                date: today,
                dateDisplay: new Date().toLocaleDateString(),
                screenshot: null,
                sportLeague: null,
                cashedOut: false
            },
            {
                id: 2,
                game: 'Roulette',
                stake: 50,
                returnAmount: 0,
                profit: -50,
                date: today,
                dateDisplay: new Date().toLocaleDateString(),
                screenshot: null,
                sportLeague: null,
                cashedOut: false
            },
            {
                id: 3,
                game: 'Slots',
                stake: 20,
                returnAmount: 500,
                profit: 480,
                date: today,
                dateDisplay: new Date().toLocaleDateString(),
                screenshot: null,
                sportLeague: null,
                cashedOut: false
            }
        ];
    };

    const loadDepositsFromStorage = () => {
        try {
            const storedDeposits = localStorage.getItem('gambling-tracker-deposits');
            if (storedDeposits) {
                return JSON.parse(storedDeposits);
            }
        } catch (error) {
            console.error('Error loading deposits from localStorage:', error);
        }
        return [];
    };

    // Initialize state from localStorage
    const [bets, setBets] = useState(loadBetsFromStorage);
    const [deposits, setDeposits] = useState(loadDepositsFromStorage);

    // Save to localStorage whenever bets or deposits change
    useEffect(() => {
        try {
            localStorage.setItem('gambling-tracker-bets', JSON.stringify(bets));
        } catch (error) {
            console.error('Error saving bets to localStorage:', error);
        }
    }, [bets]);

    useEffect(() => {
        try {
            localStorage.setItem('gambling-tracker-deposits', JSON.stringify(deposits));
        } catch (error) {
            console.error('Error saving deposits to localStorage:', error);
        }
    }, [deposits]);

    const addBet = (newBet) => {
        setBets(prevBets => [newBet, ...prevBets]);
    };

    const updateBet = (updatedBet) => {
        setBets(prevBets => prevBets.map(bet => bet.id === updatedBet.id ? updatedBet : bet));
    };

    const deleteBet = (id) => {
        setBets(prevBets => prevBets.filter(bet => bet.id !== id));
    };

    const addDeposit = (deposit) => {
        setDeposits(prevDeposits => [deposit, ...prevDeposits]);
    };

    const deleteDeposit = (id) => {
        setDeposits(prevDeposits => prevDeposits.filter(deposit => deposit.id !== id));
    };

    // Derived stats
    const totalProfit = bets.reduce((acc, bet) => acc + bet.profit, 0);
    const totalBets = bets.length;
    const wins = bets.filter(bet => bet.profit > 0).length;
    const winRate = totalBets > 0 ? Math.round((wins / totalBets) * 100) : 0;
    const bestWin = bets.reduce((max, bet) => (bet.profit > max ? bet.profit : max), 0);
    const totalDeposits = deposits.reduce((acc, deposit) => acc + deposit.amount, 0);
    const netProfit = totalProfit - totalDeposits;
    const cashedOutBets = bets.filter(bet => bet.cashedOut).length;

    const value = {
        bets,
        deposits,
        addBet,
        updateBet,
        deleteBet,
        addDeposit,
        deleteDeposit,
        stats: {
            totalProfit,
            totalBets,
            winRate,
            bestWin,
            totalDeposits,
            netProfit,
            cashedOutBets
        }
    };

    return (
        <BetContext.Provider value={value}>
            {children}
        </BetContext.Provider>
    );
};
