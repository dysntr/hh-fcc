//SPDX-License-Identifier: MIT
pragma solidity 0.8.8;

contract SimpleStorage {
    // This get initialized to zero
    // <- This means that this section is a comment!
    uint256 favoriteNumber;

    //People public person = People ({favoriteNumber: 1, name:"d"});

    struct People {
        uint256 favoriteNumber;
        string name;
    }

    //dynamic array
    People[] public people;

    //a mapping is a data structure where a key is "mapped" to a single value
    mapping(string => uint256) public nameToFavoriteNumber;

    function store(uint256 _favoriteNumber) public virtual {
        favoriteNumber = _favoriteNumber;
    }

    //view, pure functions don't use gas
    // view - reads state
    // pure functions - disallow reading from blockchain state
    // if a gas calling function calls a view or pure function - only then will it cost gas
    function retrieve() public view returns (uint256) {
        return favoriteNumber;
    }

    function addPerson(string memory _name, uint256 _favoriteNumber) public {
        people.push(People(_favoriteNumber, _name));
        nameToFavoriteNumber[_name] = _favoriteNumber;
    }
}
