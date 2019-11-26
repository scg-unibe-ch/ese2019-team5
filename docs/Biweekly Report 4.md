# Biweekly report (27.11.2019) 

###### General Issues:
We had some trouble with getting the picture to the back. Sophie tried it first, then Gillian tried and finally Cyrill succeeded in sending it back. The problem was that we could not assign a value form an
intern function to a variable in the function. We tried with return, without return, with directly saving it in the variable of the function but nothing worked. Through the process we learnt that the inner function 
knwos the value of the outer function but not the other way around, whicht makes also sense.



###### Backend:
I struggled a bit with improving the coding architecture of sending a mail. I tried to implement the template pattern. I looked at tutorials and watched videos of the template pattern being implemented in Typescript.
But the problem was that an abstract method can not be static and the "main" method had to bestatic in order for the nodemailer to work. So I tried to make one Class with all the possible versions and work with flags,
but that was really messy. So I decided to have a parent class and extend it and then implement the smaller methods in the childern class. That was I solution I am ok with because it eliminated some duplicated code.

I am happy that implementing search as well as the order part in the backend went reasonably well. Testing helped  a lot, especially since it wasn't implemented in the frontend yet. I struggled slightly with sending the
data of an event service to the front in a way that they could actually use it and not only display it in the console. The solution there was found by Lars by not sending an array but only one event service.

###### Frontend:


