import {User} from './user.model';

/**
 * till now only used for testing if the database works correctly
 */
export class SqlResult {

    user:  User[] = [];

    addUser( newUser: User) {
        this.user.push(newUser);
    }
}

