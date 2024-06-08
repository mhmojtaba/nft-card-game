/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import { useState, useEffect, createContext, useContext } from "react";
import { ethers } from "ethers";
import Web3modal from "web3modal";
import { ABI, ADDRESS } from "../contract";
import toast from "react-hot-toast";
import { createEventsListeners } from "./eventListeners";
import { useNavigate } from "react-router-dom";

const GlobalContext = createContext();

export const GlobalContextProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState("");
  const [provider, setProvider] = useState("");
  const [contract, setContract] = useState("");
  const navigate = useNavigate();

  // * set the wallet address
  const updateWalletAddress = async () => {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log(accounts);
      accounts && setWalletAddress(accounts[0]);
    } catch (error) {
      console.log(error?.message);
      toast.error(error?.message);
    }
  };

  useEffect(() => {
    updateWalletAddress();

    window.ethereum.on("accountsChanged", updateWalletAddress);
  }, []);

  //* set the contract

  const setSmartContract = async () => {
    const web3modal = new Web3modal();
    const connection = await web3modal.connect();
    console.log(connection);

    const newProvider = new ethers.providers.Web3Provider(window.ethereum);
    const newSigner = newProvider.getSigner();

    const newContract = new ethers.Contract(ADDRESS, ABI, newSigner);
    console.log(newContract);
    setContract(newContract);
    setProvider(newProvider);
    console.log(provider);
  };

  useEffect(() => {
    setSmartContract();
  }, []);

  useEffect(() => {
    if (contract) {
      createEventsListeners({
        navigate,
        contract,
        provider,
        walletAddress,
      });
    }
  }, [contract]);

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
