import {Table, Column, Model, HasMany, BelongsTo, ForeignKey} from 'sequelize-typescript';
import {User} from './user';


// TODO noch absprechen wie speichern // hier drin funktionen
@Table
export class UserModel extends Model<User> {

  @Column
  name!: string;
  pwhash!: number;
  surname!: string;

  /* @Column
   done!: boolean;
*/
   @ForeignKey(() => User)
   @Column
   email!: string;

   @BelongsTo(() => User)
   user!: User;


   toSimplification(): any {
     return {
       'pwhash': this.pwhash,
       'name': this.name,
       'email': this.email,
       'surname': this.surname,
     };
   }

   fromSimplification(simplification: any): void {
     this.name = simplification['name'];
     this.pwhash = simplification['pwhash'];
     this.email = simplification['email'];
     this.surname = simplification['surname'];
   }
}
