# Biweekly report (27.11.2019) 

###### General Issues:
We had some trouble with getting the picture to the back. Sophie tried it first, then Gillian tried and finally Cyrill succeeded in sending it back. The problem was that we could not assign a value form an
intern function to a global variable. We tried with return, without return, with directly saving it in the variable of the function but nothing worked. Through the process we learnt that the inner function 
knwos the value of the outer function but not the other way around, whicht makes also sense. The solution was to return the variable as an observable, to subscribe to it and assign the value then.



###### Backend:
I struggled a bit with improving the coding architecture of sending a mail. I tried to implement the template pattern. I looked at tutorials and watched videos of the template pattern being implemented in Typescript.
But the problem was that an abstract method can not be static and the "main" method had to bestatic in order for the nodemailer to work. So I tried to make one Class with all the possible versions and work with flags,
but that was really messy. So I decided to have a parent class and extend it and then implement the smaller methods in the childern class. That was I solution I am ok with because it eliminated some duplicated code.

I am happy that implementing search as well as the order part in the backend went reasonably well. Testing helped  a lot, especially since it wasn't implemented in the frontend yet. I struggled slightly with sending the
data of an event service to the front in a way that they could actually use it and not only display it in the console. The solution there was found by Lars by not sending an array but only one event service.

###### Frontend:
Implementing the search feature felt like a huge success.
Thanks to the experience we gained in the last few weeks and excellent (!) preparatory work of Gillian and Cyrill in backend, it went quickly and without any struggles.
At least that's what we thought. 
But then, we realised on 26.11.2019 that one filter (subtype) did not work as supposed. 
We felt a big pressure as we had to do usability tests on the next day and this filter was part of one test.
We located the bug in backend but so far we have not found any solution yet.
From that experience, we learned to (manually) test our code more carefully as this would have been a bug easy to detect.
It's difficult to write unit tests for frontend as a lot of pages contain forms or changes a lot.
E.g. we had to change some tests each time someone adds a service to the DB.
But this makes thorough manual testing even more important.

After managing to send the pictures to backend, we also had to get them back from there and display them on our ServiceCards.
This was not as easy as we thought.
First, we implemented a preview of the images when creating a service. 
It was not easy, but it worked after a while.
We had to adapt some of Cyrill's implementation so the entire base64-String was stored in our variable.
Then we tried to implement to display the image on the card and we are still a bit stucked with it.
We suspect that the issues are related to different file types (png/jpg etc.).
So far, all pictures are stored as .png-files in a folder in our project.
Some of them cannot be displayed (when opening them with any software).
But is a jpg file converted to a base64 String in a different way than a png file?
And can base64 Strings from jpg files be read as png files?



