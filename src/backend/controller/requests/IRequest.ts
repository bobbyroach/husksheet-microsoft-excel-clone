//@owner Arnav Sawant
import Spreadsheet from "../../Spreadsheet";
import Model from "../../Model";

// Interface for a request. Requests are designed using the strategy design pattern, each having a excecute function which makes changes to the model which is passed in.

//To make a new Request, please implement this interface and add the logic to the execute function. The execute function should make a request/reqests to the API and change the model/session according to information which you would like to be used for the rendering of the UI. Please referance ARequest for more information on how to use the abstract class  for requests which use basic authentication.
export interface IRequest {
    //Function which is to make requests to the API and change the model/session accordingly
    execute(Model: Model): void;
}