# Biweekly report (30.10.2019)

###### General Issues:
In the first week after the last biweekly report, we focused on the first milestone (authorization and authentication).
It was a huge effort but we managed to hand in a satisfying implementation in time and we are happy and proud about that.

One day after the deadline, we met to deliberate the past three weeks and to find solutions to problems and improvements in our working organization.
For example one of the group members likes to work on things that get done in the beginning so she is not that much involved right before the deadline.
As there was not (and still is not) defined a second milestone, we discussed about how to continue and what to implement next. 
Also, we set goals for the next two weeks:
1) Complete Milestone 1:
    Adding compulsory information to the sign up form: address data
    Add a "service" for the user if he did not see the email asking him/her to verify his/her address.
    Add a "service" for the user if he/she forgot the password.
    
 2) Add a profile page for every user where he/she can add information (e.g.a picture, phone number etc.)
 
 3) Add a page where all services are listed / shown
 
 4) Add the possibility to provide / publish a service in the App and 
    create a page where all provided services are published.

###### Backend:
In the backend especially before Milestone 1 we had the problem, that the backend to frontend communication 
wasn't working (as in not with the other group members but in the programm).
One of the mistakes we made was sending the wrong error to the front but also figuring out what data the
frontend actually needs wasn't easy. Talking about testing API the test finally works as in fails but at least it is an assertion error.

I still think that communication within backend is working quite well.
Also before Milestone 1 ended I felt that communication was working quite well.
But as I feared as soon as a Milestone is over people tend to take it a little bit less serious and 
communication as well as coding slows down. (But that is my personal view, that was also communicated to
the rest of the team).


Considering that the next step needs often adjustments to the database it would be very annoying to just go as it was with an database dump that everyone
has to import in to their own locally hosted database. So I researched how we could avoid this. The problem is, that  there just isn't a free webhost for Postgresql
but the Google Cloud Service (normally targeted at businesses) gives you when singing up a budget you can use. This generous budget combined with our very small 
requirements for the server allows us to use this service for the next 3 months for free. And since this course ends in december anyway this seems like the perfect
soulution.

###### Frontend:
We get along much better with the technologies and we are more efficient when searching for solutions for our problems.
It feels like we're developing some kind of "intuition" which makes it much more easier to code. 
A good chunk of work was needed to get past our initial frustrations and difficulties with the Http Client.
It was difficult to pinpoint the origin of some of our bugs, as we were not fully understanding how all our requests were sent
nor how it was handled exactly in the backend, as initially we mostly stuck to our domain of code we were allowed to modify (Backend and frontend)
But as we improved our communication, finding what went wrong suddenly became much more efficient and we exchanged the knowledge and
to some extent the technologies (for example having running databases on everyones side) of our "side" to allow both ends to fully run and test (right now manually) the program.

Looking ahead we're much more confident in actually being able to implement the features we're planning, as technical hiccups occure much less frequently.
Our first priority at the moment is to just make our features work. This includes some research on testing methods in the frontend.
At some point it would probably be wise to revise our code, maybe refactor a few things and overall make it more flexible and elegant, but right now
we're not at that point where there is an urgency for that, nor much room for code improvement. 

