---
title: "Train to Yerevan Added"
date: 2025-06-18
---

On June 14th, an extended train route to Armenia was launched. Previously, it ran from Tbilisi to Yerevan, but during the summer period it now starts from Batumi. On this occasion, I finally added the first international train to the website. Please welcome: [201 Batumi → Yerevan](https://georailway.com/routes/201), [202 Yerevan → Batumi](https://georailway.com/routes/202).

I was hesitant to tackle this task for a long time, as the entire website was originally designed only for Georgian Railway trains. You might think, a train is a train, what's the difference? But there is one, and it's fundamental. Georgian Railway trains in the schedule always have only one timestamp - the departure time, which for the final station means the arrival time. International trains have two such timestamps, more familiarly: both departure and arrival. As a result, I had to dig into the code of every frontend page and all data generators.

Another feature: the "every other day" schedule. This definitely needs to be displayed on the website, and since in one month the train might run on even days, and in another - on odd days, this can only be clearly shown with a calendar. This was successfully implemented and also came in handy for the Tbilisi - Ozurgeti train, which also runs every other day.

It seems everything is ready for displaying the train to Baku when (if) it is launched.
