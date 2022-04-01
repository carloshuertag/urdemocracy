import { Contract } from "..";
import {userRegistry, collectiveRegistry, deliberationRegistry, resultRegistry, resourceRegistry, followupRegistry,
    User, Collective, Deliberation, Resource, Result, FollowUp, Timestamp } from "../model"
import { context, Context } from 'near-sdk-as';

const CONTRACT: Contract = new Contract();

describe("signin", () => {
    it('should return true', () => {
        const signin: bool = CONTRACT.signin("Carlos Huerta Garcia", "huerta2502@hotmail.com", "1234root");
        expect(signin).toBe(true);
    });
})

describe("correct login", () => {
    it('should return true', () => {
        const signin: bool = CONTRACT.signin("Carlos Huerta Garcia", "huerta2502@hotmail.com", "1234root");
        expect(signin).toBe(true);
        const login: bool = CONTRACT.login("huerta2502@hotmail.com", "1234root");
        expect(login).toBe(true);
    });
})

describe("incorrect login", () => {
    it('should return false', () => {
        const signin: bool = CONTRACT.signin("Carlos Huerta Garcia", "huerta2502@hotmail.com", "1234root");
        expect(signin).toBe(true);
        const login: bool = CONTRACT.login("huerta2502@hotmail.com", "1234admin");
        expect(login).toBe(false);
    });
})

describe("new collective", () => {
    it('should return false', () => {
        const collectiveId: string = new Collective("Proyecto TT", "Proyecto", "https://www.google.com").collectiveId;
        const newCollectiveId: string = CONTRACT.newCollective("Proyecto TT", "Proyecto", "https://www.google.com");
        expect(newCollectiveId).toBe(collectiveId);
    });
})

describe("new collective duplicated", () => {
    it('should return false', () => {
        const collectiveId: string = new Collective("Proyecto TT", "Proyecto", "https://www.google.com").collectiveId;
        const newCollectiveId: string = CONTRACT.newCollective("Proyecto TT", "Proyecto", "https://www.google.com");
        expect(newCollectiveId).toBe(collectiveId);
        const newCollectiveDuplicateId: string = CONTRACT.newCollective("Proyecto TT", "Proyecto", "https://www.google.com");
        expect(newCollectiveDuplicateId).toBe("");
    });
})

describe("add user to collective", () => {
    it('should return true', () => {
        const signin: bool = CONTRACT.signin("Carlos Huerta Garcia", "huerta2502@hotmail.com", "1234root");
        expect(signin).toBe(true);
        const collectiveId: string = new Collective("Proyecto TT", "Proyecto", "https://www.google.com").collectiveId;
        const newCollectiveId: string = CONTRACT.newCollective("Proyecto TT", "Proyecto", "https://www.google.com");
        expect(newCollectiveId).toBe(collectiveId);
        const result: bool = CONTRACT.addUser2Collective(newCollectiveId, context.sender);
        expect(result).toBe(true);
    });
})

describe("add incorrect user to collective", () => {
    it('should return false', () => {
        const signin: bool = CONTRACT.signin("Carlos Huerta Garcia", "huerta2502@hotmail.com", "1234root");
        expect(signin).toBe(true);
        const collectiveId: string = new Collective("Proyecto TT", "Proyecto", "https://www.google.com").collectiveId;
        const newCollectiveId: string = CONTRACT.newCollective("Proyecto TT", "Proyecto", "https://www.google.com");
        expect(newCollectiveId).toBe(collectiveId);
        const result: bool = CONTRACT.addUser2Collective(newCollectiveId, context.sender + "1");
        expect(result).toBe(false);
    });
})

describe("add user to incorrect collective", () => {
    it('should return false', () => {
        const signin: bool = CONTRACT.signin("Carlos Huerta Garcia", "huerta2502@hotmail.com", "1234root");
        expect(signin).toBe(true);
        const collectiveId: string = new Collective("Proyecto TT", "Proyecto", "https://www.google.com").collectiveId;
        const newCollectiveId: string = CONTRACT.newCollective("Proyecto TT", "Proyecto", "https://www.google.com");
        expect(newCollectiveId).toBe(collectiveId);
        const result: bool = CONTRACT.addUser2Collective(newCollectiveId+"1", context.sender);
        expect(result).toBe(false);
    });
})

describe("user collectives", () => {
    it('should return collectives', () => {
        const signin: bool = CONTRACT.signin("Carlos Huerta Garcia", "huerta2502@hotmail.com", "1234root");
        expect(signin).toBe(true);
        const collective : Collective = new Collective("Proyecto TT", "Proyecto", "https://www.google.com");
        const collectiveId: string = collective.collectiveId;
        const newCollectiveId: string = CONTRACT.newCollective("Proyecto TT", "Proyecto", "https://www.google.com");
        expect(newCollectiveId).toBe(collectiveId);
        const result: bool = CONTRACT.addUser2Collective(newCollectiveId, context.sender);
        expect(result).toBe(true);
        const collectives: string[] = CONTRACT.getUserCollectives(context.sender);
        const expected: Collective[] = [];
        expected.push(collective);
        expect(collectives.toString()).toBe(expected.toString());
    });
})

describe('new collective deliberation', () => {
    it('should return deliiberation', () => {
        const signin: bool = CONTRACT.signin("Carlos Huerta Garcia", "huerta2502@hotmail.com", "1234root");
        expect(signin).toBe(true);
        const collective : Collective = new Collective("Proyecto TT", "Proyecto", "https://www.google.com");
        const collectiveId: string = collective.collectiveId;
        const newCollectiveId: string = CONTRACT.newCollective("Proyecto TT", "Proyecto", "https://www.google.com");
        expect(newCollectiveId).toBe(collectiveId);
        const result: bool = CONTRACT.addUser2Collective(newCollectiveId, context.sender);
        expect(result).toBe(true);
        const collectives: string[] = CONTRACT.getUserCollectives(context.sender);
        const expcollectives: Collective[] = [];
        expcollectives.push(collective);
        expect(collectives.toString()).toBe(expcollectives.toString());
        const expDeliberation: Deliberation = new Deliberation('deliberation 1', 'number 1 deliberation', 'stream',
        collective.collectiveId, 'today', context.sender);
        const deliberation: string = CONTRACT.newCollectiveDeliberation('deliberation 1', 'number 1 deliberation',
        'stream', collective.collectiveId, 'today');
        expect(deliberation).toBe(expDeliberation.toString());
    })
})

describe('collective deliberations', () => {
    it('should return deliberations', () => {

    })
})
