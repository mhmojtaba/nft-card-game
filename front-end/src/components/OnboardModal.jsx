import { useState, useEffect } from "react";
import Modal from "react-modal";

import styles from "../styles";
import { CustomButton } from ".";
import { useGlobalContext } from "../context";
import { GetParams, SwitchNetwork } from "../utils/onboard.js";

const OnboardModal = () => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const { updateCurrentWalletAddress } = useGlobalContext();
  const [step, setStep] = useState(-1);

  async function resetParams() {
    const currentStep = await GetParams();
    setStep(currentStep.step);
    setIsOpen(currentStep.step !== -1);
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    resetParams();

    window?.ethereum?.on("chainChanged", () => {
      resetParams();
    });

    window?.ethereum?.on("accountsChanged", () => {
      resetParams();
    });
  }, []);

  const generateStep = (st) => {
    switch (st) {
      case 0:
        return (
          <>
            <p className={styles.modalText}>
              You don&apos;t have Core Wallet installed!
            </p>
            <CustomButton
              title="Download Core"
              clickHandler={() => window.open("https://core.app/", "_blank")}
            />
          </>
        );

      case 1:
        return (
          <>
            <p className={styles.modalText}>
              You haven&apos;t connected your account to Core Wallet!
            </p>
            <CustomButton
              title="Connect Account"
              clickHandler={updateCurrentWalletAddress}
            />
          </>
        );

      case 2:
        return (
          <>
            <p className={styles.modalText}>
              You&apos;re on a different network. Switch to Fuji C-Chain.
            </p>
            <CustomButton title="Switch" clickHandler={SwitchNetwork} />
          </>
        );

      case 3:
        return (
          <>
            <p className={styles.modalText}>
              Oops, you don&apos;t have AVAX tokens in your account
            </p>
            <CustomButton
              title="Grab some test tokens"
              clickHandler={(e) => {
                e.preventDefault();
                window.open("https://faucet.avax.network/", "_blank");
              }}
            />
          </>
        );

      default:
        return <p className={styles.modalText}>Good to go!</p>;
    }
  };

  return (
    <Modal
      isOpen={modalIsOpen}
      className={`absolute z-50 inset-0 ${styles.flexCenter} flex-col ${styles.glassEffect}`}
      overlayClassName="Overlay"
    >
      {generateStep(step)}
    </Modal>
  );
};

export default OnboardModal;
