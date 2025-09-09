---
title: "Switching to Vector Tiles"
date: 2025-09-09
---
Recently, I completed the migration of the maps to a new library and data source. Previously, I used [Leaflet](https://leafletjs.com/) and raster tiles from various providers. As the site grew in popularity, this became a problem — I was consuming free tile provider limits far too quickly. For example, in July, the 100k free tiles from [Thunderforest](https://www.thunderforest.com/) that they give per month ran out in just two weeks. My plan B was to switch to free tiles from [OpenStreetMap](https://www.openstreetmap.org/), but that was only a temporary solution. First, these tiles are strongly discouraged for production use. Second, they use the local language, and in the case of Georgia, a significant portion of users cannot read a single toponym.  
![Classic OSM Tiles](/images/07-blog-3.png "Classic OSM Tiles")

The desire to control the map’s language became another reason to change technologies. Thunderforest tiles duplicate the local name with its Latinized variant, but I wanted to give Russian users familiar Russian names, and for those who chose Georgian on the site — not to duplicate anything at all.

Running my own tile server seemed like too drastic a step. Switching to a paid tile provider plan for a non-commercial site didn’t make sense. In the end, I decided to replace raster tiles with vector ones. And since Leaflet doesn’t support vector without hacks, I had to abandon it in favor of [MapLibre GL](https://maplibre.org/). This solved all the current problems.

As a provider, I chose [Stadia Maps](https://stadiamaps.com/). 200k credits (read: tiles) per month on the free plan. Plus, their vector tile — unlike raster, and I’m not sure about other providers — is 4 times larger, meaning credits are consumed much more slowly. At the moment, the free plan is more than enough for me. By the way, thanks to [Webvisor](https://metrika.yandex.ru/promo/webvisor) I noticed that users sometimes used the map not for its intended purpose. Some started searching for their house in Kazan, or spent half an hour exploring New York. This led to tile overuse, and sometimes there were even noticeable spikes in the consumption graph. So I introduced restrictions: the map can no longer be panned too far away from Georgia.

Switching to vector tiles gave me full control over the map’s style and language. In literally half an hour in [Maputnik](https://maplibre.org/maputnik/), I managed to prepare styles for three languages. At the same time, I fixed a common mistake many providers make when working with Georgian: in label styles, they sometimes use forced uppercase, but since Georgian has no uppercase letters and many fonts lack those glyphs, such labels simply don’t render.  
![New Tiles](/images/07-blog-4.png "New Tiles")

Switching to MapLibre also triggered a complete rewrite of the map code, especially on the main page. My code written a year ago was terrible, impossible to maintain, and gave me headaches. I don’t know what I’ll say about the second version a year from now, but at the moment I’m mostly satisfied—with the caveat of my limited programming knowledge.

I also improved usability when selecting routes on the main page and completely abandoned [Overpass API](https://overpass-turbo.eu/) queries on the routes page. These queries were originally implemented as a temporary measure and significantly slowed down page loading.

A major milestone is behind me, but there’s still a lot of work ahead. Thank you for your attention!
