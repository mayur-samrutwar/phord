// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract FractionalNFT is ERC721, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;
    uint256 public constant TOTAL_SHARES = 1000;

    struct Property {
        string name;
        uint256 totalPriceInWei;
        uint256 pricePerShareInWei;
        uint256 remainingShares;
        bool isApproved;
        address fractionToken;
        bool exists;
    }

    mapping(uint256 => Property) public properties;

    event PropertyCreated(
        uint256 indexed tokenId,
        string name,
        uint256 totalPriceInWei,
        uint256 pricePerShareInWei,
        uint256 remainingShares
    );
    event PropertyApproved(uint256 indexed tokenId);
    event SharesPurchased(
        uint256 indexed tokenId,
        address buyer,
        uint256 shareAmount
    );
    event DebugPurchase(uint256 requiredPayment, uint256 sentPayment);

    constructor() ERC721("FractionalNFT", "FNFT") Ownable(msg.sender) {}

    function createProperty(
        string memory _name,
        uint256 _totalPriceInEther,
        uint256 _remainingShares
    ) external {
        require(
            _remainingShares <= TOTAL_SHARES,
            "Remaining shares cannot exceed total shares"
        );

        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        uint256 totalPriceInWei = _totalPriceInEther * 1e18;
        uint256 pricePerShareInWei = totalPriceInWei / TOTAL_SHARES;

        string memory tokenName = string(abi.encodePacked("Fraction ", _name));
        string memory tokenSymbol = string(abi.encodePacked("F", _name));
        FractionToken newFractionToken = new FractionToken(
            tokenName,
            tokenSymbol,
            TOTAL_SHARES
        );

        properties[newTokenId] = Property({
            name: _name,
            totalPriceInWei: totalPriceInWei,
            pricePerShareInWei: pricePerShareInWei,
            remainingShares: _remainingShares,
            isApproved: false,
            fractionToken: address(newFractionToken),
            exists: true
        });

        _safeMint(msg.sender, newTokenId);
        newFractionToken.transfer(msg.sender, TOTAL_SHARES - _remainingShares);

        emit PropertyCreated(
            newTokenId,
            _name,
            totalPriceInWei,
            pricePerShareInWei,
            _remainingShares
        );
    }

    function propertyExists(uint256 _tokenId) public view returns (bool) {
        return properties[_tokenId].exists;
    }

    function approveProperty(uint256 _tokenId) external onlyOwner {
        require(propertyExists(_tokenId), "Property does not exist");
        properties[_tokenId].isApproved = true;
        emit PropertyApproved(_tokenId);
    }

    function getAllProperties() external view returns (Property[] memory) {
        Property[] memory allProperties = new Property[](_tokenIds.current());
        for (uint256 i = 1; i <= _tokenIds.current(); i++) {
            allProperties[i - 1] = properties[i];
        }
        return allProperties;
    }

    function getApprovedProperties() external view returns (Property[] memory) {
        uint256 count = 0;
        for (uint256 i = 1; i <= _tokenIds.current(); i++) {
            if (properties[i].isApproved) {
                count++;
            }
        }

        Property[] memory approvedProperties = new Property[](count);
        uint256 index = 0;
        for (uint256 i = 1; i <= _tokenIds.current(); i++) {
            if (properties[i].isApproved) {
                approvedProperties[index] = properties[i];
                index++;
            }
        }
        return approvedProperties;
    }

    function purchaseShares(
        uint256 _tokenId,
        uint256 _shareAmount
    ) external payable {
        require(propertyExists(_tokenId), "Property does not exist");
        Property storage property = properties[_tokenId];
        require(property.isApproved, "Property is not approved");
        require(
            _shareAmount <= property.remainingShares,
            "Not enough shares available"
        );

        uint256 totalCost = property.pricePerShareInWei * _shareAmount;
        require(msg.value >= totalCost, "Insufficient payment");

        property.remainingShares -= _shareAmount;
        FractionToken(property.fractionToken).transfer(
            msg.sender,
            _shareAmount
        );

        emit SharesPurchased(_tokenId, msg.sender, _shareAmount);

        if (msg.value > totalCost) {
            payable(msg.sender).transfer(msg.value - totalCost);
        }
    }

    function getSharePrice(
        uint256 _tokenId,
        uint256 _shareAmount
    ) public view returns (uint256) {
        require(propertyExists(_tokenId), "Property does not exist");
        Property storage property = properties[_tokenId];
        return property.pricePerShareInWei * _shareAmount;
    }

    function getShareholders(
        uint256 _tokenId
    ) external view returns (address[] memory, uint256[] memory) {
        require(propertyExists(_tokenId), "Property does not exist");
        return FractionToken(properties[_tokenId].fractionToken).getHolders();
    }
}

