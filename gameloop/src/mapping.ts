import { BigInt } from "@graphprotocol/graph-ts"
import {Address} from "@graphprotocol/graph-ts"; 
import { store } from '@graphprotocol/graph-ts'
import {
  ThorGamification,
  AdminChanged,
  AttachPerk,
  BeaconUpgraded,
  CreateBifrostNode,
  CreateCapsule,
  CreateKey,
  DriftStakedFull,
  DriftUnstakedFull,
  Initialized,
  OwnershipTransferred,
  Paused,
  RequestFulfilled,
  Unpaused,
  Upgraded
} from "../generated/ThorGamification/ThorGamification"
import { StakedNFT } from "../generated/schema"


export function handleDriftStakedFull(event: DriftStakedFull): void {

  const ownerAddress = event.params.from.toHexString();
  const tokenId = event.params.tokenId;
  const timestamp = event.params.timestamp;
  const isOdin = event.params.isOdin;


  const keyId = ownerAddress + '-' + tokenId.toHexString() + '-' + isOdin.toString();

  let nft = StakedNFT.load(keyId);
  if (!nft){
    nft = new StakedNFT(keyId);
  }
  nft.ownerAddress = ownerAddress;
  nft.tokenId = tokenId;
  nft.odin = isOdin;
  nft.stakedTimestamp = timestamp;
  nft.save(); 

}

export function handleDriftUnstakedFull(event: DriftUnstakedFull): void {
  const ownerAddress = event.params.from.toHexString();
  const tokenId = event.params.tokenId;
  const isOdin = event.params.isOdin;

  const keyId = ownerAddress + '-' + tokenId.toHexString() + '-' + isOdin.toString();
  let nft = StakedNFT.load(keyId);
    if (nft){
      store.remove("StakedNFT",keyId);
    }
}

/*
export function handleAdminChanged(event: AdminChanged): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let entity = ExampleEntity.load(event.transaction.from.toHex())

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (!entity) {
    entity = new ExampleEntity(event.transaction.from.toHex())

    // Entity fields can be set using simple assignments
    entity.count = BigInt.fromI32(0)
  }

  // BigInt and BigDecimal math are supported
  entity.count = entity.count + BigInt.fromI32(1)

  // Entity fields can be set based on event parameters
  entity.previousAdmin = event.params.previousAdmin
  entity.newAdmin = event.params.newAdmin

  // Entities can be written to the store with `.save()`
  entity.save()

  // Note: If a handler doesn't require existing field values, it is faster
  // _not_ to load the entity from the store. Instead, create it fresh with
  // `new Entity(...)`, set the fields that should be updated and save the
  // entity back to the store. Fields that were not set or unset remain
  // unchanged, allowing for partial updates to be applied.

  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  // let contract = Contract.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - contract.COORDINATOR(...)
  // - contract.callbackGasLimit(...)
  // - contract.convertOGNodesToDriftNodes(...)
  // - contract.createCapsule(...)
  // - contract.deadAddress(...)
  // - contract.getStaker(...)
  // - contract.keyHash(...)
  // - contract.marketplace(...)
  // - contract.nftKey(...)
  // - contract.numWords(...)
  // - contract.odinDrift(...)
  // - contract.odinDriftCap(...)
  // - contract.odinOG(...)
  // - contract.ogKeyCardCap(...)
  // - contract.onERC721Received(...)
  // - contract.owner(...)
  // - contract.paused(...)
  // - contract.proxiableUUID(...)
  // - contract.requestConfirmations(...)
  // - contract.s_requests(...)
  // - contract.s_subscriptionId(...)
  // - contract.thor(...)
  // - contract.thorCapsule(...)
  // - contract.thorDrift(...)
  // - contract.thorDriftCap(...)
  // - contract.thorOG(...)
  // - contract.thorPerk(...)
  // - contract.usdc(...)
}

export function handleAttachPerk(event: AttachPerk): void {}

export function handleBeaconUpgraded(event: BeaconUpgraded): void {}

export function handleCreateBifrostNode(event: CreateBifrostNode): void {}

export function handleCreateCapsule(event: CreateCapsule): void {}

export function handleCreateKey(event: CreateKey): void {}


export function handleInitialized(event: Initialized): void {}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

export function handlePaused(event: Paused): void {}

export function handleRequestFulfilled(event: RequestFulfilled): void {}

export function handleUnpaused(event: Unpaused): void {}

export function handleUpgraded(event: Upgraded): void {}

*/
