'use client';

import { useCallback } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { CONTRACTS, ERC20_ABI, STAKING_REWARDS_ABI } from '../../config/contracts';
import { useQueryClient } from '@tanstack/react-query';

export const useStakingRewards = () => {
  const { address: connected_address } = useAccount();
  const queryClient = useQueryClient();

  // Query keys for invalidation
  const QUERY_KEYS = {
    lpBalance: ['lpBalance', connected_address],
    stakedBalance: ['stakedBalance', connected_address],
    earned: ['earned', connected_address],
    totalLPInStaking: ['totalLPInStaking'],
  };
  
  // 1. univ2.balanceOf(stakingrewards)
  const { data: totalLPInStaking, refetch: refetchTotalLP } = useReadContract({
    address: CONTRACTS.LP_TOKEN,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: [CONTRACTS.STAKING_REWARDS]
  });

  // Check allowance for approval status
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: CONTRACTS.LP_TOKEN,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: connected_address && CONTRACTS.STAKING_REWARDS ? [connected_address, CONTRACTS.STAKING_REWARDS] : undefined
  });

  // 2. stakingrewards.getReward(connected_address) - This is a write function, not needed here

  // 3. TBA
  // Implementation needed

  // 4. univ2.balanceOf(connected_address)
  const { data: lpBalance, refetch: refetchLPBalance } = useReadContract({
    address: CONTRACTS.LP_TOKEN,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: connected_address ? [connected_address] : undefined
  });

  // 5. TBA
  // Implementation needed

  // 6. stakingrewards.balanceOf(connected_address)
  const { data: stakedBalance, refetch: refetchStakedBalance } = useReadContract({
    address: CONTRACTS.STAKING_REWARDS,
    abi: STAKING_REWARDS_ABI,
    functionName: 'balanceOf',
    args: connected_address ? [connected_address] : undefined
  });

  // 7. stakingrewards.earned(connected_address)
  const { data: earned, refetch: refetchEarned } = useReadContract({
    address: CONTRACTS.STAKING_REWARDS,
    abi: STAKING_REWARDS_ABI,
    functionName: 'earned',
    args: connected_address ? [connected_address] : undefined
  });

  // Get periodFinish timestamp
  const { data: periodFinish } = useReadContract({
    address: CONTRACTS.STAKING_REWARDS,
    abi: STAKING_REWARDS_ABI,
    functionName: 'periodFinish',
  });

  // Get rewards duration
  const { data: rewardsDuration } = useReadContract({
    address: CONTRACTS.STAKING_REWARDS,
    abi: STAKING_REWARDS_ABI,
    functionName: 'rewardsDuration',
  });

  // Calculate remaining time in days
  const remainingTime = periodFinish ? 
    Math.max(0, Number(periodFinish) - Math.floor(Date.now() / 1000)) : 0;
  const remainingDays = Math.ceil(remainingTime / (24 * 60 * 60));

  // Write contract functions with separate write contracts
  const { writeContractAsync: writeUniv2Async, isPending: isApproving } = useWriteContract();
  const { writeContractAsync: writeStakeAsync, isPending: isStaking } = useWriteContract();
  const { writeContractAsync: writeWithdrawAsync, isPending: isWithdrawing } = useWriteContract();
  const { writeContractAsync: writeGetRewardAsync, isPending: isClaiming } = useWriteContract();

  const invalidateQueries = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lpBalance }),
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.stakedBalance }),
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.earned }),
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.totalLPInStaking }),
    ]);
  };

  // 8. univ2.approve(stakingrewards_address, uint256.max)
  const handleApprove = useCallback(async () => {
    if (!CONTRACTS.STAKING_REWARDS) return;
    try {
      const hash = await writeUniv2Async({
        address: CONTRACTS.LP_TOKEN,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [CONTRACTS.STAKING_REWARDS, BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')],
      });
      await refetchAllowance();
      return hash;
    } catch (error) {
      console.error('Approval failed:', error);
      throw error;
    }
  }, [writeUniv2Async, refetchAllowance]);

  // 8. (after approve) stakingrewards.stake(amount)
  const handleStake = useCallback(async (amount: string) => {
    try {
      // Use async version to get transaction hash
      const hash = await writeStakeAsync({
        address: CONTRACTS.STAKING_REWARDS,
        abi: STAKING_REWARDS_ABI,
        functionName: 'stake',
        args: [parseEther(amount)]
      });
      
      // Immediately trigger query invalidation to refresh data
      setTimeout(async () => {
        await invalidateQueries();
        await refetchLPBalance();
        await refetchStakedBalance();
      }, 1000);
      
      // Also set up a polling interval to keep checking until data is updated
      const pollInterval = setInterval(async () => {
        await refetchLPBalance();
        await refetchStakedBalance();
      }, 3000);
      
      // Clear polling after 30 seconds 
      setTimeout(() => clearInterval(pollInterval), 30000);
      
      return hash;
    } catch (error) {
      console.error('Staking failed:', error);
      throw error;
    }
  }, [writeStakeAsync, invalidateQueries, refetchLPBalance, refetchStakedBalance]);

  // 10. stakingrewards.withdraw(amount)
  const handleWithdraw = useCallback(async (amount: string) => {
    if (!amount || Number(amount) <= 0) {
      throw new Error('Amount must be greater than 0');
    }
    
    try {
      // Use async version to get transaction hash
      const hash = await writeWithdrawAsync({
        address: CONTRACTS.STAKING_REWARDS,
        abi: STAKING_REWARDS_ABI,
        functionName: 'withdraw',
        args: [parseEther(amount)]
      });
      
      return hash;
    } catch (error) {
      console.error('Withdrawal failed:', error);
      throw error;
    }
  }, [writeWithdrawAsync]);

  // 9. stakingrewards.getReward()
  const handleGetReward = useCallback(async () => {
    try {
      // Use async version to get transaction hash
      const hash = await writeGetRewardAsync({
        address: CONTRACTS.STAKING_REWARDS,
        abi: STAKING_REWARDS_ABI,
        functionName: 'getReward',
        args: []
      });
      
      return hash;
    } catch (error) {
      console.error('Reward claim failed:', error);
      throw error;
    }
  }, [writeGetRewardAsync]);

  return {
    // Read functions
    totalLPInStaking: totalLPInStaking ? formatEther(totalLPInStaking as bigint) : '0',
    lpBalance: lpBalance ? formatEther(lpBalance as bigint) : '0',
    stakedBalance: stakedBalance ? formatEther(stakedBalance as bigint) : '0',
    earned: earned ? formatEther(earned as bigint) : '0',
    
    // Rewards period information
    rewardsDuration: rewardsDuration ? Number(rewardsDuration) / (24 * 60 * 60) : 0, // Convert to days
    remainingDays,
    
    // Write functions
    handleApprove,
    handleStake,
    handleGetReward,
    handleWithdraw,

    // Loading states with separate tracking
    isApproving,
    isStaking,
    isWithdrawing,
    isClaiming,

    // Approval state
    isApproved: allowance ? (allowance as bigint) > BigInt(0) : false,

    // Refetch functions
    refetch: invalidateQueries,
    refetchAllData: async () => {
      await Promise.all([
        refetchTotalLP(),
        refetchLPBalance(),
        refetchStakedBalance(),
        refetchEarned(),
        refetchAllowance()
      ]);
    },
    refetchLPBalance
  };
}; 