contract FractionToken is ERC20 {
    address[] private holders;
    mapping(address => bool) private isHolder;

    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply
    ) ERC20(name, symbol) {
        _mint(msg.sender, initialSupply);
        holders.push(msg.sender);
        isHolder[msg.sender] = true;
    }

    function transfer(
        address to,
        uint256 amount
    ) public virtual override returns (bool) {
        address from = _msgSender();
        _updateHolders(from, to);
        return super.transfer(to, amount);
    }

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public virtual override returns (bool) {
        _updateHolders(from, to);
        return super.transferFrom(from, to, amount);
    }

    function _updateHolders(address from, address to) private {
        if (!isHolder[to] && to != address(0)) {
            holders.push(to);
            isHolder[to] = true;
        }
        if (balanceOf(from) == 0) {
            isHolder[from] = false;
        }
    }

    function getHolders()
        external
        view
        returns (address[] memory, uint256[] memory)
    {
        uint256[] memory balances = new uint256[](holders.length);
        uint256 actualLength = 0;

        for (uint256 i = 0; i < holders.length; i++) {
            if (isHolder[holders[i]]) {
                balances[actualLength] = balanceOf(holders[i]);
                actualLength++;
            }
        }

        address[] memory actualHolders = new address[](actualLength);
        uint256[] memory actualBalances = new uint256[](actualLength);

        for (uint256 i = 0; i < actualLength; i++) {
            actualHolders[i] = holders[i];
            actualBalances[i] = balances[i];
        }

        return (actualHolders, actualBalances);
    }
}

contract RentDistribution {
    using SafeERC20 for IERC20;

    FractionalNFT public fractionalNFT;

    event RentDistributed(uint256 propertyId, uint256 totalAmount);
    event PaymentReceived(address from, uint256 amount);
    event ShareholderPayment(address shareholder, uint256 amount, bool success);
    event OwnerPayment(address owner, uint256 amount, bool success);

    constructor(address _fractionalNFTAddress) {
        fractionalNFT = FractionalNFT(_fractionalNFTAddress);
    }

    receive() external payable {
        emit PaymentReceived(msg.sender, msg.value);
    }

    function distributeRent(uint256 _propertyId) external payable {
        require(msg.value > 0, "No rent amount sent");
        require(
            fractionalNFT.propertyExists(_propertyId),
            "Property does not exist"
        );
        (bool isValid, address fractionTokenAddress) = validateProperty(
            _propertyId
        );
        require(isValid, "Invalid property");

        IERC20 fractionToken = IERC20(fractionTokenAddress);
        uint256 totalSupply = fractionToken.totalSupply();
        require(totalSupply > 0, "No shares issued for this property");

        distributeFunds(_propertyId, totalSupply);
        emit RentDistributed(_propertyId, msg.value);
    }

    function validateProperty(
        uint256 _propertyId
    ) private view returns (bool, address) {
        (
            ,
            ,
            ,
            ,
            bool isApproved,
            address fractionTokenAddress,
            bool exists
        ) = fractionalNFT.properties(_propertyId);
        return (exists && isApproved, fractionTokenAddress);
    }

    function distributeFunds(uint256 _propertyId, uint256 totalSupply) private {
        (
            address[] memory shareholders,
            uint256[] memory balances
        ) = fractionalNFT.getShareholders(_propertyId);
        require(shareholders.length > 0, "No shareholders found");

        address propertyOwner = fractionalNFT.ownerOf(_propertyId);
        uint256 totalDistributed = 0;

        for (uint256 i = 0; i < shareholders.length; i++) {
            uint256 shareholderPercentage = (balances[i] * 1e18) / totalSupply;
            uint256 shareholderPayment = (msg.value * shareholderPercentage) /
                1e18;
            if (shareholderPayment > 0) {
                (bool success, ) = payable(shareholders[i]).call{
                    value: shareholderPayment,
                    gas: 2300
                }("");
                emit ShareholderPayment(
                    shareholders[i],
                    shareholderPayment,
                    success
                );
                if (success) {
                    totalDistributed += shareholderPayment;
                }
            }
        }

        uint256 remaining = msg.value - totalDistributed;
        if (remaining > 0) {
            (bool success, ) = payable(propertyOwner).call{value: remaining}(
                ""
            );
            emit OwnerPayment(propertyOwner, remaining, success);
            require(
                success,
                "Failed to send remaining Ether to property owner"
            );
        }
    }

    function getShareholderInfo(
        uint256 _propertyId
    )
        external
        view
        returns (address[] memory, uint256[] memory, uint256[] memory)
    {
        require(
            fractionalNFT.propertyExists(_propertyId),
            "Property does not exist"
        );
        (bool isValid, address fractionTokenAddress) = validateProperty(
            _propertyId
        );
        require(isValid, "Invalid property");

        IERC20 fractionToken = IERC20(fractionTokenAddress);
        uint256 totalSupply = fractionToken.totalSupply();
        return calculateShareholderInfo(_propertyId, totalSupply);
    }

    function calculateShareholderInfo(
        uint256 _propertyId,
        uint256 totalSupply
    )
        private
        view
        returns (address[] memory, uint256[] memory, uint256[] memory)
    {
        (
            address[] memory shareholders,
            uint256[] memory balances
        ) = fractionalNFT.getShareholders(_propertyId);
        uint256[] memory percentages = new uint256[](shareholders.length);
        for (uint256 i = 0; i < shareholders.length; i++) {
            percentages[i] = (balances[i] * 1e18) / totalSupply;
        }
        return (shareholders, balances, percentages);
    }
}
