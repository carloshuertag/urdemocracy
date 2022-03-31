export type Timestamp = u64;
/**
 * 
 */
import {
    PersistentUnorderedMap, // data structure that wraps storage to appear like an unordered Map
    PersistentSet // data structure that wraps storage to appear like a Set
} from "near-sdk-as";

/**
 * 
 */
@nearBindgen
export class User {
    #accountId: string;
    #name: string;
    #mail: string;
    #password: string;
    #collectives: PersistentSet<string>;

    constructor( accountId: string, name: string, mail: string, password: string) {
        this.#accountId = accountId;
        this.#name = name;
        this.#mail = mail;
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

    get mail(): string {
        return this.#mail;
    }

    set email(mail: string) {
        this.#mail = mail;
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
    #type: string;
    #infoUrl: string;
    #users: PersistentSet<string>;

    constructor(name: string, type: string, infoUrl: string) {
        this.#collectiveId = name + type + infoUrl;
        this.#name = name;
        this.#type = type;
        this.#infoUrl = infoUrl;
        this.#users = new PersistentSet<string>(this.#collectiveId + "_users");
    }

    get collectiveId(): string {
        return this.#collectiveId;
    }

    get name(): string {
        return this.#name;
    }

    set name(name: string) {
        this.#name = name;
    }

    get infoUrl(): string {
        return this.#infoUrl;
    }

    set type(type: string) {
        this.#type = type;
    }

    get type(): string {
        return this.#type;
    }

    set infoUrl(infoUrl: string) {
        this.#infoUrl = infoUrl;
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
    #deliberationId: string;
    #name: string;
    #topics: PersistentSet<string>;
    #description: string;
    #tool: string;
    #collectiveId: string;
    #resources: PersistentSet<string>;
    #results: PersistentSet<string>;
    #deliberationDate: string;
    #hostAccountId: string;

    constructor(name: string, description: string, tool: string, collectiveId: string, deliberationDate: string, hostAccountId: string) {
        this.#deliberationId = collectiveId + deliberationDate + hostAccountId;
        this.#name = name;
        this.#topics = new PersistentSet<string>(this.#deliberationId + "_topics");
        this.#description = description;
        this.#tool = tool;
        this.#collectiveId = collectiveId;
        this.#resources = new PersistentSet<string>(this.#deliberationId + "_resources");
        this.#results = new PersistentSet<string>(this.#deliberationId + "_results");
        this.#deliberationDate = deliberationDate;
        this.#hostAccountId = hostAccountId;
    }

    get deliberationId(): string {
        return this.#deliberationId;
    }

    get name(): string {
        return this.#name;
    }

    set name(name: string) {
        this.#name = name;
    }

    get topics(): Array<string> {
        return this.#topics.values();
    }

    addTopic(topic: string): void {
        this.#topics.add(topic);
    }

    get description(): string {
        return this.#description;
    }

    set description(description: string) {
        this.#description = description;
    }

    get tool(): string {
        return this.#tool;
    }

    set tool(tool: string) {
        this.#tool = tool;
    }

    get collectiveId(): string {
        return this.#collectiveId;
    }

    set collectiveId(collectiveId: string) {
        this.#collectiveId = collectiveId;
    }

    get resources(): Array<string> {
        return this.#resources.values();
    }

    addResource(resource: string): void {
        this.#resources.add(resource);
    }

    get results(): Array<string> {
        return this.#results.values();
    }

    addResult(result: string): void {
        this.#results.add(result);
    }

    get deliberationDate(): string {
        return this.#deliberationDate;
    }

    set deliberationDate(deliberationDate: string) {
        this.#deliberationDate = deliberationDate;
    }

    get hostAccountId(): string {
        return this.#hostAccountId;
    }

    set hostAccountId(hostAccountId: string) {
        this.#hostAccountId = hostAccountId;
    }
}

/**
 * 
 */
@nearBindgen
export class Resource {
    #resourceId: string;
    #name: string;
    #type: string;
    #description: string;
    #url: string;
    #deliberationId: string;
    #topics: PersistentSet<string>;
    #timestamp: Timestamp;
    #uploaderAccountId: string;

    constructor(name: string, type: string, description: string, url: string, deliberationId: string, timestamp: Timestamp, uploaderAccountId: string) {
        this.#resourceId = url + deliberationId + timestamp + uploaderAccountId;
        this.#name = name;
        this.#type = type;
        this.#description = description;
        this.#url = url;
        this.#deliberationId = deliberationId;
        this.#topics = new PersistentSet<string>(this.#resourceId + "_topics");
        this.#timestamp = timestamp;
        this.#uploaderAccountId = uploaderAccountId;
    }

    get resourceId(): string {
        return this.#resourceId;
    }

    get name(): string {
        return this.#name;
    }

    set name(name: string) {
        this.#name = name;
    }

    get type(): string {
        return this.#type;
    }

    set type(type: string) {
        this.#type = type;
    }

    get description(): string {
        return this.#description;
    }

    set description(description: string) {
        this.#description = description;
    }

    get url(): string {
        return this.#url;
    }

    set url(url: string) {
        this.#url = url;
    }

    get deliberationId(): string {
        return this.#deliberationId;
    }

    set deliberationId(deliberationId: string) {
        this.#deliberationId = deliberationId;
    }

    get topics(): Array<string> {
        return this.#topics.values();
    }

    addTopic(topic: string): void {
        this.#topics.add(topic);
    }

    get timestamp(): Timestamp {
        return this.#timestamp;
    }

    set timestamp(timestamp: Timestamp) {
        this.#timestamp = timestamp;
    }

    get uploaderAccountId(): string {
        return this.#uploaderAccountId;
    }

    set uploaderAccountId(uploaderAccountId: string) {
        this.#uploaderAccountId = uploaderAccountId;
    }
}

/**
 * 
 */
@nearBindgen
export class Result {
    #resultId: string;
    #name: string;
    #description: string;
    #deliberationId: string;
    #resultAgreement: string;
    #checkoutUrl: string;
    #timestamp: Timestamp;
    #checkerAccountId: string;
    
    constructor(name: string, description: string, deliberationId: string, resultAgreementId: string, checkoutUrl: string, timestamp: Timestamp, checkerAccountId: string) {
        this.#resultId = deliberationId + resultAgreementId + checkoutUrl + timestamp + checkerAccountId;
        this.#name = name;
        this.#description = description;
        this.#deliberationId = deliberationId;
        this.#resultAgreement = resultAgreementId;
        this.#checkoutUrl = checkoutUrl;
        this.#timestamp = timestamp;
        this.#checkerAccountId = checkerAccountId;
    }

    get resultId(): string {
        return this.#resultId;
    }

    get name(): string {
        return this.#name;
    }

    set name(name: string) {
        this.#name = name;
    }

    get description(): string {
        return this.#description;
    }

    set description(description: string) {
        this.#description = description;
    }

    get deliberationId(): string {
        return this.#deliberationId;
    }

    set deliberationId(deliberationId: string) {
        this.#deliberationId = deliberationId;
    }

    get resultAgreement(): string {
        return this.#resultAgreement;
    }

    set resultAgreement(resultAgreement: string) {
        this.#resultAgreement = resultAgreement;
    }

    get checkoutUrl(): string {
        return this.#checkoutUrl;
    }

    set checkoutUrl(checkoutUrl: string) {
        this.#checkoutUrl = checkoutUrl;
    }

    get timestamp(): Timestamp {
        return this.#timestamp;
    }

    set timestamp(timestamp: Timestamp) {
        this.#timestamp = timestamp;
    }

    get checkerAccountId(): string {
        return this.#checkerAccountId;
    }

    set checkerAccountId(checkerAccountId: string) {
        this.#checkerAccountId = checkerAccountId;
    }
}

/**
 * 
 */
@nearBindgen
export class FollowUp {
    #followUpId: string;
    #status: string;
    #monitoringUrl: string;
    #evaluationDate: string;
    #deliberationId: string;
    #resultId: string;
    #monitorAccountId: string;

    constructor(status: string, monitoringUrl: string, evaluationDate: string, deliberationId: string, resultId: string, monitorAccountId: string) {
        this.#followUpId = deliberationId + resultId + evaluationDate + monitorAccountId;
        this.#status = status;
        this.#monitoringUrl = monitoringUrl;
        this.#evaluationDate = evaluationDate;
        this.#deliberationId = deliberationId;
        this.#resultId = resultId;
        this.#monitorAccountId = monitorAccountId;
    }

    get followUpId(): string {
        return this.#followUpId;
    }

    get status(): string {
        return this.#status;
    }

    set status(status: string) {
        this.#status = status;
    }

    get monitoringUrl(): string {
        return this.#monitoringUrl;
    }

    set monitoringUrl(monitoringUrl: string) {
        this.#monitoringUrl = monitoringUrl;
    }

    get evaluationDate(): string {
        return this.#evaluationDate;
    }

    set evaluationDate(evaluationDate: string) {
        this.#evaluationDate = evaluationDate;
    }

    get deliberationId(): string {
        return this.#deliberationId;
    }

    set deliberationId(deliberationId: string) {
        this.#deliberationId = deliberationId;
    }

    get resultId(): string {
        return this.#resultId;
    }

    set resultId(resultId: string) {
        this.#resultId = resultId;
    }

    get monitorAccountId(): string {
        return this.#monitorAccountId;
    }

    set monitorAccountId(monitorAccountId: string) {
        this.#monitorAccountId = monitorAccountId;
    }
}

export let userRegistry = new PersistentUnorderedMap<string, User>("user_registry");
export let collectiveRegistry = new PersistentUnorderedMap<string, Collective>("collective_registry");
export let deliberationRegistry = new PersistentUnorderedMap<string, Deliberation>("deliberation_registry");
export let resultRegistry = new PersistentUnorderedMap<string, Result>("result_registry");
export let followupRegistry = new PersistentUnorderedMap<string, FollowUp>("followup_registry");
export let resourceRegistry = new PersistentUnorderedMap<string, Resource>("resource_registry");
