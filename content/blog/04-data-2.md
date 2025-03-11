---
title: "Schedule and Other Data"
date: 2025-03-11
---
We have [figured out](https://georailway.com/blog/02-data/) the geodata. Now I'll tell you about the rest: the schedule and various details about routes and stations.

The starting point is the schedule on the [main website](https://www.railway.ge/en/traffic-general-schedule/). It does not contain intermediate stations, but it does have all current routes and times at the terminal stations. It is regularly updated. I check this schedule every hour with a custom parser and compare it with its local copy. When changes occur, a bot in Telegram notifies me about them. Something like this:
![Schedule Check Bot](/images/04-blog-1.png)

I store all route information, amusingly enough, in an Excel spreadsheet. On the first sheet are all the routes with their attributes, and on the others - the schedule for each train. I started this project on a whim and without any particular plans, everything was done manually, so Excel was a convenient option.

So, changes in the schedule on the site. I simply mark a removed route as such in the table. A changed one is more complicated, as I need to find out the new schedule for each station along the way.

Adding a new route to the table is not enough. It must first be committed to OSM so that I can render it on the map. After that, I also need to find a list of all stations and their arrival times.

Tickets for some trains are sold online, so I can parse the schedule for them. For some others, the schedule sometimes appears on a new site. Indeed, sometimes - at the time of writing this post, for example, there is no data at all. Photos of sheets from station ticket offices, city chats, rare posts by bloggers also help, but all this is unreliable and short-lived material.

I mainly took the types of trains and carriages from [railgallery.ru](https://railgallery.ru/list.php?cid=73&st=1000), a great site. Prices - in an inconvenient table on the GR website. There are also descriptions for several stations. For example, [Kutaisi-1](https://georailway.com/stations/kutaisi1/). I write them myself, of course.

In general, at the core of everything is a table, the data for which is painstakingly collected manually. Several Python scripts convert it into a series of JSONs for the site. The site is hosted on Github Pages, which means it has no backend. The static content is generated using Hugo when deploying the repository. 