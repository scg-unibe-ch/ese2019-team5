# Biweekly report (13.11.2019) 

###### General Issues:
It was a bit frustrating that we did not manage to reach all goals we set as milestone 2 by 06.11.
This is why we had to extend the deadline by one week. Also some of us didn't really get, that we only
have 3 weeks to go and that handing in to deadlines we agreed on as a team is crucial for others to continue.
Also, we feel high pressure as there is still a lot to do.
What both Front and Backend struggled with was, when we couldn't compile anymore.
Or when the compiler didn't properly work anymore. For example it was showing you data
in the console we asked in other versions but now anymore. The solution to the first problem was just install
typescript again and the solution for the second problem was to go through the build folder and make sure in the backend
build folder there is no frontend part.

###### Backend:
One of the two backend people got sick pretty much 2 weeks ago. So we tried to involve and keep him updated as much as
possible. Given the circumstances it worked pretty well. He was still able to work just slower, which helped a lot.
Thougth I found a bug, because testing finally worked it turned out it wasn't one but it helped me understand HTTP Client 
even better. It wasn't one because my test and my actual implementation did 2 different things, once the token was in the url
the other time it was in the body, which of course then made the test fail saying the token was malformed even though it wasn't.
Also struggeled a bit with the Builder pattern because none of the ways I implemented worked until finally Sophie found a way that 
was similar to what we learned in P2, which worked. I also learnt that commiting is really important because I pulled once without committing
before, so my work was gone. Also I felt like walking into a wall because some things like login crashed and the tests couldn't help
because the token you had there were expired. In the end I figured a way out to make the tests work as in fail and find the problem. 
Also learnt how the HTTP delete works with more than one parameter.

Considering the database there weren't any real problems. The only difficult thing was to define all the datatypes. The reason for this was that i 
expected the data in an other format than the frontend delivered it. But as soon as we decided on one datatype the problem was solved and the database worked.

Since there were quite a lot of changes to the database it was and still ist a blessing that we found a webhost for our database.

One challenge this time was to update the user data. The problem was that we didn't get the correct user data from the frontend but didn't notice for quite a
long time. This resulted in an error from our database service and we didn't know how to solve this error, but after noticing that we didn't get everything 
I tested the database part for itself and it worked. So it really just was the missing data that caused the error which is now resolved. 

###### Frontend:
One struggle was to access methods and data from objects returned by backend when posting a "get" http request.


Another struggle was to create the EventServiceCardComponent or, to be more precise, to display it in other pages.
First we wanted to render each EventServiceCard by itself but this was a bit complicated. 
A lot of errors occurred and the EventServicePage did not work anymore.
But as time was running out, we had to comspromise.
Instead of a CardComponent, we implemented a Card**S**Component which renders an Array of EventServices.
This enabled code re-use from "old" EventServicePage.
But then we realised that there was even a second benefit we did not think of: Backend returns an Array of EventServices anyways.

Some problems arose when trying to access an array of objects that is nested in a json, that is being sent from backend to frontend.
As of now this is still unsolved and we're contemplating sending the array of EventServices in a seperate Http request.

Another thing that was hard to track down, was the faulty information that was delivered via the edit profile function in the userprofile.
The source of the errors were then found to be misspelled statements in the userprofile html and the assignement of two seperate
inputs to a single variable.

On the brightside though manual testing is a whole lot easier with the database on an external server where all members of the team can read and write to.





