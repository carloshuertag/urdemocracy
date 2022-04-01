export type Timestamp = u64;
/**
 * 
 */
import {
    PersistentUnorderedMap, // data structure that wraps storage to appear like an unordered Map
    PersistentSet, // data structure that wraps storage to appear like a Set
    math, // utility math functions for hashing using SHA and Keccak as well as pseudo-random data
} from "near-sdk-as";

/**
 * 
 */
@nearBindgen
export class User {
    privateaccountId: string;
    privatename: string;
    privatemail: string;
    privatepassword: string;
    privatecollectives: PersistentSet<string>;

    constructor( accountId: string, name: string, mail: string, password: string) {
        this.privateaccountId = accountId;
        this.privatename = name;
        this.privatemail = mail;
        this.privatepassword = password;
        this.privatecollectives = new PersistentSet<string>(accountId + "_collectives");
    }

    get accountId(): string {
        return this.privateaccountId;
    }

    set accountId(accountId: string) {
        this.privateaccountId = accountId;
    }

    get name(): string {
        return this.privatename;
    }

    set name(name: string) {
        this.privatename = name;
    }

    get mail(): string {
        return this.privatemail;
    }

    set email(mail: string) {
        this.privatemail = mail;
    }

    get password(): string {
        return this.privatepassword;
    }

    set password(password: string) {
        this.privatepassword = password;
    }

    addCollective(collectiveId: string): void {
        this.privatecollectives.add(collectiveId);
    }

    get collectives(): Array<string> {
        return this.privatecollectives.values();
    }
}

/**
 * 
 */
@nearBindgen
export class Collective {
    privatecollectiveId: string;
    privatename: string;
    privatetype: string;
    privateinfoUrl: string;
    privateusers: PersistentSet<string>;
    privatedeliberations: PersistentSet<string>;

    constructor(name: string, type: string, infoUrl: string) {
        this.privatecollectiveId = "0x";
        let tmp: Uint8Array = math.sha256(math.hash(name + type + infoUrl));
        for(let i = 0; i < tmp.length; i++) this.privatecollectiveId += tmp[i].toString(16);
        this.privatename = name;
        this.privatetype = type;
        this.privateinfoUrl = infoUrl;
        this.privateusers = new PersistentSet<string>(this.privatecollectiveId + "_users");
        this.privatedeliberations = new PersistentSet<string>(this.privatecollectiveId + "_deliberations");
    }

    get collectiveId(): string {
        return this.privatecollectiveId;
    }

    get name(): string {
        return this.privatename;
    }

    set name(name: string) {
        this.privatename = name;
    }

    get infoUrl(): string {
        return this.privateinfoUrl;
    }

    set type(type: string) {
        this.privatetype = type;
    }

    get type(): string {
        return this.privatetype;
    }

    set infoUrl(infoUrl: string) {
        this.privateinfoUrl = infoUrl;
    }

    addUser(userId: string): void {
        this.privateusers.add(userId);
    }

    get users(): Array<string> {
        return this.privateusers.values();
    }

    addDeliberation(deliberationId: string): void {
        this.privatedeliberations.add(deliberationId);
    }

    get deliberations(): Array<string> {
        return this.privatedeliberations.values();
    }
}

/**
 * 
 */
@nearBindgen
export class Deliberation {
    privatedeliberationId: string;
    privatename: string;
    privatetopics: PersistentSet<string>;
    privatedescription: string;
    privatetool: string;
    privatecollectiveId: string;
    privateresources: PersistentSet<string>;
    privateresults: PersistentSet<string>;
    privatedeliberationDate: string;
    privatehostAccountId: string;

    constructor(name: string, description: string, tool: string, collectiveId: string, deliberationDate: string, hostAccountId: string) {
        this.privatedeliberationId = "0x";
        let tmp: Uint8Array = math.sha256(math.hash(collectiveId + deliberationDate + hostAccountId));
        for(let i = 0; i < tmp.length; i++) this.privatedeliberationId += tmp[i].toString(16);
        this.privatename = name;
        this.privatetopics = new PersistentSet<string>(this.privatedeliberationId + "_topics");
        this.privatedescription = description;
        this.privatetool = tool;
        this.privatecollectiveId = collectiveId;
        this.privateresources = new PersistentSet<string>(this.privatedeliberationId + "_resources");
        this.privateresults = new PersistentSet<string>(this.privatedeliberationId + "_results");
        this.privatedeliberationDate = deliberationDate;
        this.privatehostAccountId = hostAccountId;
    }

