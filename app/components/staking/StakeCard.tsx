'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '../shared/Card';
import { Input } from '../shared/Input';
import { Button } from '../shared/Button';
import { useStakingRewards } from '@/hooks/contracts/useStakingRewards';
import { useTokenBalance } from '@/hooks/contracts/useTokenBalance';
import { CONTRACTS } from '@/config/contracts';
import { useAccount, useWaitForTransactionReceipt } from 'wagmi';
import { useToast } from '@/providers/ToastProvider';

export const StakeCard = () => {
  const [amount, setAmount] = useState('');
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined);
  const { address } = useAccount();
  const { showToast } = useToast();
  
  // We'll use both balance sources but prefer the one from staking rewards
  const { balance: tokenBalance, refetch: refetchTokenBalance } = useTokenBalance(CONTRACTS.LP_TOKEN);
  const { 
    handleStake, 
    isStaking, 
    isApproved, 
    handleApprove, 
    isApproving,
    refetchAllData,
    refetchLPBalance,
    lpBalance,
    remainingDays
  } = useStakingRewards();
  
  // Use the lpBalance directly from the staking rewards hook
  const displayBalance = lpBalance;
  
  // Watch for transaction confirmation
  const { isLoading: isWaitingForTransaction, isSuccess: txConfirmed } = 
    useWaitForTransactionReceipt({ 
      hash: txHash,
      confirmations: 1
    });
    
  // Auto refresh data on a timer
  useEffect(() => {
    // Initial fetch
    refetchAllData();
    refetchTokenBalance();
    
    const intervalId = setInterval(() => {
      refetchAllData();
      refetchTokenBalance();
    }, 3000); // Refresh every 3 seconds
    
    return () => clearInterval(intervalId);
  }, [refetchAllData, refetchTokenBalance]);
  
  // When transaction is confirmed, show success toast and refresh data
  useEffect(() => {
    if (txConfirmed && txHash) {
      const updateDataAndNotify = async () => {
        try {
          // Force refresh all data
          await refetchAllData();
          await refetchTokenBalance();
          
          // Show success notification after data is refreshed
          showToast('Successfully staked LP tokens!', 'success');
          
          // Reset transaction hash
          setTxHash(undefined);
        } catch (error) {
          console.error('Error updating data after confirmation:', error);
        }
      };
      
      updateDataAndNotify();
    }
  }, [txConfirmed, txHash, refetchAllData, refetchTokenBalance, showToast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;
    
    try {
      // Show "transaction submitted" toast immediately
      showToast('Transaction submitted. Please sign in your wallet.', 'success');
      
      // Get transaction hash from staking operation
      const hash = await handleStake(amount);
      
      if (hash) {
        // Set transaction hash to begin monitoring
        setTxHash(hash);
        
        // Show transaction sent toast
        showToast('Transaction sent! Waiting for confirmation...', 'success');
        
        // Reset amount input
        setAmount('');
        
        // Immediately refresh balances and then set up a polling interval
        // to keep refreshing until we see the change
        const refreshInterval = setInterval(async () => {
          await refetchAllData();
          await refetchTokenBalance();
        }, 2000);
        
        // Stop polling after 30 seconds if for some reason it doesn't work
        setTimeout(() => clearInterval(refreshInterval), 30000);
      }
    } catch (error) {
      console.error('Stake transaction error:', error);
      
      // Check for user rejection error
      if (error instanceof Error && 
          (error.message.includes('User rejected') || 
           error.message.includes('User denied') ||
           error.message.includes('User rejected the request'))) {
        showToast('Transaction cancelled. You can try again when ready.', 'success');
      } else {
        showToast(
          error instanceof Error ? error.message : 'Failed to stake LP tokens',
          'error'
        );
      }
    }
  };

  const handleApproveClick = async () => {
    try {
      showToast('Approval transaction submitted. Please sign in your wallet.', 'success');
      
      const hash = await handleApprove();
      if (hash) {
        showToast('Approval transaction sent! Waiting for confirmation...', 'success');
        
        // Set up polling to refresh data until we see the approval state change
        const refreshInterval = setInterval(async () => {
          await refetchAllData();
          await refetchTokenBalance();
        }, 2000);
        
        // Stop polling after 30 seconds if for some reason it doesn't work
        setTimeout(() => clearInterval(refreshInterval), 30000);
      }
    } catch (error) {
      console.error('Approval transaction error:', error);
      
      // Check for user rejection error
      if (error instanceof Error && 
          (error.message.includes('User rejected') || 
           error.message.includes('User denied') ||
           error.message.includes('User rejected the request'))) {
        showToast('Transaction cancelled. You can try again when ready.', 'success');
      } else {
        showToast(
          error instanceof Error ? error.message : 'Failed to approve LP tokens',
          'error'
        );
      }
    }
  };

  return (
    <div className="bg-[#e5e5e5] rounded-2xl p-4 md:p-8 noise">
      <h2 className="text-xl md:text-2xl font-semibold text-[#4a5568] mb-6 md:mb-8">Stake</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
        <div className="bg-[#d8d8d8] rounded-xl p-4 noise">
          <div className="text-2xl md:text-4xl font-semibold text-[#4a5568] mb-2">
            {Number(displayBalance).toLocaleString()} 
          </div>
          <div className="text-sm text-[#64748b]">Wallet Balance</div>
          <div className="text-xs text-[#718096]">LP Token</div>
        </div>

        <div className="bg-[#d8d8d8] rounded-xl p-4 noise">
          <div className="text-2xl md:text-4xl font-semibold text-[#4a5568] mb-2">
            {remainingDays}
          </div>
          <div className="text-sm text-[#64748b]">Rewards Period</div>
          <div className="text-xs text-[#718096]">Days Remaining</div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <div className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 bg-[#d8d8d8] px-2 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium text-[#4a5568]">
            LP Token
          </div>
          <input
            type="number"
            value={amount}
            onChange={(e) => {
              const value = e.target.value;
              // Only set the amount if it's empty or a positive number
              if (value === '' || Number(value) >= 0) {
                setAmount(value);
              }
            }}
            placeholder="Amount of LP Token to stake"
            min="0"
            step="any"
            className="w-full pl-20 md:pl-28 pr-16 md:pr-20 py-3 md:py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4a5568]/20 bg-[#d8d8d8] text-sm md:text-base"
          />
          <button
            type="button"
            onClick={() => setAmount(displayBalance)}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-[#4a5568] text-white px-2 md:px-3 py-1 rounded-lg text-xs md:text-sm font-medium"
          >
            max
          </button>
        </div>

        <div className="flex gap-4">
          {!isApproved ? (
            <Button
              type="button"
              onClick={handleApproveClick}
              disabled={!amount || isApproving || !address}
              className="flex-1 bg-black text-white py-3 rounded-xl font-medium hover:bg-black/90 transition-colors disabled:bg-gray-200 disabled:text-gray-400"
            >
              {isApproving ? 'Waiting for signature...' : 'Approve LP Token'}
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={!amount || isStaking || isWaitingForTransaction || Number(amount) <= 0 || Number(amount) > Number(displayBalance)}
              className="flex-1 bg-black text-white py-3 rounded-xl font-medium hover:bg-black/90 transition-colors disabled:bg-gray-200 disabled:text-gray-400"
            >
              {isStaking ? 'Waiting for signature...' : 
               isWaitingForTransaction ? 'Confirming...' : 
               'Stake LP Tokens'}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}; 