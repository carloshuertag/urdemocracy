/**
 * 
 */
import {
    context, // visibility into account, contract and blockchain details
    logging, // append to the execution environment log (appears in JS Developer Console when using near-api-js)
    storage, // key-value store for the contract (used by PersistentMap, PersistentVector and PersistentDeque)
    PersistentMap, // data structure that wraps storage to appear like a Map
    PersistentVector, // data structure that wraps storage to appear like a Vector
    PersistentDeque, // data structure that wraps storage to appear like a Deque
    PersistentSet, // data structure that wraps storage to appear like a Set
    ContractPromise, // make asynchronous calls to other contracts and receive callbacks
    base58, // utility base58 encoder
    base64, // utility base64 encoder / decoder
    math, // utility math functions for hashing using SHA and Keccak as well as pseudo-random data
    utils, // utility type conversion and read_register
} from "near-sdk-as";

/**
 * 
 */
@nearBindgen
export class User {
    #accountId: string;
    #name: string;
    #email: string;
    #password: string;
    #collectives: PersistentSet<string>;

    constructor( accountId: string, name: string, email: string, password: string) {
        this.#accountId = accountId;
        this.#name = name;
        this.#email = email;
        this.#password = password;
        this.#collectives = new PersistentSet<string>(accountId + "_collectives");
    }

    get accountId(): string {
        return this.#accountId;
    }

    set accountId(accountId: string) {
        this.#accountId = accountId;
    }

    get name(): string {
        return this.#name;
    }

    set name(name: string) {
        this.#name = name;
    }

    get email(): string {
        return this.#email;
    }

    set email(email: string) {
        this.#email = email;
    }

    get password(): string {
        return this.#password;
    }

    set password(password: string) {
        this.#password = password;
    }

    addCollective(collectiveId: string): void {
        this.#collectives.add(collectiveId);
    }

    getCollectives(): Array<string> {
        return this.#collectives.values();
    }

}

/**
 * 
 */
@nearBindgen
export class Collective {
    #collectiveId: string;
    #name: string;
    #infoLink: string;
    #users: PersistentSet<string>;

    constructor( collectiveId: string, name: string, infoLink: string) {
        this.#collectiveId = collectiveId;
        this.#name = name;
        this.#infoLink = infoLink;
        this.#users = new PersistentSet<string>(collectiveId + "_users");
    }

    get collectiveId(): string {
        return this.#collectiveId;
    }

    set collectiveId(collectiveId: string) {
        this.#collectiveId = collectiveId;
    }

    get name(): string {
        return this.#name;
    }

    set name(name: string) {
        this.#name = name;
    }

    get infoLink(): string {
        return this.#infoLink;
    }

    set infoLink(infoLink: string) {
        this.#infoLink = infoLink;
    }

    addUser(userId: string): void {
        this.#users.add(userId);
    }

    getUsers(): Array<string> {
        return this.#users.values();
    }

}

/**
 * 
 */
@nearBindgen
export class Deliberation {
    name: string;
    
}

/**
 * 
 */
@nearBindgen
export class Resource {
    name: string;
    
}

/**
 * 
 */
@nearBindgen
export class Result {
    name: string;
    
}

/**
 * 
 */
@nearBindgen
export class FollowUp {
    name: string;
    
}

export let userRegistry = ;;
export let collectiveRegistry = ;;
export let deliberationRegistry = ;
export let resultRegistry = ;
export let followupRegistry = ;
export let resourceRegistry = ;
