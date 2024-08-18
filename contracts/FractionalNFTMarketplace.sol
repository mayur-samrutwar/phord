// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./FractionalNFTCore.sol"; // Make sure this path is correct

contract FractionalNFTMarketplace is Ownable {
    using SafeERC20 for IERC20;
    using FractionalNFTLib for FractionalNFTLib.ShareListing;

    FractionalNFTCore public coreContract;
    mapping(uint256 => FractionalNFTLib.ShareListing[]) public propertyShareListings;
    uint256 public listingFee = 0.001 ether;

    event ShareListed(uint256 indexed propertyId, address seller, uint256 shareAmount, uint256 pricePerShare, uint256 listingId);
    event SharePurchased(uint256 indexed propertyId, address buyer, address seller, uint256 shareAmount, uint256 totalPrice, uint256 listingId);
    event ListingCancelled(uint256 indexed propertyId, uint256 listingId);
    event ListingFeeUpdated(uint256 newFee);

    constructor(address _coreContract) Ownable(msg.sender) {
        coreContract = FractionalNFTCore(_coreContract);
    }

    function listShareForSale(uint256 propertyId, uint256 shareAmount, uint256 pricePerShare) external payable {
        require(coreContract.propertyExists(propertyId), "Not exist");
        require(msg.value >= listingFee, "Fee low");
        (,,,,address fractionTokenAddress) = coreContract.getPropertyDetails(propertyId);
        IERC20 fractionToken = IERC20(fractionTokenAddress);
        require(fractionToken.balanceOf(msg.sender) >= shareAmount, "Not enough");
        
        uint256 listingId = propertyShareListings[propertyId].length;
        propertyShareListings[propertyId].push(FractionalNFTLib.ShareListing({
            seller: msg.sender,
            shareAmount: shareAmount,
            pricePerShare: pricePerShare,
            active: true
        }));
        
        fractionToken.safeTransferFrom(msg.sender, address(this), shareAmount);
        
        emit ShareListed(propertyId, msg.sender, shareAmount, pricePerShare, listingId);
        
        if (msg.value > listingFee) {
            payable(msg.sender).transfer(msg.value - listingFee);
        }
    }

    function cancelListing(uint256 propertyId, uint256 listingId) external {
        require(coreContract.propertyExists(propertyId), "Not exist");
        require(listingId < propertyShareListings[propertyId].length, "Invalid ID");
        FractionalNFTLib.ShareListing storage listing = propertyShareListings[propertyId][listingId];
        require(listing.seller == msg.sender, "Not seller");
        require(listing.active, "Not active");
        
        listing.active = false;
        
        (,,,,address fractionTokenAddress) = coreContract.getPropertyDetails(propertyId);
        IERC20 fractionToken = IERC20(fractionTokenAddress);
        fractionToken.safeTransfer(msg.sender, listing.shareAmount);
        
        emit ListingCancelled(propertyId, listingId);
    }

    function purchaseShares(uint256 propertyId, uint256 listingId, uint256 sharesToPurchase) external payable {
        require(coreContract.propertyExists(propertyId), "Not exist");
        require(listingId < propertyShareListings[propertyId].length, "Invalid ID");
        FractionalNFTLib.ShareListing storage listing = propertyShareListings[propertyId][listingId];
        require(listing.active, "Not active");
        require(sharesToPurchase <= listing.shareAmount, "Not enough");
        
        uint256 totalPrice = sharesToPurchase * listing.pricePerShare;
        require(msg.value >= totalPrice, "Low payment");
        
        (,,,,address fractionTokenAddress) = coreContract.getPropertyDetails(propertyId);
        IERC20 fractionToken = IERC20(fractionTokenAddress);
        
        fractionToken.safeTransfer(msg.sender, sharesToPurchase);
        payable(listing.seller).transfer(totalPrice);
        
        listing.shareAmount -= sharesToPurchase;
        if (listing.shareAmount == 0) {
            listing.active = false;
        }
        
        emit SharePurchased(propertyId, msg.sender, listing.seller, sharesToPurchase, totalPrice, listingId);
        
        if (msg.value > totalPrice) {
            payable(msg.sender).transfer(msg.value - totalPrice);
        }
    }

    function updateListingFee(uint256 newFee) external onlyOwner {
        listingFee = newFee;
        emit ListingFeeUpdated(newFee);
    }

    function withdrawFees() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees");
        payable(owner()).transfer(balance);
    }
}