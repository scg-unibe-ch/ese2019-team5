import * as fs from "fs";

const pathToServicePictures = "../pictures/services";

export class FileHandlerService {

  public test(n:number){
    try{
      fs.mkdirSync(pathToServicePictures+"/"+String(n));
    } catch (e) {
      throw Error("couldn't create folder for pictures");
    }

  }


  public safeServicePictures(files: File[], eventServiceId: number){
    try{
      fs.mkdirSync(pathToServicePictures+"/"+String(eventServiceId));
    } catch (e) {
      throw Error("couldn't create folder for pictures");
    }

    for(const file in files){

    }
  }
}
