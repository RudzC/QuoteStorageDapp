// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract QuoteStorage {
    address public owner;
    uint public quoteCount = 0;
    mapping(uint => Quote) public quotes;

    uint public totalDonations = 0;

    struct Quote {
        uint id;
        string author;
        string quoteText;
        bool completed;
        bool exists;
    }

    event QuoteCreated(
        uint id,
        string author,
        string quoteText,
        bool completed
    );

    event QuoteDeleted(
        uint id,
        string author,
        string quoteText,
        bool completed
    );

    event QuoteCompleted(
        uint id,
        bool completed
    );

    constructor() {
        owner = msg.sender;
        createQuote("Snoop Doggy Dogg", "If you stop at general math, you're only going to make general math money.");
    }

    function getQuoteCount() public view returns(uint) {
        return quoteCount;
    }

    function getQuote(uint _index) public view returns(string memory, string memory) {
        Quote storage myQuote = quotes[_index];
        return (myQuote.author, myQuote.quoteText);
    }

    function createQuote(string memory _author, string memory _quoteText) public {
        quoteCount ++;
        quotes[quoteCount] = Quote(quoteCount, _author, _quoteText, true, true);
        emit QuoteCreated(quoteCount, _author, _quoteText, false);
    }

    function toggleCompleted(uint _id) public {
        require(
            msg.sender == owner,
            "You must be the owner of the contract to delete a quote!"
        );
        require(quotes[_id].exists, "Quote does not exist");
        quotes[_id].completed = !quotes[_id].completed;
        emit QuoteCompleted(_id, quotes[_id].completed);
    }


    function deleteQuote(uint _id) public {
        require(
            msg.sender == owner,
            "You must be the owner of the contract to delete a quote!"
        );
        quotes[_id].author = "LongGone";
        quotes[_id].quoteText = "QuoteDeletedByContractOwner";
        quotes[_id].completed = false;
        quotes[_id].exists = false;
        emit QuoteDeleted(_id, quotes[_id].author, quotes[_id].quoteText, quotes[_id].completed);
    }

    function donate() public payable {
        require(msg.value != 0, "You need to donate a certain amount of money!");
        (bool success,) = owner.call{value: msg.value}("");
        require(success, "Failed to send money");
        totalDonations = totalDonations + msg.value;
    }

    function getTotalDonations() public view returns(uint) {
        return totalDonations;
    }

}
