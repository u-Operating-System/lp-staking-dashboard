'use client';

import { useCallback } from 'react';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { parseEther } from 'viem';
import { ERC20_ABI } from '@/config/contracts';

export const useTokenAllowance = (tokenAddress: string, spenderAddress: string) => {
  const { address } = useAccount();

  const { data: allowanceData } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: address ? [address, spenderAddress as `0x${string}`] : undefined,
  }) as { data: bigint | undefined };

  const { writeContract: approveToken, isPending: isApproving } = useWriteContract();

  const approve = useCallback(async () => {
    if (!address) return;
    await approveToken({
      address: tokenAddress as `0x${string}`,
      abi: ERC20_ABI,
      functionName: 'approve',
      args: [spenderAddress as `0x${string}`, parseEther('1000000000')], // Approve a large amount
    });
  }, [address, approveToken, tokenAddress, spenderAddress]);

  return {
    allowance: allowanceData || BigInt(0),
    approve,
    isApproving,
  };
}; 