# Solidity ChristmasTree

By Jason Witzemann and Noah Sutter

## Content

With this smart contract, you can buy 5 different decorations for your Christmas tree. You can choose to buy lametta, lights, ornaments, chocolate or a star. You can buy all decorations, but each decorations can be purchased at maximum once per person.

## Usage

To use the smart contract, make sure to use the provided `christmasTree.json`, which can be found in the `build/contracts` folder, or the address `0x280EEd114e61d250A0aE5C0f7eFC1181a10bBC74`. After doing so, you have access to buying the decorations.
As all decorations vary in price, you can use the `allDecorations()` function to see the prices.
To see, which decorations you already own, you can use the `ownedDecorations()` function. If you want to buy decorations, you not only need to pay the right price, but also know which ID your decoration has. You can find the ID and price in the `allDecorations()` function, or in the table provided below:

| ID  | Decoration | Price   |
| --- | ---------- | ------- |
| 0   | Lametta    | 0.1 ETH |
| 1   | Lights     | 0.2 ETH |
| 2   | Ornament   | 0.3 ETH |
| 3   | Chocolate  | 0.4 ETH |
| 4   | Star       | 5 ETH   |

## Example using `christmasTree.json`

If you have the ABI for the smart contract, you can create an instance by using:
`let instance = await christmasTree.deployed()`

After that, you can use non-payable functions like this:
`instance.allDecorations()` or `instance.ownedDecorations()`

And to buy decorations, you can use this syntax. We tested it with 100.000 Wei as gas and it worked:
`instance.buyDecoration(ID, {from: "YOUR ADDRESS", value: web3.utils.toWei("The right price"), gas:100000 })`

With real values it would look like this:
`instance.buyDecoration(0, {from: "0x4910c6f466A442E1895F15Fe7FCc82C8e9b14944", value: web3.utils.toWei("0.1"), gas:100000 })`