    get deliberationId(): string {
        return this.privatedeliberationId;
    }

    get name(): string {
        return this.privatename;
    }

    set name(name: string) {
        this.privatename = name;
    }

    get topics(): Array<string> {
        return this.privatetopics.values();
    }

    addTopic(topic: string): void {
        this.privatetopics.add(topic);
    }

    get description(): string {
        return this.privatedescription;
    }

    set description(description: string) {
        this.privatedescription = description;
    }

    get tool(): string {
        return this.privatetool;
    }

    set tool(tool: string) {
        this.privatetool = tool;
    }

    get collectiveId(): string {
        return this.privatecollectiveId;
    }

    set collectiveId(collectiveId: string) {
        this.privatecollectiveId = collectiveId;
    }

    get resources(): Array<string> {
        return this.privateresources.values();
    }

    addResource(resource: string): void {
        this.privateresources.add(resource);
    }

    get results(): Array<string> {
        return this.privateresults.values();
    }

    addResult(result: string): void {
        this.privateresults.add(result);
    }

    get deliberationDate(): string {
        return this.privatedeliberationDate;
    }

    set deliberationDate(deliberationDate: string) {
        this.privatedeliberationDate = deliberationDate;
    }

    get hostAccountId(): string {
        return this.privatehostAccountId;
    }

    set hostAccountId(hostAccountId: string) {
        this.privatehostAccountId = hostAccountId;
    }
}

/**
 * 
 */
@nearBindgen
export class Resource {
    privateresourceId: string;
    privatename: string;
    privatetype: string;
    privatedescription: string;
    privateurl: string;
    privatedeliberationId: string;
    privatetopics: PersistentSet<string>;
    privatetimestamp: Timestamp;
    privateuploaderAccountId: string;

    constructor(name: string, type: string, description: string, url: string, deliberationId: string, timestamp: Timestamp, uploaderAccountId: string) {
        this.privateresourceId = "0x";
        let tmp: Uint8Array = math.sha256(math.hash(url + deliberationId + timestamp + uploaderAccountId));
        for(let i = 0; i < tmp.length; i++) this.privateresourceId += tmp[i].toString(16);
        this.privatename = name;
        this.privatetype = type;
        this.privatedescription = description;
        this.privateurl = url;
        this.privatedeliberationId = deliberationId;
        this.privatetopics = new PersistentSet<string>(this.privateresourceId + "_topics");
        this.privatetimestamp = timestamp;
        this.privateuploaderAccountId = uploaderAccountId;
    }

    get resourceId(): string {
        return this.privateresourceId;
    }

    get name(): string {
        return this.privatename;
    }

    set name(name: string) {
        this.privatename = name;
    }

    get type(): string {
        return this.privatetype;
    }

    set type(type: string) {
        this.privatetype = type;
    }

    get description(): string {
        return this.privatedescription;
    }

    set description(description: string) {
        this.privatedescription = description;
    }

    get url(): string {
        return this.privateurl;
    }

    set url(url: string) {
        this.privateurl = url;
    }

    get deliberationId(): string {
        return this.privatedeliberationId;
    }

    set deliberationId(deliberationId: string) {
        this.privatedeliberationId = deliberationId;
    }

    get topics(): Array<string> {
        return this.privatetopics.values();
    }

    addTopic(topic: string): void {
        this.privatetopics.add(topic);
    }

    get timestamp(): Timestamp {
        return this.privatetimestamp;
    }

    set timestamp(timestamp: Timestamp) {
        this.privatetimestamp = timestamp;
    }

    get uploaderAccountId(): string {
        return this.privateuploaderAccountId;
    }

    set uploaderAccountId(uploaderAccountId: string) {
        this.privateuploaderAccountId = uploaderAccountId;
    }
}

/**
 * 
 */
@nearBindgen
export class Result {
    privateresultId: string;
    privatename: string;
    privatedescription: string;
    privatedeliberationId: string;
    privatecheckoutUrl: string;
    privatetimestamp: Timestamp;
    privatefollowUpId: string;
    privatecheckerAccountId: string;
    
