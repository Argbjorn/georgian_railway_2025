---
title: "Geodata"
date: 2025-02-20
draft: false
---
The main challenge of this project is, of course, finding and collecting data. Here, I’ll talk about geodata: the railway network, stations, and routes.

This entire website started as a small local exercise: I was curious about implementing a map using data from [OpenStreetMap](https://www.openstreetmap.org/). To put it briefly and simply, OSM is an open geodata database of the entire planet. It’s open in the sense that anyone can make changes to it, like Wikipedia. I started by adding the outline and information about my house. OSM is used in hundreds of applications and on hundreds of websites. For example, in Organic Maps, one of the most popular offline map and navigation apps.

I actively contributed to the Georgian part of OSM and had a good understanding of the available data. For example, the railway network is mapped quite well, with most stations and some routes included. Not a bad starting point.

## Railway Network
There are many ways to get information from OSM. The simplest and most visual one is [Overpass API](https://overpass-turbo.eu/). After getting familiar with the query language, you can extract almost anything. Here’s the query for the Georgian railway network:
```
[out:json][timeout:25];
( area[name="საქართველო"]; )->.searchArea;
nwr["railway"="rail"]["usage"!="industrial"]["service"!="spur"]["service"!="yard"]["service"!="siding"](area.searchArea);
out geom;
```
In this query, I filtered out track types not used for passenger services. Previously, I ran this query every time a page was viewed for some reason, but now the raw data from Overpass is simply stored in the project and loads almost instantly. Updates are infrequent.

## Routes
A route is a more complex entity than the railway network, which is essentially just a branching line on a map. Routes consist of several railway lines connecting multiple stations, along with information about the route itself: name, duration, operating company, and so on. OSM has a special data type for such entities — a relation.

Most routes had already been added to OSM, but many of them needed updating. It turned out that to use the data from OSM, I first had to add and edit it there (I’ll cover that in another post). Eventually, when clicking on a route on the map, the website sends a query to Overpass and displays the lines and stations of the relation on the map.

## Stations
Stations were the easiest part. I take all the routes, extract the list of stations with their names and coordinates, and display them on the map.

The result is a map that is valuable on its own, clearly showing where you can travel by train:
![Map](/images/02-blog-1.png)
The large branches without stations in the south and east of Georgia are partially used for freight traffic, but there are no active passenger stations there.