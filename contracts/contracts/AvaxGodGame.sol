// SPDX-License-Identifier: MIT

pragma solidity ^0.8.16;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";

/// @author this contract handle token management and logics for game
/// @author powered by Mojtaba.web3


contract AVAXGodsGame is ERC1155, Ownable, ERC1155Supply{
    string public baseURI; // baseURI where token metadata is stored
    uint256 public __totalSupply; // Total number of tokens minted
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
        uint256 playerHealth;
        bool inBattle;
    }

    /// store battle info
    struct Battle{
        BattleStatus battleStatus;
        bytes32 battleHash; // hash of battle name
        string name; // battle name
        address[2] players; // players in the battle
        uint8[2] moves;
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
        return players[playerInfo[_playerAddress]];
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
        return gameTokens[playerTokenInfo[_address]];
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
    /// new player event
    event NewPlayer(address indexed owner, string name);

    /// new battle event
    event NewBattle(
        string battleName,
        address indexed player1,
        address indexed player2
    );

    /// battle end event
    event BattleEnded(
        string battleName,
        address indexed winner,
        address indexed loser
    );

    /// battle move event
    event BattleMove(string indexed battleName, bool indexed isFirstMove);

    /// new game token evevnt
    event NewGameToken(
        address indexed owner,
        uint256 id,
        uint256 attackStrength,
        uint256 defenseStrength
    );

    /// ending round event
    event RoundEnded(address[2] damagedPlayers);

    /// contract  constructor
    constructor(string memory _metadataURI) ERC1155(_metadataURI){
        // set base URI
        baseURI = _metadataURI;
        initialize();
    }

    // 
    function setURI(string memory newuri) public onlyOwner() {
        _setURI(newuri);
    }

    // initializing the game
    function initialize() private {
        gameTokens.push(GameToken("",0,0,0));
        players.push(Player(address(0), "", 0, 0, false));
        battles.push(
            Battle(
                BattleStatus.PENDING,
                bytes32(0),
                "",
                [address(0), address(0)],
                [0, 0],
                address(0)
            )
        );
    }

    /// register a player
    function registerPlayer(string memory _name , string memory _gameTokenName) external {
        require(!isPlayer(_msgSender()), "player already registered");
        uint256 _id = players.length;
        players.push(Player( msg.sender ,_name,10, 25,false));
        playerInfo[_msgSender()] = _id;

        _createRandomGameToken(_gameTokenName);

        emit NewPlayer(_msgSender(), _name);
        
    }

    /// creating random number
    function _createRandomNumber(
        uint256 _max,
        address _sender
        ) view internal returns (uint256) {
        uint256 random = uint256(
            keccak256(abi.encodePacked(block.difficulty , block.timestamp , _sender))
        );

        uint256 randomValue = random % _max;
        if (randomValue == 0) {
            randomValue = _max / 2;
        }

        return randomValue;
    }

    // creating Game token internal
    function _createGameToken(string memory _name) internal returns (GameToken memory) {
        uint256 randAttackStrength = _createRandomNumber(MAX_ATTACK_DEFEND_STRENGTH, _msgSender());

        uint256 randDefenseStrength = MAX_ATTACK_DEFEND_STRENGTH - randAttackStrength;

        uint256 randomId = uint8(
            uint256(keccak256(abi.encodePacked(block.timestamp , msg.sender))) %100
        );

        randomId = randomId % 6;
        if (randomId == 0) {
            randomId++;
        }

        GameToken memory gameTokenNew = GameToken( _name , randomId , randAttackStrength , randDefenseStrength);
        uint256 _id = gameTokens.length;
        gameTokens.push(gameTokenNew);
        playerTokenInfo[_msgSender()] = _id;

        _mint(_msgSender(), randomId, 1, "0x0");

        __totalSupply++;

        NewGameToken(_msgSender(), randomId, randAttackStrength, randDefenseStrength);

        return gameTokenNew;
    }

    // creating new game token
    function _createRandomGameToken(string memory _name) public {
        require(!getPlayer(_msgSender()).inBattle, "player is in a battle!");
        require(isPlayer(_msgSender()), "Player has not registered yet!");

        _createGameToken(_name);
    }

    // getting total supply
    function getTotalSupply() view external returns (uint256) {
        return __totalSupply;
    }

    /// creating a battle
    function createBattle(string memory _name)
    external returns(Battle memory) {
        // checking if player has registered or not
         require(isPlayer(_msgSender()), "Player has not registered yet!");
         require(isBattle(_name), "battle already exists");
        
        bytes32 battleHash = keccak256(abi.encode(_name));

        Battle memory _battle = Battle(
           BattleStatus.PENDING, // battle status set to pending
            battleHash, // hash of battle name
            _name, // battle name
            [_msgSender() , address(0)], // players in the battle. player 2 is temporary empty until a player joins
            [0,0],
            address(0) // winner address; empty until battle ends
        );

        uint256 _id = battles.length;
        battleInfo[_name] = _id;
        battles.push(_battle);

        return _battle;
    }

    function joinBattle(string memory _name) external returns (Battle memory) {
        Battle memory _battle = getBattle(_name);

        require(_battle.battleStatus == BattleStatus.PENDING, "battle already started!!!");
        require(_battle.players[0] != msg.sender, "Only player two can join a battle");
        require(!getPlayer(msg.sender).inBattle, "player already in battle");

        _battle.battleStatus = BattleStatus.STARTED;
        _battle.players[1] = msg.sender;
        updateBattle(_name , _battle);

        players[playerInfo[_battle.players[0]]].inBattle = true;
        players[playerInfo[_battle.players[1]]].inBattle = true;

        emit NewBattle(_battle.name ,_battle.players[0], msg.sender );

        return _battle;
    }

    // getting battle moves
    function getBattleMoves(string memory _name) view public returns (uint256 , uint256 ) {
        Battle memory _battle = getBattle(_name);
        return (_battle.moves[0], _battle.moves[1]);
    }

    // setting player move
    function _setPlayerMove(
        string memory _name,
        uint8 _choice,
        uint256 _player
    ) internal{
        require(
            _choice == 1 || _choice == 2,
            "Choice should be either 1 or 2!"
        );

        require(
            _choice == 1 ? getPlayer(msg.sender).playerMana >= 3 : true,
            "Mana not sufficient for attacking!"
        );
        battles[battleInfo[_name]].moves[_player] = _choice;
    }

    // User chooses attack or defense move for battle
    function attackOrDefendChoice(string memory _name , uint8 _choice) external {
        Battle memory _battle = getBattle(_name);
        require(_battle.battleStatus == BattleStatus.STARTED, "battle not started yet!!!");
        require(_battle.battleStatus == BattleStatus.ENDED, "battle had already ended!!!");
        require(msg.sender == _battle.players[0] || msg.sender == _battle.players[1], "you must be in battle");
        require(
            _battle.moves[_battle.players[0] == msg.sender ? 0 : 1] == 0,
            "You have already made a move!"
        );

        _setPlayerMove(
            _name,
            _choice,
            _battle.players[0] == msg.sender ? 0 : 1
        );

        _battle  = getBattle(_name);
        uint _movesLeft = 2 -
            (_battle.moves[0] == 0 ? 0 : 1) -
            (_battle.moves[1] == 0 ? 0 : 1);
        
        emit BattleMove(_name , _movesLeft == 1 ? true : false);

        if(_movesLeft == 0){
            _awaitBattleResult(_name);
        }

    }

    // Awaits battle results
    function _awaitBattleResult(string memory _name) internal {
        Battle memory _battle = getBattle(_name);

        require(
            msg.sender == _battle.players[0] ||
                msg.sender == _battle.players[1],
            "Only players in this battle can make a move"
        );
        require(
            _battle.moves[0] != 0 && _battle.moves[1] != 0
            ,
             "Players must make a move");
        _resolveBattle(_battle);

    }


    /// Resolve battle function to determine winner and loser of battle
    struct P{
        uint256 index;
        uint256 move;
        uint256 health;
        uint256 attack;
        uint256 defense;
    }

    // detemining the winner and loser of the battle
    function _resolveBattle(Battle memory _battle) internal {
        P memory p1 = P(
            playerInfo[_battle.players[0]],
            _battle.moves[0],
            getPlayer(_battle.players[0]).playerHealth,
            getPlayerToken(_battle.players[0]).attackStrength,
            getPlayerToken(_battle.players[0]).defenseStrength
        );

        P memory p2 = P(
            playerInfo[_battle.players[1]],
            _battle.moves[1],
            getPlayer(_battle.players[1]).playerHealth,
            getPlayerToken(_battle.players[1]).attackStrength,
            getPlayerToken(_battle.players[1]).defenseStrength
        );

        address[2] memory _damagedPlayers = [address(0), address(0)];
        
        if (p1.move == 1 && p2.move == 1) {
            if (p1.attack >= p2.health) {
                _endBattle(_battle.players[0], _battle);
            } else if (p2.attack >= p1.health) {
                _endBattle(_battle.players[1], _battle);
            } else {
                players[p1.index].playerHealth -= p2.attack;
                players[p2.index].playerHealth -= p1.attack;

                players[p1.index].playerMana -= 3;
                players[p2.index].playerMana -= 3;

                // Both player's health damaged
                _damagedPlayers = _battle.players;
            }
        } else if (p1.move == 1 && p2.move == 2) {
            uint256 PHAD = p2.health + p2.defense;
            if (p1.attack >= PHAD) {
                _endBattle(_battle.players[0], _battle);
            } else {
                uint256 healthAfterAttack;

                if (p2.defense > p1.attack) {
                    healthAfterAttack = p2.health;
                } else {
                    healthAfterAttack = PHAD - p1.attack;

                    // Player 2 health damaged
                    _damagedPlayers[0] = _battle.players[1];
                }

                players[p2.index].playerHealth = healthAfterAttack;

                players[p1.index].playerMana -= 3;
                players[p2.index].playerMana += 3;
            }
        } else if (p1.move == 2 && p2.move == 1) {
            uint256 PHAD = p1.health + p1.defense;
            if (p2.attack >= PHAD) {
                _endBattle(_battle.players[1], _battle);
            } else {
                uint256 healthAfterAttack;

                if (p1.defense > p2.attack) {
                    healthAfterAttack = p1.health;
                } else {
                    healthAfterAttack = PHAD - p2.attack;

                    // Player 1 health damaged
                    _damagedPlayers[0] = _battle.players[0];
                }

                players[p1.index].playerHealth = healthAfterAttack;

                players[p1.index].playerMana += 3;
                players[p2.index].playerMana -= 3;
            }
        } else if (p1.move == 2 && p2.move == 2) {
            players[p1.index].playerMana += 3;
            players[p2.index].playerMana += 3;
        }

        emit RoundEnded(_damagedPlayers);

        // Reset moves to 0
        _battle.moves[0] = 0;
        _battle.moves[1] = 0;
        updateBattle(_battle.name, _battle);

        // Reset random attack and defense strength
        uint256 _randomAttackStrengthPlayer1 = _createRandomNumber(
            MAX_ATTACK_DEFEND_STRENGTH,
            _battle.players[0]
        );
        gameTokens[playerTokenInfo[_battle.players[0]]]
            .attackStrength = _randomAttackStrengthPlayer1;
        gameTokens[playerTokenInfo[_battle.players[0]]].defenseStrength =
            MAX_ATTACK_DEFEND_STRENGTH -
            _randomAttackStrengthPlayer1;

        uint256 _randomAttackStrengthPlayer2 = _createRandomNumber(
            MAX_ATTACK_DEFEND_STRENGTH,
            _battle.players[1]
        );
        gameTokens[playerTokenInfo[_battle.players[1]]]
            .attackStrength = _randomAttackStrengthPlayer2;
        gameTokens[playerTokenInfo[_battle.players[1]]].defenseStrength =
            MAX_ATTACK_DEFEND_STRENGTH -
            _randomAttackStrengthPlayer2;
    }

    ///  end the battle


    function quitBattle(string memory _name) public {
        Battle memory battle = getBattle(_name);

        require(battle.players[0] == msg.sender || battle.players[1] == msg.sender , "You're not in the battle");

        battle.players[0] == msg.sender ? _endBattle( battle.players[1] , _name) : _endBattle( battle.players[0] , _name);
    }

    function _endBattle(
        address battleEnder,
        Battle memory _battle
    ) internal returns (Battle memory) {
        require(
            _battle.battleStatus != BattleStatus.ENDED,
            "Battle already ended"
        ); // Require that battle has not ended

        _battle.battleStatus = BattleStatus.ENDED;
        _battle.winner = battleEnder;
        updateBattle(_battle.name, _battle);

        uint p1 = playerInfo[_battle.players[0]];
        uint p2 = playerInfo[_battle.players[1]];

        players[p1].inBattle = false;
        players[p1].playerHealth = 25;
        players[p1].playerMana = 10;

        players[p2].inBattle = false;
        players[p2].playerHealth = 25;
        players[p2].playerMana = 10;

        address _battleLoser = battleEnder == _battle.players[0]
            ? _battle.players[1]
            : _battle.players[0];

        emit BattleEnded(_battle.name, battleEnder, _battleLoser); // Emits BattleEnded event

        return _battle;
    }

    // Turns uint256 into string
    function uintToStr(
        uint256 _i
    ) internal pure returns (string memory _uintAsString) {
        if (_i == 0) {
            return "0";
        }
        uint256 j = _i;
        uint256 len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint256 k = len;
        while (_i != 0) {
            k = k - 1;
            uint8 temp = (48 + uint8(_i - (_i / 10) * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }

    // Token URI getter function
    function tokenURI(uint256 tokenId) public view returns (string memory) {
        return
            string(abi.encodePacked(baseURI, "/", uintToStr(tokenId), ".json"));
    }

    // The following functions are overrides required by Solidity.
    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
   ) internal override(ERC1155, ERC1155Supply) {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }
    
    
}