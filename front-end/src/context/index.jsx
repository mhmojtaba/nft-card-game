/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import { useState, useRef, useEffect, createContext, useContext } from "react";
import { ethers } from "ethers";
import Web3modal from "web3modal";
import { useNavigate } from "react-router-dom";
import { ABI, ADDRESS } from "../contract";

const GlobalContext = createContext();

export const GlobalContextProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState("");
  const [provider, setProvider] = useState("");
  const [contract, setContract] = useState("");

  // * set the wallet address
  const updateWalletAddress = async () => {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log(accounts);
      accounts && setWalletAddress(accounts[0]);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    updateWalletAddress();

    window.ethereum.on("accountsChanged", updateWalletAddress);
  }, []);

  //* set the contract
  useEffect(() => {
    const setSmartContract = async () => {
      const web3modal = new Web3modal();
      const connection = await web3modal.connect();
      const newProvider = new ethers.providers.Web3Provider(connection);
      const newSigner = newProvider.getSigner();

      const newContract = new ethers.Contract(ADDRESS, ABI, newSigner);
      console.log(newContract);
      setContract(newContract);
      setProvider(newProvider);
      console.log(provider);
    };

    setSmartContract();
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        walletAddress,
        contract,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
