import * as fs from "fs";
import {DBServiceError} from "../errors/DBService.error";

const pathToServicePictures = "../pictures/services";

export class FileHandlerService {

  public test(eventServiceId: number): Buffer{
    const path = pathToServicePictures + "/" + String(eventServiceId) + "/" + String(eventServiceId) + ".png";

    const file = fs.readFileSync(path, 'base64');


    let buffer = Buffer.from(file, 'base64');

    return buffer;


  }

  public  getPictureFromServiceId(eventServiceId: number): string{
    const path = pathToServicePictures + "/" + String(eventServiceId) + "/" + String(eventServiceId) + ".jpg";
    if (fs.existsSync(path)) {

      return "data:image/jpeg;base64," + fs.readFileSync (path, 'base64');
    } else {
      return '';
    }
  }

  public safeServicePictures(base64Data: string, eventServiceId: number){
    const path = this.createFolder(eventServiceId);
    const type = base64Data.split(";")[0].split("/")[1];


    fs.writeFile(path + "/" + String(eventServiceId) +"." + type, base64Data, 'base64', function(err) {
      console.log(err);
      throw new DBServiceError("There was an Error while saving your picture on our server. Please Try again.",902)
    });
  }

  public createFolder(eventServiceId: number): string{
    const path = pathToServicePictures+"/"+String(eventServiceId);
    if (fs.existsSync(path)) {
      console.log("already exits");
    } else {
      try{
        fs.mkdirSync(path);
      } catch (e) {
        throw new DBServiceError("There was an Error while saving your picture on our server. Please Try again.",901);
      }
    }

    return path;

  }
}

