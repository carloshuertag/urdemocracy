/**
 * 
 */
import {
    context, // visibility into account, contract and blockchain details
    logging // append to the execution environment log (appears in JS Developer Console when using near-api-js)
} from "near-sdk-as";
import {userRegistry, collectiveRegistry, deliberationRegistry, resultRegistry, resourceRegistry, followupRegistry,
    User, Collective, Deliberation, Resource, Result, FollowUp } from "./model"

@nearBindgen
export class Contract {
    signin(name: string, mail: string, password: string): bool {
        const exists = userRegistry.contains(context.sender);
        if(exists) {
            logging.log("User already in network");
            return false;
        }
        userRegistry.set(context.sender, new User(context.sender, name, mail, password));
        return true;
    }

    login(mail: string, password: string): bool {
        const user = userRegistry.get(context.sender);
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
        const exists = collectiveRegistry.contains(name + type + infoUrl);
        if(exists) {
            logging.log("Collective already in network");
            return "";
        }
        collectiveRegistry.set(name + type + infoUrl, new Collective(name, type, infoUrl));
        return name + type + infoUrl;
    }

    addUser2Collective(collectiveId: string, userId: string): bool {
        const collective = collectiveRegistry.get(collectiveId);
        if(!collective) {
            logging.log("Collective not registered in the network");
            return false;
        }
        collective.addUser(userId);
        return true;
    }

    

}