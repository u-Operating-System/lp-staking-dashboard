'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '../shared/Card';
import { Input } from '../shared/Input';
import { Button } from '../shared/Button';
import { useStakingRewards } from '@/hooks/contracts/useStakingRewards';
import { useWaitForTransactionReceipt } from 'wagmi';
import { useToast } from '@/providers/ToastProvider';

export const UnstakeCard = () => {
  const [amount, setAmount] = useState('');
  const [withdrawTxHash, setWithdrawTxHash] = useState<`0x${string}` | undefined>(undefined);
  const [claimTxHash, setClaimTxHash] = useState<`0x${string}` | undefined>(undefined);
  const { showToast } = useToast();
  const { 
    stakedBalance, 
    earned,
    handleWithdraw, 
    handleGetReward,
    isWithdrawing,
    isClaiming,
    refetchAllData
  } = useStakingRewards();

  // Watch for withdraw transaction confirmation
  const { isLoading: isWaitingForWithdraw, isSuccess: withdrawTxConfirmed } = 
    useWaitForTransactionReceipt({ 
      hash: withdrawTxHash,
      confirmations: 1
    });
    
  // Watch for claim rewards transaction confirmation
  const { isLoading: isWaitingForClaim, isSuccess: claimTxConfirmed } = 
    useWaitForTransactionReceipt({ 
      hash: claimTxHash,
      confirmations: 1
    });
    
  // Auto refresh data on a timer
  useEffect(() => {
    // Initial fetch
    refetchAllData();
    
    const intervalId = setInterval(() => {
      refetchAllData();
    }, 5000); // Refresh every 5 seconds
    
    return () => clearInterval(intervalId);
  }, [refetchAllData]);
  
  // When withdraw transaction is confirmed, show success toast and refresh data
  useEffect(() => {
    if (withdrawTxConfirmed && withdrawTxHash) {
      const updateDataAndNotify = async () => {
        try {
          // Force refresh all data
          await refetchAllData();
          
          // Show success notification after data is refreshed
          showToast('Successfully unstaked LP tokens!', 'success');
          
          // Reset transaction hash
          setWithdrawTxHash(undefined);
        } catch (error) {
          console.error('Error updating data after confirmation:', error);
        }
      };
      
      updateDataAndNotify();
    }
  }, [withdrawTxConfirmed, withdrawTxHash, refetchAllData, showToast]);
  
  // When claim transaction is confirmed, show success toast and refresh data
  useEffect(() => {
    if (claimTxConfirmed && claimTxHash) {
      const updateDataAndNotify = async () => {
        try {
          // Force refresh all data
          await refetchAllData();
          
          // Show success notification after data is refreshed
          showToast('Successfully claimed rewards!', 'success');
          
          // Reset transaction hash
          setClaimTxHash(undefined);
        } catch (error) {
          console.error('Error updating data after confirmation:', error);
        }
      };
      
      updateDataAndNotify();
    }
  }, [claimTxConfirmed, claimTxHash, refetchAllData, showToast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;
    
    try {
      // Show "transaction submitted" toast immediately
      showToast('Transaction submitted. Please sign in your wallet.', 'success');
      
      // Get transaction hash from withdraw operation
      const hash = await handleWithdraw(amount);
      
      if (hash) {
        // Set transaction hash to begin monitoring
        setWithdrawTxHash(hash);
        
        // Show transaction sent toast
        showToast('Transaction sent! Waiting for confirmation...', 'success');
        
        // Reset amount input
        setAmount('');
      }
    } catch (error) {
      console.error('Unstake transaction error:', error);
      
      // Check for user rejection error
      if (error instanceof Error && 
          (error.message.includes('User rejected') || 
           error.message.includes('User denied') ||
           error.message.includes('User rejected the request'))) {
        showToast('Transaction cancelled. You can try again when ready.', 'success');
      } else {
        showToast(
          error instanceof Error ? error.message : 'Failed to unstake LP tokens',
          'error'
        );
      }
    }
  };

  const handleClaimRewards = async () => {
    try {
      // Show "transaction submitted" toast immediately
      showToast('Transaction submitted. Please sign in your wallet.', 'success');
      
      // Get transaction hash from claim operation
      const hash = await handleGetReward();
      
      if (hash) {
        // Set transaction hash to begin monitoring
        setClaimTxHash(hash);
        
        // Show transaction sent toast
        showToast('Transaction sent! Waiting for confirmation...', 'success');
      }
    } catch (error) {
      console.error('Claim rewards transaction error:', error);
      
      // Check for user rejection error
      if (error instanceof Error && 
          (error.message.includes('User rejected') || 
           error.message.includes('User denied') ||
           error.message.includes('User rejected the request'))) {
        showToast('Transaction cancelled. You can try again when ready.', 'success');
      } else {
        showToast(
          error instanceof Error ? error.message : 'Failed to claim rewards',
          'error'
        );
      }
    }
  };

  return (
    <div className="bg-[#e5e5e5] rounded-2xl p-4 md:p-8 noise">
      <h2 className="text-xl md:text-2xl font-semibold text-[#4a5568] mb-6 md:mb-8">Unstake</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
        <div className="bg-[#d8d8d8] rounded-xl p-4 noise">
          <div className="text-2xl md:text-4xl font-semibold text-[#4a5568] mb-2">
            {Number(stakedBalance).toLocaleString()}
          </div>
          <div className="text-sm text-[#64748b]">Staked</div>
          <div className="text-xs text-[#718096]">LP Token</div>
        </div>

        <div className="bg-[#d8d8d8] rounded-xl p-4 noise">
          <div className="text-2xl md:text-4xl font-semibold text-[#4a5568] mb-2">
            {Number(earned).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
          <div className="text-sm text-[#64748b]">Claimable Rewards</div>
          <div className="text-xs text-[#718096]">$TOKEN</div>
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
            placeholder="Amount of LP Token to unstake"
            min="0"
            step="any"
            className="w-full pl-20 md:pl-28 pr-16 md:pr-20 py-3 md:py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4a5568]/20 bg-[#d8d8d8] text-sm md:text-base"
          />
          <button
            type="button"
            onClick={() => setAmount(stakedBalance)}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-[#4a5568] text-white px-2 md:px-3 py-1 rounded-lg text-xs md:text-sm font-medium"
          >
            max
          </button>
        </div>

        <div className="flex gap-4">
          <Button
            type="button"
            onClick={handleClaimRewards}
            disabled={!earned || isClaiming || isWaitingForClaim}
            className="flex-1 bg-black text-white py-3 rounded-xl font-medium hover:bg-black/90 transition-colors disabled:bg-gray-200 disabled:text-gray-400"
          >
            {isClaiming ? 'Waiting for signature...' : 
             isWaitingForClaim ? 'Confirming...' : 
             'Claim Rewards'}
          </Button>
          <Button
            type="submit"
            disabled={!amount || isWithdrawing || isWaitingForWithdraw || Number(amount) <= 0 || Number(amount) > Number(stakedBalance)}
            className="flex-1 bg-black text-white py-3 rounded-xl font-medium hover:bg-black/90 transition-colors disabled:bg-gray-200 disabled:text-gray-400"
          >
            {isWithdrawing ? 'Waiting for signature...' : 
             isWaitingForWithdraw ? 'Confirming...' : 
             'Unstake LP Tokens'}
          </Button>
        </div>
      </form>
    </div>
  );
}; 