import {User} from './user.model';

export class SqlResult {

    user:  User[] = [];

    addUser( newUser: User) {
        this.user.push(newUser);
    }
}

