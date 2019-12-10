# Eventdoo Service
Eventdoo is a platform that helps you organise your events by providing a marketplace to offer and order services.

It was developed as a group project as part of the lecture Introduction to Software Engineering in the Bachelor's program of Computer Science at the university of Bern.

The application is tested on Windows 10 it should theoretically run on Mac OS and Linux as well (the procedere to install it cloud be a bit different) but since we didn't verify this we do not guarantee it. 

## Prerequisites
To get started you need to install Node.js and NPM on your machine.
You can download the latest version right here https://nodejs.org/en/. NPM is automatically installed with the latest version of Node.js.
You can verify the installation by running `node -v` and `npm -v` in your desired terminal.

#### General Setup
Then you need to install [Angular CLI](https://cli.angular.io/), [Ionic](https://ionicframework.com/) and [Express](https://expressjs.com/de/) by running the following commands in your terminal of choice. (Powershell, cmd etc.).

- `npm install -g @angular/cli`
- `npm install -g ionic`
- `npm install -g express`

The Angular and the Ionic framwork were used in the frontend part of this project to develop an application that runs on your PC as well as your mobile device.
The Express framework is used for the backend part.

#### Database

The database we use is an PostgreSQL database. Until January 2020 this database is hosted on Google Cloud services. Afterwards we will take it down from there to avoid costs.

Since this is a service from Google and we don't have any control over the server we do not guarantee that it will work all the time.

If the Google database doesn't work or it is after January 2020 then you will have to refer to `How to install the database locally`.

## Run the application

Now you can clone our [git-repository](https://github.com/scg-unibe-ch/ese2019-team5).

Once you did this you you can start the application by executing the following steps in your terminal:

- `cd` in to the backend folder.
- Run `npm install`. This will install all de dependencies you need for the app to work correctly.
- Then compile the app with `npm run tsc` which will create a build folder with the typescript files compiled to javascript files.
- After this run `node build/server.js`. This will start the backend part of the application. If it was sucessful it should say something similar to `Listening at http://localhost:3000/`

Now the backend is running. Following the steps to get the frontend started as well. It is important that you run them in an diffrent instance of your terminal:

- `cd` in to the frontend folder.
- Run `npm install` which again will install the required dependencies.
- Run `ng serve` to open the applicaiton in your default web browser on `http://localhost:4200/`.
(Depending on your setting this command will not work in PowerSehll. It will say that you're not allowed to run scripts. Just try the normal commandline `cmd` and it should work. Otherwise you'll have to change your security guidelines.)

  

## How to install the database locally

#### Install PostgreSQL

- Fist of all you need to download and install PostgreSQL 11 from `https://www.postgresql.org/download/windows/`.
(We used version 11, it may also work with version 12 but we didn't verify this and do not guarantee it.)
    - Make sure to select `pgAdmin 4`, `PostgreSQL server`, `Command Line Tools`, `Stack Builder` (all options) when you're asked to select components.
    - When you're asked to set a password enter `root`(If you choose an other password you'll have to change this in the code: `backend/app/services/db.services.ts` line 40)
    - Leave the port on `5432`

- You probably have to restart your computer to complete the installation.


#### Import our database

- Once you installed PostgreSQL open pgAdmin 4
- Right Click on the existing postgres database and select Restore.
    - Leave the Format on `Custom or tar`
    - Filename: navigate to the `eventdoo_db` file in the `/DB_dump/`folder.
    - Number of jobs: leve this emtpy.
    - Role name: choose postgres
    - Change to the Restore options tab and select the as in the picture below:
    <img src="./restoreOptions.png" alt="drawing" width="400"/>
    - Hit the `Restore` button

As soon as this tak has completed sucessfully you can rightclick `Refresh` on Databases and the `eventdoo` database should appear.

Now that you've setup your local database server you need to modify our app to tell it to use the local and not the Google database.

#### Change between local and Google database

To change to the local database you'll need to edit the `getClient` method in the file  [`db.services.ts`](./backend/app/services/db.services.ts).

You have to uncomment line `37 to 43` and declare line `47 to 53` as comment.

Generally is this method the place to configure the connection parameters to the database.

## Project structure
This project contains two important folders - the backend and the frontend folder - both these folders contain their own projects.

The backend contains the Express application that reacts to HTTP requests.

The frontend contains an Ionic application that sends HTTP requests to the backend.


## Technologies used

- Node.js
- Express
- Angular
- Ionic
- PostgreSQL

## Documentation
You can find all the documentation to this project in the `docs` folder.
- The Software Requirements Specification (SRS) can be found [here](./docs/Eventdoo_SRS.pdf) (/docs/Eventdoo_SRS.pdf)
- You'll find our Backlog and our Sprint Planning [here](./docs/Backlog_and_Sprint_Planning)
- Our Biweekly Reports can be found [here](./docs/Biweekly_Reports)
- An UI prototype can be found [here](./docs/UI_prototype)
- Usability Testing can be found [here](./docs/Usability_Tests/Usability_Tests_and_documentation.pdf).
Scince the screen recordings of the usability tests are to big to upload to gitHub we uploaded them to an OneDrive folder. [This](https://1drv.ms/u/s!AoTzF0eKgl2li4QyLkhdx9qqvHO0Bg?e=804xpj) is the link to this folder. The folder will similar to the Google database be up and running until end of January 2020. Afterwards the link will not work anymore.   

## Futher questions

If you have any questions on how to use this application please refer to the [`About Eventdoo`](http://localhost:4200/start/about-eventdoo) (link only works when the application is actually running on your system) page in the application and our [SRS](./docs/Eventdoo_SRS.pdf).

## License

This Project is intended for private use only. If you can use parts of it for your own private project go ahead but we do not take responsiblity for any errors it may cause.