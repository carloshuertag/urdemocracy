/**
 * 
 */
import { PersistentSet, PersistentUnorderedMap, u128 } from "near-sdk-as";
/**
 * 
 */
@nearBindgen
export class User {
    name: string;
    email: string;
    password: string;
    collectives: PersistentSet<string>;
}

/**
 * 
 */
@nearBindgen
export class Collective {
    name: string;
    infoLink: string;
    collectives: PersistentSet<string>;
}

/**
 * 
 */
@nearBindgen
export class Deliberation {
    name: string;
    
}
