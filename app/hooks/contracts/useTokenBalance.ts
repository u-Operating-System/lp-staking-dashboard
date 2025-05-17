'use client';

import { useEffect, useState } from 'react';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { formatEther, parseEther } from 'viem';
import { CONTRACTS } from '@/config/contracts';
import { useQueryClient } from '@tanstack/react-query';

const IERC20_ABI = [
  {
    "constant": true,
    "inputs": [{"name": "_owner", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "balance", "type": "uint256"}],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [{"name": "", "type": "uint8"}],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "symbol",
    "outputs": [{"name": "", "type": "string"}],
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {"name": "_to", "type": "address"},
      {"name": "_value", "type": "uint256"}
    ],
    "name": "transfer",
    "outputs": [{"name": "", "type": "bool"}],
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {"name": "_spender", "type": "address"},
      {"name": "_value", "type": "uint256"}
    ],
    "name": "approve",
    "outputs": [{"name": "", "type": "bool"}],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {"name": "_owner", "type": "address"},
      {"name": "_spender", "type": "address"}
    ],
    "name": "allowance",
    "outputs": [{"name": "", "type": "uint256"}],
    "type": "function"
  }
] as const;

export const useTokenBalance = (tokenAddress: string) => {
  const { address } = useAccount();
  const queryClient = useQueryClient();
  const [balance, setBalance] = useState<string>('0');

  const { data: balanceData, refetch } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: IERC20_ABI,
    functionName: 'balanceOf',
    args: [address as `0x${string}`],
  });

  const { writeContract: approve, isPending: isApproving } = useWriteContract();

  const handleApprove = async (spender: string, amount: string) => {
    try {
      await approve({
        address: tokenAddress as `0x${string}`,
        abi: IERC20_ABI,
        functionName: 'approve',
        args: [spender as `0x${string}`, parseEther(amount)],
      });
      await refetch();
      // Invalidate related queries
      await queryClient.invalidateQueries({ queryKey: ['tokenBalance', address, tokenAddress] });
    } catch (error) {
      console.error('Token approval failed:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (balanceData) {
      setBalance(formatEther(balanceData as bigint));
    }
  }, [balanceData]);

  // Add refetch to interval to keep balance updated
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, [refetch]);

  return { balance, handleApprove, isApproving, refetch };
}; 