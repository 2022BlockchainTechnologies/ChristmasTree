// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract christmasTree {
    // Payout address      -----------------Add my address-----------
    address public owner = 0x98a810E9Bb8eA90d145364e03A5fB8C5e04b1298;

    // 5 different, buyable decorations
    Decoration[5] decorations;

    struct Decoration {
        string name;
        string gasPriceInString;
        uint256 price;
    }

    // one can buy all decorations
    mapping(address => bool[5]) treeToDecoration;

    constructor() {
        // Create the decorations
        decorations[0] = Decoration("Lametta", "0.1 ETH", 100000000000000000);
        decorations[1] = Decoration("Lights", "0.2 ETH", 200000000000000000);
        decorations[2] = Decoration("Ornamet", "0.3 ETH", 300000000000000000);
        decorations[3] = Decoration("Chocolate", "0.4 ETH", 400000000000000000);
        decorations[4] = Decoration("Star", "5 ETH", 5000000000000000000);
    }

    function buyDecoration(uint256 decorationId) public payable {
        require(decorationId < 5 && decorationId >= 0);
        // // Decoration is not bought
        require(!treeToDecoration[msg.sender][decorationId]);
        require(msg.value >= decorations[decorationId].price);

        treeToDecoration[msg.sender][decorationId] = true;

        payable(owner).transfer(msg.value);
    }

    function allDecorations() public view returns (string memory) {
        string memory decorationNames = "Available decorations are: ";
        for (uint256 i = 0; i < 5; i++) {
            decorationNames = string.concat(
                decorationNames,
                decorations[i].name,
                " for ",
                decorations[i].gasPriceInString,
                ", "
            );
        }
        return decorationNames;
    }

    function ownedDecorations() public view returns (string memory) {
        string memory decorationNames;
        decorationNames = "You own these decorations: ";
        for (uint256 i = 0; i < 5; i++) {
            if (treeToDecoration[msg.sender][i] == true) {
                decorationNames = string.concat(
                    decorationNames,
                    decorations[i].name,
                    ", "
                );
            }
        }
        return decorationNames;
    }
}
