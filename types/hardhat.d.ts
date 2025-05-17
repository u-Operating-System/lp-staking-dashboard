import { HardhatRuntimeEnvironment } from "hardhat/types";
import { ethers } from "ethers";

declare module "hardhat/types" {
  interface HardhatRuntimeEnvironment {
    ethers: {
      getContractFactory: (name: string) => Promise<any>;
      provider: ethers.Provider;
      signer: ethers.Signer;
    };
  }
} 