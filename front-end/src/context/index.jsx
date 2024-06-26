/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import { useState, useEffect, createContext, useContext, useRef } from "react";
import { ethers } from "ethers";
import Web3modal from "web3modal";
import { ABI, ADDRESS } from "../contract";
import toast from "react-hot-toast";
import { createEventsListeners } from "./eventListeners";
import { useNavigate } from "react-router-dom";
import { GetParams } from "../utils/onboard";

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
  const [battleGround, setBattleGround] = useState("bg-astral");
  const [step, setStep] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");

  const player1Ref = useRef();
  const player2Ref = useRef();

  const navigate = useNavigate();

  /// reset onboard modal
  useEffect(() => {
    const resetParams = async () => {
      const currentStep = await GetParams();
      setStep(currentStep.step);
    };

    resetParams();

    window?.ethereum?.on("accountsChanged", () => resetParams());
    window?.ethereum?.on("chainChanged", () => resetParams());
  }, []);

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
    const currentBattleGround = localStorage.getItem("battleGround");
    if (currentBattleGround) {
      setBattleGround(currentBattleGround);
    } else {
      localStorage.setItem("battleGround", battleGround);
    }
  }, []);

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
    if (step !== -1 && contract) {
      createEventsListeners({
        navigate,
        contract,
        provider,
        walletAddress,
        setUpdateGameData,
        player1Ref,
        player2Ref,
      });
    }
  }, [contract, step]);

  /// handle errors
  useEffect(() => {
    if (errorMessage) {
      const parsedErrorMessage = errorMessage?.reason
        ?.slice("execution reverted ".length)
        .slice(0, -1);
      if (parsedErrorMessage) {
        toast.error(parsedErrorMessage);
      }
    }
  }, [errorMessage]);

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
        battleGround,
        setBattleGround,
        errorMessage,
        setErrorMessage,
        player1Ref,
        player2Ref,
        updateWalletAddress,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
