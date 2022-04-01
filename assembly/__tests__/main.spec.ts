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
        const newCollectiveId: string = CONTRACT.createCollective("Proyecto TT", "Proyecto", "https://www.google.com");
        expect(newCollectiveId).toBe(collectiveId);
    });
})

describe("new collective duplicated", () => {
    it('should return false', () => {
        const collectiveId: string = new Collective("Proyecto TT", "Proyecto", "https://www.google.com").collectiveId;
        const newCollectiveId: string = CONTRACT.createCollective("Proyecto TT", "Proyecto", "https://www.google.com");
        expect(newCollectiveId).toBe(collectiveId);
        const newCollectiveDuplicateId: string = CONTRACT.createCollective("Proyecto TT", "Proyecto", "https://www.google.com");
        expect(newCollectiveDuplicateId).toBe("");
    });
})