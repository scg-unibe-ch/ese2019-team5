import * as fs from "fs";

const pathToServicePictures = "../pictures/services";

export class FileHandlerService {

  public test(eventServiceId: number): Buffer{
    const path = pathToServicePictures + "/" + String(eventServiceId) + "/" + String(eventServiceId) + ".png";

    const file = fs.readFileSync(path, 'base64');


    let buffer = Buffer.from(file, 'base64');

    return buffer;


  }

  public getPictureFromServiceId(eventServiceId: number): string{
    const path = pathToServicePictures + "/" + String(eventServiceId) + "/" + String(eventServiceId) + ".png";
    if (fs.existsSync(path)) {
      return fs.readFileSync (path, 'base64');
    } else {
      return '';
    }
  }

  public safeServicePictures(base64Data: string, eventServiceId: number){
    const path = this.createFolder(eventServiceId);
    console.log(path);
    //console.log(base64Data);

    fs.writeFile(path + "/" + String(eventServiceId) +".png", base64Data, 'base64', function(err) {
      console.log(err);
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
        throw Error("couldn't create folder for pictures");
      }
    }

    return path;

  }
}

