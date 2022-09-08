// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import {IERC20} from "./interfaces/IERC20.sol";



contract NRFAirdrop {
    /// @dev this is the merkle root computed from the valid addresses
    bytes32 public merkleRoot = 0x514311ffd07d0034858e944ecb905ddc1994886b0a542867dbc7cac7440f108f;
    /// @dev this mapping would be used to map users to a bool to make sure the user has not claimed before
    mapping(address => bool) public claimed;

    uint256 claimAmount;
    address claimTokenAddress;
    address admin;



    // ERROR

    /// You have already claimed airdrop
    error HasAlreadyClaimed();
    /// Address is not eligible
    error YouAreNotEligible();
    /// Error while sending tokens
    error TransferFailed();
    /// You are not the admin 
    error NotAdmin();


    // EVENT

    event Claimed(address claimer, uint256 amount);


    constructor(uint256 _claimAmount, address _claimTokenAddress) {
        claimAmount = _claimAmount;
        claimTokenAddress = _claimTokenAddress;
    }

    



    function canClaim(bytes32[] calldata _merkleProof) internal view returns(bool status) {
        if(claimed[msg.sender]) {
            revert HasAlreadyClaimed();
        }
        bytes32 leaf = keccak256(abi.encodePacked(msg.sender));
        if(!MerkleProof.verify(_merkleProof, merkleRoot, leaf)) {
            revert YouAreNotEligible();
        }
        status = true;
    }


    /// @dev this function would user called by a user seeking to claim their  airdrop 
    /// @param _merkleProof: this is the proof the user would use to claim their airdrop, this proof would be provided to the user by the frontend 
    function claim(bytes32[] calldata _merkleProof) public {
        bool status = canClaim(_merkleProof);

        if(!status) {
            revert YouAreNotEligible();
        }

        claimed[msg.sender] = true;
        // sending the erc 20 token
        bool sent = IERC20(claimTokenAddress).transfer(msg.sender, claimAmount);

        if(!sent) {
            revert TransferFailed();
        }
        
        
        emit Claimed(msg.sender, claimAmount);
    }


    function removeLeftOver(address _to) public {
        if(msg.sender != admin) {
            revert NotAdmin();
        }

        // obtaining the balance
        uint256 bal = IERC20(claimTokenAddress).balanceOf(address(this));

        // transfering the balance from the contract to the specified address 
        bool sent = IERC20(claimTokenAddress).transfer(_to, bal);

        if(!sent) {
            revert TransferFailed();
        }
    }
}