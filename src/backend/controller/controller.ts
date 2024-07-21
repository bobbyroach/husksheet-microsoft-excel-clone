//@owner Arnav Sawant
import Model from "../Model";
import { IRequest } from "./requests/IRequest";

// Controller class that is responsible for handling requests to the API and updating the model/session accordingly
class Controller {
    // The model/session
    private Model: Model;

    constructor() {
        this.Model = new Model();
    }

    // Get the model/session
    getModel() {
        return this.Model
    }

    // Execute a request, requests are made by the UI and are handled by the controller
    async excecuteRequest(request: IRequest): Promise<void> {
        return request.execute(this.Model)
    }
}

export default Controller