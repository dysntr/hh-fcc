# Lesson 9: Hardhat Smart Contract Lottery

- [Lesson Link](https://github.com/smartcontractkit/full-blockchain-solidity-course-js#lesson-9-hardhat-smart-contract-lottery)

### Useful Links

- https://docs.chain.link/docs/vrf/v2/subscription/examples/get-a-random-number/
- keepers.chain.link
- vrf.chain.link

## My Notes

- Draft out your code prior to starting.

### Errors

- Use this example if you want to return values for your errors.

```
error Raffle__UpkeepNotNeeded(uint256 currentBalance, uint256 numPlayers, uint256 raffleState);

(bool upkeepNeeded, ) = checkUpkeep("");
        // require(upkeepNeeded, "Upkeep not needed");
        if (!upkeepNeeded) {
            revert Raffle__UpkeepNotNeeded(
                address(this).balance,
                s_players.length,
                uint256(s_raffleState)
            );
        }
```

### Events

- Whenever you update a dynamic object (like an array or a mapping) you want to send an event
- Emit an event when we update a dynamic array or mapping
- EVM has a logging capability
  - writes logs to the blockchain
  - You can make a "getlogs" call to get the logs. Inside the logs are events.
  - Logs and Events are often used synonymously
  - Logs and Events are stored in a data structure that isn't accessible to smart contracts.
- Events are tied to the account or smart contract address that emitted the event
- Transaction happens, event is generated, Listen to events
- Example events

  ```
      /* Events */
      event RequestedRaffleWinner(uint256 indexed requestId);
      event RaffleEnter(address indexed player);
      event WinnerPicked(address indexed player);
  ```

- Event will be broken down to:
  - Address of contract that generated it
  - Parameters of the event
  - Topics
  - Data

#### Indexed keyword vs non-Indexed

- You can have up to 3 Indexed parameters.
- The index parameters are called topics.
- Indexed parameters are easier to search for and much easier to query
- Indexed parameters are much more searchable than non-Indexed
- Non Indexed costs less gas

#### emitting events

- Example of emitting an event `emit RaffleEnter(msg.sender);`

### Chainlink VRF/Keepers

- Your funding a subscription for multiple consumer contracts (v2)
- Example link - https://docs.chain.link/docs/vrf/v2/subscription/examples/get-a-random-number/
- Use subscription manager to manage your subscription accounts
  - Create subscription
  - VRFv2Consumer
- Chainlink Keeper network will continuously call pickRandomWinner()
- external contracts are little cheaper than public contracts

#### Implementing VRF

- `yarn add --dev @chainlink/contracts`

```solidity
import '@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol';
import '@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol';

contract Raffle is VRFConsumerBaseV2 {
    ///....
    ///....
    /* Functions */
    constructor(
        address vrfCoordinatorV2,
        uint64 subscriptionId,
        bytes32 gasLane, // keyHash
        uint256 interval,
        uint256 entranceFee,
        uint32 callbackGasLimit
    ) VRFConsumerBaseV2(vrfCoordinatorV2) {
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_gasLane = gasLane;
        i_interval = interval;
        i_subscriptionId = subscriptionId;
        i_entranceFee = entranceFee;
        s_raffleState = RaffleState.OPEN;
        s_lastTimeStamp = block.timestamp;
        i_callbackGasLimit = callbackGasLimit;
    }

     // Pick a random winner (verifiably random)
    function requestRandomWinner() external {
        //Request the random number
        //Once we get it, do something with it
        //Chainlink VRF is a two step process
        //1. REQUEST

        uint256 requestId = i_vrfCoordinator.requestRandomWords(
            i_gasLane, //or KeyHash max gas prive you are willing to pay for a request in wei
            i_subscriptionId, //subscriptionId required for funding the contract
            REQUEST_CONFIRMATIONS, // how many confirmation should nodes wait before responding
            i_callbackGasLimit, //gas limit for callback
            NUM_WORDS //how many random numbers do we want
        );
    }

    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords)
        internal
        override
    {}

}
```

- Chainlink VRF is a two step process
  1. REQUEST
     - `i_vrfCoordinator.requestRandomWords()`
  2. FULFILL
     `solidity function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override { uint256 indexofWinner = randomWords[0] % s_players.length; `
- Chainlink Keeper allows you to trigger smart contracts based on a parameter (eg. time parameter, price of assets)

- There are two parts to writing a Keeper contract

  - Your contract will need to be compatible to KeeperCompatibleInterface
    - Have two functions `checkUpkeep`, `performUpkeep`
    - `checkUpkeep` is ran off chain, by one of the nodes. To check the condition on when to call `performUpkeep`. This is the function that the Chainlink Keeper nodes call they look for `upkeepNeeded` to return True.
    - `performUpkeep` is ran onchain and verifies the results and make state change

- enum are used to create a new type

  ```solidity
    enum RaffleState {
        OPEN,
        CALCULATING
    }

    RaffleState private s_raffleState;
    s_raffleState = RaffleState.OPEN;
  ```

- There is a Base_fee, which is the premium for making requests, eg. 0.25LINK/requests. Price aggregators don't require fees as they are sponsored.

### Testing

- Here is how you can test to see if a function sends events

  ```js
  await expect(raffle.enterRaffle({ value: raffleEntranceFee })).to.emit(
    // emits RaffleEnter event if entered to index player(s) address
    raffle,
    "RaffleEnter"
  );
  ```

- This is how one can fast forward blockchain time for testing:

```js
// for a documentation of the methods below, go here: https://hardhat.org/hardhat-network/reference
await network.provider.send("evm_increaseTime", [interval.toNumber() + 1]); //allows you to increase time of blockchain
await network.provider.request({ method: "evm_mine", params: [] });
```

- You can pass '[]' or '0x' for sending empty bytes.
- callstatic. simulate sending a transaction eg. `const { upkeepNeeded } = await raffle.callStatic.checkUpkeep("0x")`
- describe blocks don't need async.
- wait for an event to fire `raffle.once("winnderPicked", ()=>{})`
