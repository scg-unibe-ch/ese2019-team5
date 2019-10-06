import {Table, Column, Model, HasMany, BelongsTo, ForeignKey} from 'sequelize-typescript';
import {User} from './user';


// TODO noch absprechen wie speichern
@Table
export class UserModel extends Model<User> {

  @Column
  name!: string;

  @Column
  done!: boolean;

  @ForeignKey(() => User)
  @Column
  todoListId!: number;

  @BelongsTo(() => User)
  user!: User;

  toSimplification(): any {
    return {
      'id': this.id,
      'name': this.name,
      'done': this.done
    };
  }

  fromSimplification(simplification: any): void {
    this.name = simplification['name'];
    this.pwhash = simplification['pwhash'];
    this.email = simplification['email'];
    this.surname = simplification['surname'];
  }




}
