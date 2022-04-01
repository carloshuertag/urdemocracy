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

    createCollective(name: string, type: string, infoUrl: string): string {
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

    getUserCollectives(userId: string): Collective[] {
        const user: User | null = userRegistry.get(userId);
        if(!user) {
            logging.log("User not registered in the network");
            return [];
        }
        let collectiveIds = user.collectives;
        let collectives: Collective[] = [];
        let collective: Collective | null;
        collectiveIds.forEach(collectiveId => {
            collective = collectiveRegistry.get(collectiveId);
            if(collective) collectives.push(collective);
        });
        return collectives;
    }

    getCollectiveDeliberations(collectiveId: string): Deliberation[] {
        const collective: Collective | null = collectiveRegistry.get(collectiveId);
        if(!collective) {
            logging.log("Collective not registered in the network");
            return [];
        }
        let deliberationIds: string[] = collective.deliberations;
        let deliberations: Deliberation[] = [];
        let deliberation: Deliberation | null;
        deliberationIds.forEach(deliberationId => {
            deliberation = deliberationRegistry.get(deliberationId);
            if(deliberation) deliberations.push(deliberation);
        });
        return deliberations;
    }

    newCollectiveDeliberation(name: string, description: string, tool: string, collectiveId: string,
        deliberationDate: string): Deliberation | null {
        const collective: Collective | null = collectiveRegistry.get(collectiveId);
        if(!collective) {
            logging.log("Collective not registered in the network");
            return null;
        }
        const deliberation: Deliberation = new Deliberation(
            name, description, tool, collectiveId, deliberationDate, context.sender);
        deliberationRegistry.set(deliberation.deliberationId, deliberation);
        collective.addDeliberation(deliberation.deliberationId);
        return deliberation;
    }

    newDeliberationResource(name: string, type: string, description: string, url: string, deliberationId: string,
        timestamp: Timestamp): Resource | null {
        const deliberation: Deliberation | null = deliberationRegistry.get(deliberationId);
        if(!deliberation) {
            logging.log("Deliberation not registered in the network");
            return null;
        }
        const resource: Resource = new Resource(name, type, description, url, deliberationId, timestamp, context.sender);
        resourceRegistry.set(resource.resourceId, resource);
        deliberation.addResource(resource.resourceId);
        return resource;
    }

    newDeliberationResult(name: string, description: string, deliberationId: string, checkoutUrl: string,
        timestamp: Timestamp, checkerAccountId: string): Result | null {
        const deliberation: Deliberation | null = deliberationRegistry.get(deliberationId);
        if(!deliberation) {
            logging.log("Deliberation not registered in the network");
            return null;
        }
        const result: Result = new Result(name, description, deliberationId, "", checkoutUrl, timestamp, checkerAccountId);
        resultRegistry.set(result.resultId, result);
        deliberation.addResult(result.resultId);
        return result;
    }

    newResultFollopUp(status: string, monitoringUrl: string, evaluationDate: string, deliberationId: string,
        resultId: string): FollowUp | null {
        const result: Result | null = resultRegistry.get(resultId);
        if(!result) {
            logging.log("Result not registered in the network");
            return null;
        }
        const followup: FollowUp = new FollowUp(
            status, monitoringUrl, evaluationDate, deliberationId, resultId, context.sender);
        followupRegistry.set(followup.followUpId, followup);
        result.followUpId = followup.followUpId;
        return followup;
    }

    getDeliberationResources(deliberationId: string): Resource[] {
        const deliberation: Deliberation | null = deliberationRegistry.get(deliberationId);
        if(!deliberation) {
            logging.log("Deliberation not registered in the network");
            return [];
        }
        let resourceIds: string[] = deliberation.resources;
        let resources: Resource[] = [];
        let resource: Resource | null;
        resourceIds.forEach(resourceId => {
            resource = resourceRegistry.get(resourceId);
            if(resource) resources.push(resource);
        });
        return resources;
    }

    getDeliberationResults(deliberationId: string): Result[] {
        const deliberation: Deliberation | null = deliberationRegistry.get(deliberationId);
        if(!deliberation) {
            logging.log("Deliberation not registered in the network");
            return [];
        }
        let resultIds: string[] = deliberation.results;
        let results: Result[] = [];
        let result: Result | null;
        resultIds.forEach(resultId => {
            result = resultRegistry.get(resultId);
            if(result) results.push(result);
        });
        return results;
    }

    getFollowUp(resultId: string) : FollowUp | null {
        const result: Result | null = resultRegistry.get(resultId);
        if(!result) {
            logging.log("Result not registered in the network");
            return null;
        }
        let followUpId :string = result.followUpId;
        let followUp: FollowUp | null = followupRegistry.get(followUpId);
        if(!followUp) {
            logging.log("FollowUp not registered in the network");
            return null;
        }
        return followUp;
    }

}