    constructor(name: string, description: string, deliberationId: string, followUpId: string, checkoutUrl: string, timestamp: Timestamp, checkerAccountId: string) {
        this.privateresultId = "0x";
        let tmp: Uint8Array = math.sha256(math.hash(deliberationId + followUpId + timestamp + checkerAccountId));
        for(let i = 0; i < tmp.length; i++) this.privateresultId += tmp[i].toString(16);
        this.privatename = name;
        this.privatedescription = description;
        this.privatedeliberationId = deliberationId;
        this.privatefollowUpId = followUpId;
        this.privatecheckoutUrl = checkoutUrl;
        this.privatetimestamp = timestamp;
        this.privatecheckerAccountId = checkerAccountId;
    }

    get resultId(): string {
        return this.privateresultId;
    }

    get name(): string {
        return this.privatename;
    }

    set name(name: string) {
        this.privatename = name;
    }

    get description(): string {
        return this.privatedescription;
    }

    set description(description: string) {
        this.privatedescription = description;
    }

    get deliberationId(): string {
        return this.privatedeliberationId;
    }

    set deliberationId(deliberationId: string) {
        this.privatedeliberationId = deliberationId;
    }

    get followUpId(): string {
        return this.privatefollowUpId;
    }

    set followUpId(followUpId: string) {
        this.privatefollowUpId = followUpId;
    }

    get checkoutUrl(): string {
        return this.privatecheckoutUrl;
    }

    set checkoutUrl(checkoutUrl: string) {
        this.privatecheckoutUrl = checkoutUrl;
    }

    get timestamp(): Timestamp {
        return this.privatetimestamp;
    }

    set timestamp(timestamp: Timestamp) {
        this.privatetimestamp = timestamp;
    }

    get checkerAccountId(): string {
        return this.privatecheckerAccountId;
    }

    set checkerAccountId(checkerAccountId: string) {
        this.privatecheckerAccountId = checkerAccountId;
    }
}

/**
 * 
 */
@nearBindgen
export class FollowUp {
    privatefollowUpId: string;
    privatestatus: string;
    privatemonitoringUrl: string;
    privateevaluationDate: string;
    privatedeliberationId: string;
    privateresultId: string;
    privatemonitorAccountId: string;

    constructor(status: string, monitoringUrl: string, evaluationDate: string, deliberationId: string, resultId: string, monitorAccountId: string) {
        this.privatefollowUpId = "0x";
        let tmp: Uint8Array = math.sha256(math.hash(deliberationId + resultId + evaluationDate + monitorAccountId));
        for(let i = 0; i < tmp.length; i++) this.privatefollowUpId += tmp[i].toString(16);
        this.privatestatus = status;
        this.privatemonitoringUrl = monitoringUrl;
        this.privateevaluationDate = evaluationDate;
        this.privatedeliberationId = deliberationId;
        this.privateresultId = resultId;
        this.privatemonitorAccountId = monitorAccountId;
    }

    get followUpId(): string {
        return this.privatefollowUpId;
    }

    get status(): string {
        return this.privatestatus;
    }

    set status(status: string) {
        this.privatestatus = status;
    }

    get monitoringUrl(): string {
        return this.privatemonitoringUrl;
    }

    set monitoringUrl(monitoringUrl: string) {
        this.privatemonitoringUrl = monitoringUrl;
    }

    get evaluationDate(): string {
        return this.privateevaluationDate;
    }

    set evaluationDate(evaluationDate: string) {
        this.privateevaluationDate = evaluationDate;
    }

    get deliberationId(): string {
        return this.privatedeliberationId;
    }

    set deliberationId(deliberationId: string) {
        this.privatedeliberationId = deliberationId;
    }

    get resultId(): string {
        return this.privateresultId;
    }

    set resultId(resultId: string) {
        this.privateresultId = resultId;
    }

    get monitorAccountId(): string {
        return this.privatemonitorAccountId;
    }

    set monitorAccountId(monitorAccountId: string) {
        this.privatemonitorAccountId = monitorAccountId;
    }
}

export let userRegistry = new PersistentUnorderedMap<string, User>("user_registry");
export let collectiveRegistry = new PersistentUnorderedMap<string, Collective>("collective_registry");
export let deliberationRegistry = new PersistentUnorderedMap<string, Deliberation>("deliberation_registry");
export let resultRegistry = new PersistentUnorderedMap<string, Result>("result_registry");
export let followupRegistry = new PersistentUnorderedMap<string, FollowUp>("followup_registry");
export let resourceRegistry = new PersistentUnorderedMap<string, Resource>("resource_registry");