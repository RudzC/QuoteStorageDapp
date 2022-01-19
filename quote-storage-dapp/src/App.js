import './App.css';
import { useState, useEffect } from 'react';
import { ethers, utils } from "ethers";
import abi from "./contracts/QuoteStorage.json";
function App() {
    const [isWalletConnected, setIsWalletConnected] = useState(false);
    const [isOwner, setIsOwner] = useState(false);
    const [inputValue, setInputValue] = useState({
        quoteId: "" ,author: "", quoteText: "", donate: "", quoteDeleteId: "", quoteCompleteId: ""});
    const [ownerAddress, setOwnerAddress] = useState(null);
    const [quoteCount, setQuoteCount] = useState(null);
    const [currentQuote, setCurrentQuote] = useState({});
    const [totalDonations, setTotalDonations] = useState(null);
    const [customerAddress, setCustomerAddress] = useState(null);
    const [error, setError] = useState(null);
    const contractAddress = "0x7F25AF0776cA2DF6fAffBA0329EB3853c377D574";
    const contractABI = abi.abi;

    const checkIfWalletIsConnected = async () => {
        try {
            if (window.ethereum) {
                const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
                const account = accounts[0];
                setIsWalletConnected(true);
                setCustomerAddress(account);
                console.log("Account connected: ", account);
            } else {
                setError("Please install metamask wallet to use our page.");
                console.log("No metamask detected");
            }
        } catch (error) {
            console.log(error);
        }
    }

    const getContractOwnerHandler = async () => {
        try {
            if (window.ethereum) {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                const quoteContract = new ethers.Contract(contractAddress, contractABI, signer);

                let owner = await quoteContract.owner();
                setOwnerAddress(owner);

                const [account] = await window.ethereum.request({method: 'eth_requestAccounts'});
                if (owner.toLowerCase() === account.toLowerCase()) {
                    setIsOwner(true);
                }
            } else {
                console.log("Ethereum object not found, install metamask");
                setError("Please install a MetaMask wallet to use our page.");
            }
        } catch (error) {
            console.log(error);
        }
    }
    const websiteDonationsHandler = async () => {
        try {
            if (window.ethereum) {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                const quoteContract = new ethers.Contract(contractAddress, contractABI, signer);

                let totalDonations = await quoteContract.getTotalDonations();
                setTotalDonations(utils.formatEther(totalDonations));

                console.log("Retrieved totalDonations...", totalDonations);
            } else {
                console.log("Ethereum object not found, install metamask");
                setError("Please install a MetaMask wallet to use our page.");
            }
        } catch (error) {
            console.log(error);
        }
    }

    const getQuote = async (event) => {
        event.preventDefault();
        try {
            if (window.ethereum) {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                const quoteContract = new ethers.Contract(contractAddress, contractABI, signer);

                const lastQuote = await quoteContract.getQuote(inputValue.quoteId);
                setCurrentQuote({
                    author: lastQuote[0],
                    quoteText: lastQuote[1]
                });
                inputValue.reset = "";
            } else {
                console.log("Ethereum object not found, install metamask");
                setError("Please install a MetaMask wallet to use our bank.");
            }
        } catch (error) {
            console.log(error);
        }
    }

    const getCurrentCount = async () => {
        try {
            if (window.ethereum) {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                const quoteContract = new ethers.Contract(contractAddress, contractABI, signer);

                const currentQuoteCountInEther = await quoteContract.getQuoteCount();
                setQuoteCount(utils.formatEther(currentQuoteCountInEther));
            } else {
                console.log("Ethereum object not found, install metamask");
                setError("Please install a MetaMask wallet to use our bank.");
            }
        } catch (error) {
            console.log(error);
        }
    }

    const setQuoteHandler = async (event) => {
        event.preventDefault();
        try {
            if (window.ethereum) {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                const quoteContract = new ethers.Contract(contractAddress, contractABI, signer);

                const txn = await quoteContract.createQuote(
                    inputValue.author,
                    inputValue.quoteText,
                );
                console.log("Creating new quote...");
                await txn.wait();
                console.log("Quote created!", txn.hash);
                await getCurrentCount();
            } else {
                console.log("Ethereum object not found, install metamask");
                setError("Please install a MetaMask wallet to use our bank.");
            }
        } catch (error) {
            console.log(error);
        }
    }

    const completeQuote = async (event) => {
        event.preventDefault();
        try {
            if (window.ethereum) {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                const quoteContract = new ethers.Contract(contractAddress, contractABI, signer);

                const txn = await quoteContract.toggleCompleted(inputValue.quoteCompleteId);
                console.log("Completing quote...");
                await txn.wait();
                console.log("Quote completed!", txn.hash);
                await getCurrentCount();
                inputValue.quoteId = "";
            } else {
                console.log("Ethereum object not found, install metamask");
                setError("Please install a MetaMask wallet to use our bank.");
            }
        } catch (error) {
            console.log(error);
        }
    }

    const deleteQuote = async (event) => {
        event.preventDefault();
        try {
            if (window.ethereum) {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                const quoteContract = new ethers.Contract(contractAddress, contractABI, signer);

                const txn = await quoteContract.deleteQuote(inputValue.quoteDeleteId);
                console.log("Deleting quote...");
                await txn.wait();
                console.log("Quote deleted...", txn.hash);
                inputValue.quoteId = "";
            } else {
                console.log("Ethereum object not found, install metamask");
                setError("Please install a MetaMask wallet to use our bank.");
            }
        } catch (error) {
            console.log(error);
        }
    }

    const donationMoneyHandler = async (event) => {
        try {
            event.preventDefault();
            if (window.ethereum) {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                const quoteContract = new ethers.Contract(contractAddress, contractABI, signer);

                const txn = await quoteContract.donate({value: ethers.utils.parseEther(inputValue.donate)});
                console.log("Donating Money...");
                await txn.wait();
                console.log("Donation for money... done", txn.hash);

                await websiteDonationsHandler();
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleInputChange = (event) => {
        setInputValue(prevFormData => ({ ...prevFormData, [event.target.name]: event.target.value }));
    }
    useEffect( () => {
        checkIfWalletIsConnected();
        getContractOwnerHandler();
        websiteDonationsHandler();
        getCurrentCount();
    }, [isWalletConnected])
  return (
      <main className="main-container">
          <h2 className="headline"><span className="headline-gradient"> Quote Storage Contract</span> 💾</h2>
          <section className="app-section">
              <h2 className="text-xl border-b-2 border-indigo-500 px-10 py-4 font-bold">Enter Your Quote Here</h2>
              <div className="p-10">
                  <form className="form-style">
                      <input
                          type="text"
                          className="input-style"
                          onChange={handleInputChange}
                          name="author"
                          placeholder="Who does this quote belong to?"
                          value={inputValue.author}
                      />
                      <input
                          type="text"
                          className="input-style"
                          onChange={handleInputChange}
                          name="quoteText"
                          placeholder="Quote you would like to forever store..."
                          value={inputValue.quoteText}
                      />
                      <button
                          className="btn-grey"
                          onClick={setQuoteHandler}>
                          Set Quote
                      </button>
                  </form>
                  <div className="mt-5">
                      <p><span className="font-bold">Current Quote Count In ETH ð: </span>{quoteCount}</p>
                  </div>
              </div>
          </section>
          <section className="app-section">
              <h2 className="text-xl border-b-2 border-indigo-500 px-10 py-4 font-bold">Get Your Quote Here</h2>
              <div className="p-10">
                  <form className="form-style">
                      <input
                          type="text"
                          className="input-style"
                          onChange={handleInputChange}
                          name="quoteId"
                          placeholder="What quote you would like to see try # 1 to be amazed!"
                          value={inputValue.quoteId}
                      />
                      <button
                          className="btn-grey"
                          onClick={getQuote}>
                          Get Quote
                      </button>
                  </form>
              </div>
              <div className="mt-5">
                  <p><span className="font-bold">Author: </span>{currentQuote.author}</p>
                  <p><span className="font-bold">Quote: </span>{currentQuote.quoteText}</p>
              </div>
          </section>
          <section className="customer-section px-10 pt-5 pb-10">
              <h2 className="text-xl border-b-2 border-indigo-500 px-10 py-4 font-bold">I Have run out of gas for my car! 🚗</h2>
              {error && <p className="text-2xl text-red-700">{error}</p>}

              <div className="mt-7 mb-9">
                  <form className="form-style">
                      <input
                          type="text"
                          className="input-style"
                          onChange={handleInputChange}
                          name="donate"
                          placeholder="0.0000 ETH"
                          value={inputValue.donate}
                      />
                      <button
                          className="btn-purple"
                          onClick={donationMoneyHandler}>Donate Gas ⛽</button>
                  </form>
              </div>
              <div className="mt-5">
                  <p><span className="font-bold">Total Donation Balance: </span>{totalDonations}</p>
              </div>
              <div className="mt-5">
                  <p><span className="font-bold">Contract Owner Address: </span>{ownerAddress}</p>
              </div>
              <div className="mt-5">
                  {isWalletConnected && <p><span className="font-bold">Your Wallet Address: </span>{customerAddress}</p>}
                  <button className="btn-connect" onClick={checkIfWalletIsConnected}>
                      {isWalletConnected ? "Wallet Connected 🔒" : "Connect Wallet 🔑"}
                  </button>
              </div>
          </section>

          {
              isOwner && (
                  <section className="app-section">
                      <h2 className="text-xl border-b-2 border-indigo-500 px-10 py-4 font-bold">Quote Contract Admin Panel</h2>
                      <div className="mt-5">
                          <p><span className="font-bold">Complete Quote</span></p>
                      </div>
                      <div className="p-10">
                          <form className="form-style">
                              <input
                                  type="text"
                                  className="input-style"
                                  onChange={handleInputChange}
                                  name="quoteCompleteId"
                                  placeholder="ID number"
                                  value={inputValue.quoteCompleteId}
                              />
                              <button
                                  className="btn-grey"
                                  onClick={completeQuote}>
                                  Complete Quote
                              </button>
                          </form>
                      </div>
                      <div className="mt-5">
                          <p><span className="font-bold">Delete Quote</span></p>
                      </div>
                      <div className="p-10">
                          <form className="form-style">
                              <input
                                  type="text"
                                  className="input-style"
                                  onChange={handleInputChange}
                                  name="quoteDeleteId"
                                  placeholder="ID number"
                                  value={inputValue.quoteDeleteId}
                              />
                              <button
                                  className="btn-grey"
                                  onClick={deleteQuote}>
                                  Delete Quote
                              </button>
                          </form>
                      </div>
                  </section>
              )
          }
      </main>
  );
}

export default App;
