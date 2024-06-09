/* eslint-disable no-unused-vars */
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
  const [battleName, setBattleName] = useState("");
  const [gameData, setGameData] = useState({
    players: [],
    pendingBattles: [],
    activeBattle: null,
  });
  const [updateGameData, setUpdateGameData] = useState(0);

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

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
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

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setSmartContract();
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (contract) {
      createEventsListeners({
        navigate,
        contract,
        provider,
        walletAddress,
        setUpdateGameData,
      });
    }
  }, [contract]);

  //* set the game data
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    //fetching game data
    const getGameData = async () => {
      const fetchBattles = await contract.getAllBattles();
      const pendingBattles = fetchBattles.filter(
        (battle) => battle.battleStatus === 0
      );
      let activeBattle = null;
      // biome-ignore lint/complexity/noForEach: <explanation>
      fetchBattles.forEach((battle) => {
        //
        if (
          battle.players.find(
            (player) =>
              player.toLowerCase() === walletAddress.toLocaleLowerCase()
          )
        ) {
          if (battle.winner.startsWith("0x000")) {
            activeBattle = battle;
          }
        }
      });
      fetchBattles &&
        setGameData({ pendingBattles: pendingBattles.slice(1), activeBattle });
    };

    if (contract) getGameData();
  }, [contract, updateGameData]);

  return (
    <GlobalContext.Provider
      value={{
        walletAddress,
        contract,
        battleName,
        setBattleName,
        gameData,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
