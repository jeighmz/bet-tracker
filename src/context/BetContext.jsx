import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
  Timestamp,
  getDocs
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from './AuthContext';

const BetContext = createContext();

export const useBets = () => {
    const context = useContext(BetContext);
    if (!context) {
        throw new Error('useBets must be used within a BetProvider');
    }
    return context;
};

export const BetProvider = ({ children }) => {
    const { currentUser } = useAuth();
    const [bets, setBets] = useState([]);
    const [deposits, setDeposits] = useState([]);
    const [withdrawals, setWithdrawals] = useState([]);
    const [loading, setLoading] = useState(true);

    // Load bets from Firestore
    useEffect(() => {
        if (!currentUser) {
            setBets([]);
            setDeposits([]);
            setWithdrawals([]);
            setLoading(false);
            return;
        }

        setLoading(true);

        // Set up real-time listener for bets
        const betsRef = collection(db, 'users', currentUser.uid, 'bets');
        const betsQuery = query(betsRef, orderBy('date', 'desc'));
        
        const unsubscribeBets = onSnapshot(
            betsQuery,
            (snapshot) => {
                const betsData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    // Convert Firestore Timestamp to date string if needed
                    date: doc.data().date instanceof Timestamp 
                        ? doc.data().date.toDate().toISOString().split('T')[0]
                        : doc.data().date,
                    dateDisplay: doc.data().dateDisplay || (
                        doc.data().date instanceof Timestamp
                            ? doc.data().date.toDate().toLocaleDateString()
                            : new Date(doc.data().date).toLocaleDateString()
                    )
                }));
                setBets(betsData);
                setLoading(false);
            },
            (error) => {
                console.error('Error loading bets:', error);
                setLoading(false);
            }
        );

        // Set up real-time listener for deposits
        const depositsRef = collection(db, 'users', currentUser.uid, 'deposits');
        const depositsQuery = query(depositsRef, orderBy('date', 'desc'));
        
        const unsubscribeDeposits = onSnapshot(
            depositsQuery,
            (snapshot) => {
                const depositsData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    date: doc.data().date instanceof Timestamp
                        ? doc.data().date.toDate().toISOString().split('T')[0]
                        : doc.data().date,
                    dateDisplay: doc.data().dateDisplay || (
                        doc.data().date instanceof Timestamp
                            ? doc.data().date.toDate().toLocaleDateString()
                            : new Date(doc.data().date).toLocaleDateString()
                    )
                }));
                setDeposits(depositsData);
            },
            (error) => {
                console.error('Error loading deposits:', error);
            }
        );

        // Set up real-time listener for withdrawals
        const withdrawalsRef = collection(db, 'users', currentUser.uid, 'withdrawals');
        const withdrawalsQuery = query(withdrawalsRef, orderBy('date', 'desc'));
        
        const unsubscribeWithdrawals = onSnapshot(
            withdrawalsQuery,
            (snapshot) => {
                const withdrawalsData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    date: doc.data().date instanceof Timestamp
                        ? doc.data().date.toDate().toISOString().split('T')[0]
                        : doc.data().date,
                    dateDisplay: doc.data().dateDisplay || (
                        doc.data().date instanceof Timestamp
                            ? doc.data().date.toDate().toLocaleDateString()
                            : new Date(doc.data().date).toLocaleDateString()
                    )
                }));
                setWithdrawals(withdrawalsData);
            },
            (error) => {
                console.error('Error loading withdrawals:', error);
            }
        );

        return () => {
            unsubscribeBets();
            unsubscribeDeposits();
            unsubscribeWithdrawals();
        };
    }, [currentUser]);

    const addBet = async (newBet) => {
        if (!currentUser) {
            throw new Error('User must be logged in to add bets');
        }

        try {
            const betsRef = collection(db, 'users', currentUser.uid, 'bets');
            const betData = {
                ...newBet,
                date: newBet.date || new Date().toISOString().split('T')[0],
                dateDisplay: newBet.dateDisplay || new Date(newBet.date).toLocaleDateString(),
                createdAt: Timestamp.now()
            };
            // Remove id from betData as Firestore will generate it
            const { id, ...betDataWithoutId } = betData;
            await addDoc(betsRef, betDataWithoutId);
        } catch (error) {
            console.error('Error adding bet:', error);
            throw error;
        }
    };

    const updateBet = async (updatedBet) => {
        if (!currentUser) {
            throw new Error('User must be logged in to update bets');
        }

        try {
            const betRef = doc(db, 'users', currentUser.uid, 'bets', updatedBet.id);
            const { id, ...betData } = updatedBet;
            await updateDoc(betRef, betData);
        } catch (error) {
            console.error('Error updating bet:', error);
            throw error;
        }
    };

    const deleteBet = async (id) => {
        if (!currentUser) {
            throw new Error('User must be logged in to delete bets');
        }

        try {
            const betRef = doc(db, 'users', currentUser.uid, 'bets', id);
            await deleteDoc(betRef);
        } catch (error) {
            console.error('Error deleting bet:', error);
            throw error;
        }
    };

    const addDeposit = async (deposit) => {
        if (!currentUser) {
            throw new Error('User must be logged in to add deposits');
        }

        try {
            const depositsRef = collection(db, 'users', currentUser.uid, 'deposits');
            const depositData = {
                ...deposit,
                date: deposit.date || new Date().toISOString().split('T')[0],
                dateDisplay: deposit.dateDisplay || new Date(deposit.date).toLocaleDateString(),
                createdAt: Timestamp.now()
            };
            const { id, ...depositDataWithoutId } = depositData;
            await addDoc(depositsRef, depositDataWithoutId);
        } catch (error) {
            console.error('Error adding deposit:', error);
            throw error;
        }
    };

    const deleteDeposit = async (id) => {
        if (!currentUser) {
            throw new Error('User must be logged in to delete deposits');
        }

        try {
            const depositRef = doc(db, 'users', currentUser.uid, 'deposits', id);
            await deleteDoc(depositRef);
        } catch (error) {
            console.error('Error deleting deposit:', error);
            throw error;
        }
    };

    const addWithdrawal = async (withdrawal) => {
        if (!currentUser) {
            throw new Error('User must be logged in to add withdrawals');
        }

        try {
            const withdrawalsRef = collection(db, 'users', currentUser.uid, 'withdrawals');
            const withdrawalData = {
                ...withdrawal,
                date: withdrawal.date || new Date().toISOString().split('T')[0],
                dateDisplay: withdrawal.dateDisplay || new Date(withdrawal.date).toLocaleDateString(),
                createdAt: Timestamp.now()
            };
            const { id, ...withdrawalDataWithoutId } = withdrawalData;
            await addDoc(withdrawalsRef, withdrawalDataWithoutId);
        } catch (error) {
            console.error('Error adding withdrawal:', error);
            throw error;
        }
    };

    const deleteWithdrawal = async (id) => {
        if (!currentUser) {
            throw new Error('User must be logged in to delete withdrawals');
        }

        try {
            const withdrawalRef = doc(db, 'users', currentUser.uid, 'withdrawals', id);
            await deleteDoc(withdrawalRef);
        } catch (error) {
            console.error('Error deleting withdrawal:', error);
            throw error;
        }
    };

    const updateWithdrawal = async (updatedWithdrawal) => {
        if (!currentUser) {
            throw new Error('User must be logged in to update withdrawals');
        }

        try {
            const withdrawalRef = doc(db, 'users', currentUser.uid, 'withdrawals', updatedWithdrawal.id);
            const { id, ...withdrawalData } = updatedWithdrawal;
            await updateDoc(withdrawalRef, withdrawalData);
        } catch (error) {
            console.error('Error updating withdrawal:', error);
            throw error;
        }
    };

    // Migration function to move localStorage data to Firestore
    const migrateFromLocalStorage = useCallback(async () => {
        if (!currentUser) {
            return; // Silently return if no user
        }

        try {
            // Check if migration has already been done
            const migrationKey = `migration-done-${currentUser.uid}`;
            if (localStorage.getItem(migrationKey)) {
                console.log('Migration already completed for this user (localStorage check)');
                return;
            }

            // Check if Firestore already has data - if so, skip migration
            const betsRef = collection(db, 'users', currentUser.uid, 'bets');
            const depositsRef = collection(db, 'users', currentUser.uid, 'deposits');
            
            const [betsSnapshot, depositsSnapshot] = await Promise.all([
                getDocs(betsRef),
                getDocs(depositsRef)
            ]);

            // If Firestore already has data, mark migration as done and skip
            if (!betsSnapshot.empty || !depositsSnapshot.empty) {
                console.log('Firestore already has data, skipping migration');
                localStorage.setItem(migrationKey, 'true');
                return;
            }

            // Load bets from localStorage
            const storedBets = localStorage.getItem('gambling-tracker-bets');
            const storedDeposits = localStorage.getItem('gambling-tracker-deposits');

            // Only migrate if we have localStorage data and Firestore is empty
            if (storedBets) {
                const betsData = JSON.parse(storedBets);
                
                // Double-check Firestore is still empty before migrating
                const recheckSnapshot = await getDocs(betsRef);
                if (recheckSnapshot.empty && betsData.length > 0) {
                    // Add each bet to Firestore
                    for (const bet of betsData) {
                        const { id, ...betData } = bet;
                        await addDoc(betsRef, {
                            ...betData,
                            createdAt: Timestamp.now()
                        });
                    }
                    console.log(`Migrated ${betsData.length} bets to Firestore`);
                }
            }

            if (storedDeposits) {
                const depositsData = JSON.parse(storedDeposits);
                
                // Double-check Firestore is still empty before migrating
                const recheckSnapshot = await getDocs(depositsRef);
                if (recheckSnapshot.empty && depositsData.length > 0) {
                    // Add each deposit to Firestore
                    for (const deposit of depositsData) {
                        const { id, ...depositData } = deposit;
                        await addDoc(depositsRef, {
                            ...depositData,
                            createdAt: Timestamp.now()
                        });
                    }
                    console.log(`Migrated ${depositsData.length} deposits to Firestore`);
                }
            }

            // Mark migration as done
            localStorage.setItem(migrationKey, 'true');
            console.log('Migration completed successfully');
        } catch (error) {
            console.error('Error migrating data:', error);
            // Don't throw - just log the error to prevent breaking the app
        }
    }, [currentUser]);

    // Cleanup function to remove duplicate bets/deposits
    const cleanupDuplicates = useCallback(async () => {
        if (!currentUser) {
            throw new Error('User must be logged in to cleanup duplicates');
        }

        try {
            console.log('Starting cleanup of duplicates...');

            // Cleanup bets
            const betsRef = collection(db, 'users', currentUser.uid, 'bets');
            const betsSnapshot = await getDocs(betsRef);
            const bets = betsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            // Find duplicates based on game, stake, returnAmount, and date
            const betMap = new Map();
            const duplicateBetIds = [];

            bets.forEach(bet => {
                const key = `${bet.game}-${bet.stake}-${bet.returnAmount}-${bet.date}`;
                if (betMap.has(key)) {
                    // Keep the one with the earliest createdAt, delete others
                    const existing = betMap.get(key);
                    const betTime = bet.createdAt instanceof Timestamp 
                        ? bet.createdAt.toMillis() 
                        : (bet.createdAt?.seconds ? bet.createdAt.seconds * 1000 : Date.now());
                    const existingTime = existing.createdAt instanceof Timestamp
                        ? existing.createdAt.toMillis()
                        : (existing.createdAt?.seconds ? existing.createdAt.seconds * 1000 : Date.now());
                    
                    if (betTime < existingTime) {
                        duplicateBetIds.push(existing.id);
                        betMap.set(key, bet);
                    } else {
                        duplicateBetIds.push(bet.id);
                    }
                } else {
                    betMap.set(key, bet);
                }
            });

            // Delete duplicate bets
            for (const betId of duplicateBetIds) {
                const betRef = doc(db, 'users', currentUser.uid, 'bets', betId);
                await deleteDoc(betRef);
                console.log(`Deleted duplicate bet: ${betId}`);
            }

            // Cleanup deposits
            const depositsRef = collection(db, 'users', currentUser.uid, 'deposits');
            const depositsSnapshot = await getDocs(depositsRef);
            const deposits = depositsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            // Find duplicates based on amount and date
            const depositMap = new Map();
            const duplicateDepositIds = [];

            deposits.forEach(deposit => {
                const key = `${deposit.amount}-${deposit.date}`;
                if (depositMap.has(key)) {
                    // Keep the one with the earliest createdAt, delete others
                    const existing = depositMap.get(key);
                    const depositTime = deposit.createdAt instanceof Timestamp
                        ? deposit.createdAt.toMillis()
                        : (deposit.createdAt?.seconds ? deposit.createdAt.seconds * 1000 : Date.now());
                    const existingTime = existing.createdAt instanceof Timestamp
                        ? existing.createdAt.toMillis()
                        : (existing.createdAt?.seconds ? existing.createdAt.seconds * 1000 : Date.now());
                    
                    if (depositTime < existingTime) {
                        duplicateDepositIds.push(existing.id);
                        depositMap.set(key, deposit);
                    } else {
                        duplicateDepositIds.push(deposit.id);
                    }
                } else {
                    depositMap.set(key, deposit);
                }
            });

            // Delete duplicate deposits
            for (const depositId of duplicateDepositIds) {
                const depositRef = doc(db, 'users', currentUser.uid, 'deposits', depositId);
                await deleteDoc(depositRef);
                console.log(`Deleted duplicate deposit: ${depositId}`);
            }

            console.log(`Cleanup complete! Deleted ${duplicateBetIds.length} duplicate bets and ${duplicateDepositIds.length} duplicate deposits.`);
            return { deletedBets: duplicateBetIds.length, deletedDeposits: duplicateDepositIds.length };
        } catch (error) {
            console.error('Error cleaning up duplicates:', error);
            throw error;
        }
    }, [currentUser]);

    // Reset function to clear Firestore and remigrate from localStorage
    const resetAndRemigrate = useCallback(async () => {
        if (!currentUser) {
            throw new Error('User must be logged in to reset and remigrate');
        }

        try {
            console.log('Starting reset and remigration...');

            // Delete all bets from Firestore
            const betsRef = collection(db, 'users', currentUser.uid, 'bets');
            const betsSnapshot = await getDocs(betsRef);
            const deleteBetsPromises = betsSnapshot.docs.map(doc => deleteDoc(doc.ref));
            await Promise.all(deleteBetsPromises);
            console.log(`Deleted ${betsSnapshot.docs.length} bets from Firestore`);

            // Delete all deposits from Firestore
            const depositsRef = collection(db, 'users', currentUser.uid, 'deposits');
            const depositsSnapshot = await getDocs(depositsRef);
            const deleteDepositsPromises = depositsSnapshot.docs.map(doc => deleteDoc(doc.ref));
            await Promise.all(deleteDepositsPromises);
            console.log(`Deleted ${depositsSnapshot.docs.length} deposits from Firestore`);

            // Clear the migration flag
            const migrationKey = `migration-done-${currentUser.uid}`;
            localStorage.removeItem(migrationKey);
            console.log('Cleared migration flag');

            // Wait a moment for Firestore to process deletions
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Now trigger migration
            console.log('Starting fresh migration from localStorage...');
            const storedBets = localStorage.getItem('gambling-tracker-bets');
            const storedDeposits = localStorage.getItem('gambling-tracker-deposits');

            if (storedBets) {
                const betsData = JSON.parse(storedBets);
                const betsCollectionRef = collection(db, 'users', currentUser.uid, 'bets');
                
                // Add each bet to Firestore
                for (const bet of betsData) {
                    const { id, ...betData } = bet;
                    await addDoc(betsCollectionRef, {
                        ...betData,
                        createdAt: Timestamp.now()
                    });
                }
                console.log(`Migrated ${betsData.length} bets to Firestore`);
            }

            if (storedDeposits) {
                const depositsData = JSON.parse(storedDeposits);
                const depositsCollectionRef = collection(db, 'users', currentUser.uid, 'deposits');
                
                // Add each deposit to Firestore
                for (const deposit of depositsData) {
                    const { id, ...depositData } = deposit;
                    await addDoc(depositsCollectionRef, {
                        ...depositData,
                        createdAt: Timestamp.now()
                    });
                }
                console.log(`Migrated ${depositsData.length} deposits to Firestore`);
            }

            // Mark migration as done
            localStorage.setItem(migrationKey, 'true');
            console.log('Reset and remigration completed successfully!');
            return { 
                migratedBets: storedBets ? JSON.parse(storedBets).length : 0,
                migratedDeposits: storedDeposits ? JSON.parse(storedDeposits).length : 0
            };
        } catch (error) {
            console.error('Error resetting and remigrating:', error);
            throw error;
        }
    }, [currentUser]);

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
        withdrawals,
        addBet,
        updateBet,
        deleteBet,
        addDeposit,
        deleteDeposit,
        addWithdrawal,
        updateWithdrawal,
        deleteWithdrawal,
        migrateFromLocalStorage,
        cleanupDuplicates,
        resetAndRemigrate,
        loading,
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
