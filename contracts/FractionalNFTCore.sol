// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";


library FractionalNFTLib {
    struct PropertyDetails {
        string name;
        address owner;
        bool isApproved;
        uint256 price;
        address fractionToken;
        bool exists;
    }

    struct ShareListing {
        address seller;
        uint256 shareAmount;
        uint256 pricePerShare;
        bool active;
    }
}

contract FractionalNFTCore is ERC721, Ownable {
    using SafeERC20 for IERC20;
    using FractionalNFTLib for FractionalNFTLib.PropertyDetails;

    mapping(uint256 => FractionalNFTLib.PropertyDetails) public properties;
    uint256[] public propertyIds;
    uint256 public nextPropertyId = 1;
    uint256 public constant TOTAL_SHARES = 1000;

    event PropertyCreated(uint256 indexed propertyId, string name, address owner, uint256 price, address fractionToken);
    event PropertyApproved(uint256 indexed propertyId);
    event PriceUpdated(uint256 indexed propertyId, uint256 newPrice);

    constructor(address initialOwner) ERC721("FractionalNFT", "FNFT") Ownable(initialOwner) {}

    function createProperty(string memory _name, uint256 _price) external {
        uint256 propertyId = nextPropertyId++;
        
        string memory tokenName = string(abi.encodePacked("Fraction ", _name));
        string memory tokenSymbol = string(abi.encodePacked("F", _name));
        FractionToken newFractionToken = new FractionToken(tokenName, tokenSymbol, TOTAL_SHARES);
        newFractionToken.transfer(msg.sender, TOTAL_SHARES);

        properties[propertyId] = FractionalNFTLib.PropertyDetails({
            name: _name,
            owner: msg.sender,
            isApproved: false,
            price: _price,
            fractionToken: address(newFractionToken),
            exists: true
        });

        propertyIds.push(propertyId);
        _safeMint(msg.sender, propertyId);
        
        emit PropertyCreated(propertyId, _name, msg.sender, _price, address(newFractionToken));
    }

    function propertyExists(uint256 _propertyId) public view returns (bool) {
        return properties[_propertyId].exists;
    }

    function approveProperty(uint256 _propertyId) external onlyOwner {
        require(propertyExists(_propertyId), "Not exist");
        properties[_propertyId].isApproved = true;
        emit PropertyApproved(_propertyId);
    }

    function updatePrice(uint256 _propertyId, uint256 _newPrice) external {
        require(propertyExists(_propertyId), "Not exist");
        FractionalNFTLib.PropertyDetails storage property = properties[_propertyId];
        require(msg.sender == property.owner, "Not owner");
        property.price = _newPrice;
        emit PriceUpdated(_propertyId, _newPrice);
    }

    function getPropertyDetails(uint256 _propertyId) external view returns (
        string memory name,
        address owner,
        bool isApproved,
        uint256 price,
        address fractionToken
    ) {
        require(propertyExists(_propertyId), "Not exist");
        FractionalNFTLib.PropertyDetails storage property = properties[_propertyId];
        return (property.name, property.owner, property.isApproved, property.price, property.fractionToken);
    }
     // New function to get all properties
    function getAllProperties() external view returns (
        uint256[] memory ids,
        string[] memory names,
        address[] memory owners,
        bool[] memory approvalStatus,
        uint256[] memory prices,
        address[] memory fractionTokens
    ) {
        uint256 count = propertyIds.length;
        ids = new uint256[](count);
        names = new string[](count);
        owners = new address[](count);
        approvalStatus = new bool[](count);
        prices = new uint256[](count);
        fractionTokens = new address[](count);

        for (uint256 i = 0; i < count; i++) {
            uint256 propertyId = propertyIds[i];
            FractionalNFTLib.PropertyDetails storage property = properties[propertyId];
            ids[i] = propertyId;
            names[i] = property.name;
            owners[i] = property.owner;
            approvalStatus[i] = property.isApproved;
            prices[i] = property.price;
            fractionTokens[i] = property.fractionToken;
        }

        return (ids, names, owners, approvalStatus, prices, fractionTokens);
    }

    // New function to get all approved properties
    function getApprovedProperties() external view returns (
        uint256[] memory ids,
        string[] memory names,
        address[] memory owners,
        uint256[] memory prices,
        address[] memory fractionTokens
    ) {
        uint256 count = 0;
        for (uint256 i = 0; i < propertyIds.length; i++) {
            if (properties[propertyIds[i]].isApproved) {
                count++;
            }
        }

        ids = new uint256[](count);
        names = new string[](count);
        owners = new address[](count);
        prices = new uint256[](count);
        fractionTokens = new address[](count);

        uint256 index = 0;
        for (uint256 i = 0; i < propertyIds.length; i++) {
            uint256 propertyId = propertyIds[i];
            FractionalNFTLib.PropertyDetails storage property = properties[propertyId];
            if (property.isApproved) {
                ids[index] = propertyId;
                names[index] = property.name;
                owners[index] = property.owner;
                prices[index] = property.price;
                fractionTokens[index] = property.fractionToken;
                index++;
            }
        }

        return (ids, names, owners, prices, fractionTokens);
    }
}

contract FractionToken is ERC20 {
    address[] private holders;
    mapping(address => bool) private isHolder;

    constructor(string memory name, string memory symbol, uint256 initialSupply) ERC20(name, symbol) {
        _mint(msg.sender, initialSupply);
        holders.push(msg.sender);
        isHolder[msg.sender] = true;
    }

    function transfer(address to, uint256 amount) public virtual override returns (bool) {
        address from = _msgSender();
        _updateHolders(from, to);
        return super.transfer(to, amount);
    }

    function transferFrom(address from, address to, uint256 amount) public virtual override returns (bool) {
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

    function getHolders() external view returns (address[] memory, uint256[] memory) {
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