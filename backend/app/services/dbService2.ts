import {Client} from "ts-postgres";

export class DBService2 {
  private getClient(): Client {

    const config = {
      'user' : 'cyrill',
      //'user' : 'postgres',
      'host' : '34.65.95.137',
      //'host' : 'localhost',
      'password' : 'eseTeam5_2019!',
      //'password' : 'root',
      'port' : 5432,
      'database' : 'eventdoo',
    };
    return new Client(config);
  }

  public async test() {
    const client = this.getClient();
    await client.connect();
    try {
      const stream = await client.query("SELECT * FROM users");
      console.log(stream);
    } catch (e) {
      console.log(e);
    }


    console.log("hellooooo");



    await client.end();
  }
}
