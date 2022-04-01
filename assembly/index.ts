/**
 * 
 */
import {
    context, // visibility into account, contract and blockchain details
    logging, // append to the execution environment log (appears in JS Developer Console when using near-api-js)
} from "near-sdk-as";
import {userRegistry, collectiveRegistry, deliberationRegistry, resultRegistry, resourceRegistry, followupRegistry,
    User, Collective, Deliberation, Resource, Result, FollowUp, Timestamp } from "./model"

@nearBindgen
export class Contract {
    signin(name: string, mail: string, password: string): bool {
        const exists: bool = userRegistry.contains(context.sender);
        if(exists) {
            logging.log("User already in network");
            return false;
        }
        userRegistry.set(context.sender, new User(context.sender, name, mail, password));
        return true;
    }

    login(mail: string, password: string): bool {
        const user: User | null = userRegistry.get(context.sender);
        if(!user) {
            logging.log("User not registered in the network");
            return false;
        }
        if(user.mail != mail || user.password != password) {
            logging.log("Wrong credentials");
            return false;
        }
        return true;
    }

    newCollective(name: string, type: string, infoUrl: string): string {
        if(name == "" || type == "" || infoUrl == "") {
            logging.log("Invalid parameters");
            return "";
        }
        let collective: Collective = new Collective(name, type, infoUrl);
        const exists: bool = collectiveRegistry.contains(collective.collectiveId);
        if(exists) {
            logging.log("Collective already in network");
            return "";
        }
        collectiveRegistry.set(collective.collectiveId, collective);
        return collective.collectiveId;
    }

    addUser2Collective(collectiveId: string, userId: string): bool {
        const user: User | null = userRegistry.get(userId);
        const collective: Collective | null = collectiveRegistry.get(collectiveId);
        if(!user || !collective) {
            logging.log("Collective or user not registered in the network");
            return false;
        }
        collective.addUser(userId);
        user.addCollective(collectiveId);
        return true;
    }

    getUserCollectives(userId: string): string[] {
        const user: User | null = userRegistry.get(userId);
        if(!user) {
            logging.log("User not registered in the network");
            return [];
        }
        let collectiveIds: string[] = user.collectives;
        let collectives: string[] = [];
        let collective: Collective | null;
        for(let i = 0; i < collectiveIds.length; i++) {
            collective = collectiveRegistry.get(collectiveIds[i]);
            if(collective) collectives.push(collective.toString());
        }
        return collectives;
    }

    getCollectiveDeliberations(collectiveId: string): string[] {
        const collective: Collective | null = collectiveRegistry.get(collectiveId);
        if(!collective) {
            logging.log("Collective not registered in the network");
            return [];
        }
        let deliberationIds: string[] = collective.deliberations;
        let deliberations: string[] = [];
        let deliberation: Deliberation | null;
        for(let i = 0; i < deliberationIds.length; i++) {
            deliberation = deliberationRegistry.get(deliberationIds[i]);
            if(deliberation) deliberations.push(deliberation.toString());
        }
        return deliberations;
    }

    newCollectiveDeliberation(name: string, description: string, tool: string, collectiveId: string,
        deliberationDate: string): string {
        const collective: Collective | null = collectiveRegistry.get(collectiveId);
        if(!collective) {
            logging.log("Collective not registered in the network");
            return '';
        }
        const deliberation: Deliberation = new Deliberation(
            name, description, tool, collectiveId, deliberationDate, context.sender);
        deliberationRegistry.set(deliberation.deliberationId, deliberation);
        collective.addDeliberation(deliberation.deliberationId);
        return deliberation.toString();
    }

    newDeliberationResource(name: string, type: string, description: string, url: string, deliberationId: string,
        timestamp: Timestamp): string {
        const deliberation: Deliberation | null = deliberationRegistry.get(deliberationId);
        if(!deliberation) {
            logging.log("Deliberation not registered in the network");
            return '';
        }
        const resource: Resource = new Resource(name, type, description, url, deliberationId, timestamp, context.sender);
        resourceRegistry.set(resource.resourceId, resource);
        deliberation.addResource(resource.resourceId);
        return resource.toString();
    }

    newDeliberationResult(name: string, description: string, deliberationId: string, checkoutUrl: string,
        timestamp: Timestamp, checkerAccountId: string): string {
        const deliberation: Deliberation | null = deliberationRegistry.get(deliberationId);
        if(!deliberation) {
            logging.log("Deliberation not registered in the network");
            return '';
        }
        const result: Result = new Result(name, description, deliberationId, "", checkoutUrl, timestamp, checkerAccountId);
        resultRegistry.set(result.resultId, result);
        deliberation.addResult(result.resultId);
        return result.toString();
    }

    newResultFollopUp(status: string, monitoringUrl: string, evaluationDate: string, deliberationId: string,
        resultId: string): string {
        const result: Result | null = resultRegistry.get(resultId);
        if(!result) {
            logging.log("Result not registered in the network");
            return '';
        }
        const followup: FollowUp = new FollowUp(
            status, monitoringUrl, evaluationDate, deliberationId, resultId, context.sender);
        followupRegistry.set(followup.followUpId, followup);
        result.followUpId = followup.followUpId;
        return followup.toString();
    }

    getDeliberationResources(deliberationId: string): string[] {
        const deliberation: Deliberation | null = deliberationRegistry.get(deliberationId);
        if(!deliberation) {
            logging.log("Deliberation not registered in the network");
            return [];
        }
        let resourceIds: string[] = deliberation.resources;
        let resources: string[] = [];
        let resource: Resource | null;
        for(let i = 0; i < resourceIds.length; i++) {
            resource = resourceRegistry.get(resourceIds[i]);
            if(resource) resources.push(resource.toString());
        }
        return resources;
    }

    getDeliberationResults(deliberationId: string): string[] {
        const deliberation: Deliberation | null = deliberationRegistry.get(deliberationId);
        if(!deliberation) {
            logging.log("Deliberation not registered in the network");
            return [];
        }
        let resultIds: string[] = deliberation.results;
        let results: string[] = [];
        let result: Result | null;
        for(let i = 0; i < resultIds.length; i++) {
            result = resultRegistry.get(resultIds[i]);
            if(result) results.push(result.toString());
        }
        return results;
    }

    getFollowUp(resultId: string) : string {
        const result: Result | null = resultRegistry.get(resultId);
        if(!result) {
            logging.log("Result not registered in the network");
            return '';
        }
        let followUpId :string = result.followUpId;
        let followUp: FollowUp | null = followupRegistry.get(followUpId);
        if(!followUp) {
            logging.log("FollowUp not registered in the network");
            return '';
        }
        return followUp.toString();
    }

    setFollowUp(followUpId: string, status: string, monitoringUrl: string): string {
        const followUp: FollowUp | null = followupRegistry.get(followUpId);
        if(!followUp) {
            logging.log("FollowUp not registered in the network");
            return '';
        }
        followUp.status = status;
        followUp.monitoringUrl = monitoringUrl;
        followupRegistry.set(followUpId, followUp);
        return followUp.toString();
    }

}