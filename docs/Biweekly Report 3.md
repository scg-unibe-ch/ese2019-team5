# Biweekly report (13.11.2019) 

###### General Issues:
It was a bit frustrating that we did not manage to reach all goals we set as milestone 2 by 06.11.
This is why we had to extend the deadline by one week.
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


###### Frontend:



