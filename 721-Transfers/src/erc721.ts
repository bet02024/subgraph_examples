import {Address, BigInt} from "@graphprotocol/graph-ts"; 
import {
	Collection,
	NFT,
} from '../generated/schema'

import {
	Transfer  as TransferEvent,
  Contract721 as Contract721,
} from '../generated/Contract721/Contract721'

import { store } from '@graphprotocol/graph-ts'

export function handleTransfer(event: TransferEvent): void {

  const zeroAddress =  "0x0000000000000000000000000000000000000000";
  const nftAddress = event.address.toHexString();
  const tokenId = event.params.tokenId;
  const new_owner = event.params.to.toHexString();
  const previuos_owner = event.params.from.toHexString();
  const block_date = event.block.timestamp;


  let isTrade = false;

  const keyId = nftAddress + '-' + tokenId.toHexString();
  if (previuos_owner == zeroAddress)  {   // Mint
    let nft = NFT.load(keyId);
    if (!nft){
      nft = new NFT(keyId);
    }
    nft.mintedBlock = event.block.number;
    nft.nftAddress = nftAddress;
    nft.latestTrasnferBlock = event.block.number;
    nft.tokenId = tokenId;
    nft.currentOwner = new_owner;
    nft.mintTimestamp = block_date;
    nft.lastTransferTimestamp = block_date;
    nft.totalTrades = BigInt.fromI32(0);
    nft.save(); 
  } else if (new_owner == zeroAddress ) {  // Burn
    let nft = NFT.load(keyId);
    if (nft){
      store.remove("NFT",keyId);
    }
  } else {
    isTrade = true;
    let nft = NFT.load(keyId);
    if (!nft){
      nft = new NFT(keyId); // don't should happend
      nft.mintTimestamp = block_date;
      nft.nftAddress = nftAddress;
      nft.tokenId = tokenId;
      nft.totalTrades = BigInt.fromI32(0);
      nft.mintedBlock = event.block.number;
    }
    nft.latestTrasnferBlock = event.block.number;
    nft.currentOwner = new_owner;
    nft.lastTransferTimestamp = block_date;
    nft.totalTrades = nft.totalTrades.plus(BigInt.fromI32(1));
    nft.save(); 
  }

  let collection = Collection.load(nftAddress);
  let erc721   = Contract721.bind(event.address);
  let _totalSupply = erc721.try_totalSupply();
  if (!collection) {
    collection = new Collection(nftAddress);
    let _name = erc721.try_name();
		let _symbol = erc721.try_symbol();
    collection.name = _name.reverted ? '' : _name.value;
    collection.symbol = _symbol.reverted ? '' : _symbol.value;
    collection.totalTrades = BigInt.fromI32(0);
    collection.firstBlock = event.block.number;
  }
  if (isTrade){
    collection.totalTrades = collection.totalTrades.plus(BigInt.fromI32(1));
  }
  collection.latestMintedBlock = event.block.number;
  collection.totalSupply = _totalSupply.reverted ? "0" : _totalSupply.value.toString();
  collection.save(); 
}
