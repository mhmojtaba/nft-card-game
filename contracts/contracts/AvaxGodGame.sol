// SPDX-License-Identifier: MIT

pragma solidity ^0.8.16;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";

/// @author this contract handle token management and logics for game
/// @author Mojtaba.web3


contract AVAXGodsGame {
    string public baseURI; // baseURI where token metadata is stored
    uint256 public totalSupply; // Total number of tokens minted
    uint256 public constant DEVIL = 0;
    uint256 public constant GRIFFIN = 1;
    uint256 public constant FIREBIRD = 2;
    uint256 public constant KAMO = 3;
    uint256 public constant KUKULKAN = 4;
    uint256 public constant CELESTION = 5;

    uint256 public constant MAX_ATTACK_DEFEND_STRENGTH = 10;

    enum BattleStatus {
        PENDING,
        STARTED,
        ENDED 
    }


    /// store player token info
    struct GameToken{
        string name; // define by user
        uint256 id; // make randonly
        uint256 attackStrength; // generated randomly
        uint256 defenseStrength; // generated randomly
    }

    /// store player info
    struct Player{
        address playerAddress; // player wallet address
        string playerName; // set by player
        uint256 playerMana;
        uint256 playerHelth;
        bool inBattle;
    }

    /// store battle info
    struct Battle{
        BattleStatus battleStatus;
        bytes32 battleHash; // hash of battle name
        string name; // battle name
        address[2] battle; // players in the battle
        uint8[2] move;
        address winner;
    }


    // mappings
    mapping (address=>uint256) public playerInfo;
    mapping (address=>uint256) public playerTokenInfo;
    mapping (string=>uint256) battleInfo;

    Player[] public players; // arrays of players
    GameToken[] public gameTokens; // arrays of game tokens
    Battle[] public battles; // arrays of battles

    // checking if player is exist
    function isPlayer(address _playerAddress) public view returns (bool) {
        if (playerInfo[_playerAddress] == 0 ) {
            return false;
        } else {
            return true;
        }
    }

    // getting player
    function getPlayer(address _playerAddress) view public returns (Player memory) {
        require(isPlayer(_playerAddress), "player does not exist!");
        return players[playerInfo[_playerAddress]]
    }

    // getting all players
    function getAllplayer() view public returns (Player[] memory) {
        return players;
    }

    // checking player token
    function isPlayerToken(address _address) view public returns (bool) {
         if (playerTokenInfo[_address] == 0 ) {
            return false;
        } else {
            return true;
        }
    }

    /// getting player token
    function getPlayerToken(address _address) view public returns (GameToken[] memory) {
        require(isPlayerToken(_address), "player does not exist!");
        return gameTokens[playerTokenInfo[_address]]
    }

    /// getting all game tokens
    function getAllTokens() view public returns (GameToken[] memory) {
        return gameTokens;
    }

    /// Battle checker
    function isBattle(string memory _name) public view returns (bool) {
        if (battleInfo[_name] == 0) {
            return false;
        } else {
            return true;
        }
    }

    /// get battle
    function getBattle(
        string memory _name
    ) public view returns (Battle memory) {
        require(isBattle(_name), "Battle doesn't exist!");
        return battles[battleInfo[_name]];
    }

    /// getting all battles
    function getAllBattles() public view returns (Battle[] memory) {
        return battles;
    }

    /// updating battle info
    function updateBattle
    (string memory _name,Battle memory _newBattle) 
    private {
        require(isBattle(_name), "Battle doesn't exist");
        battles[battleInfo[_name]] = _newBattle;
    }

    // events
}