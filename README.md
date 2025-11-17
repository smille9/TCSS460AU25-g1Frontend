# TCSS460 Group 1 Front End project

> **University of Washington Tacoma**
>
> **School of Engineering and Technology**
>
> **Computer Science and Systems**
>
> **TCSS 460 A - Client/Server Programming for Internet Applications**
>
> **AU2025**
>

---
## Contents
* [Alpha Sprint 1](#alpha-sprint-1-week-6---november-3---november-9)
* [Beta Sprint 1](#beta-sprint-1-week-7---november-10---november-16)

---

# Alpha Sprint 1 (Week 6 - November 3 - November 9)
Designs are located in /designs

This week: planning and design. We analyzed the APIs provided to us by other groups and planned features and designs based off of them.

## Theme and flows
Our project is centered around trending movies and TV shows, allowing users to provide their own ratings and create watchlists of content they liked or want to watch. We took inspiration from Letterboxd and Rotten Tomatoes.

In addition to being able to search and view details on movies, we plan to implement (time permitting) the ability for users to add content to a watchlist (yet to watch), be able to "favorite" movies and TV shows, and leave reviews.

Flows (basic ideas, detailed flow forthcoming):
Landing page (view movies and TV shows, search) -> search -> view show details and ratings
For user ratings and watchlists: landing page -> login -> browse -> add shows/movies to watchlists, favorites, or add reviews

## Contributions
Group contributions:

Mathew, Preston, and Sean collaborated together during our weekly meetings to read over each API documentation as a group. We have reached out to other groups for clarification on their APIs. Additionally, Mathew and Preston drafted designs on the whiteboard in person, Sean brought up Letterboxd as a design reference to use. Later, we collaborated on a Figma board to draft basic designs for all pages. These will be refined as we expand our ideas.

Additional individual contributions:
* Mathew: Fixed some old tests related to the data API
* Preston: Edited Discord group and invited users
* Sean: Continued to work on previous tests for auth^2
* Abdul: No contribution.

## Meetings
2025-11-03 (~1 hour)

Weekly scrum, reviewed assignments and requirements, discussed Postman tests from last week, changed our 3rd meeting time from Saturday/Sunday to Friday.

2025-11-06 (~2 hours)

API analysis, whiteboarding of designs, determine goals and features.

2025-11-07 (~3 hours)

Turn draft ideas into Figma designs.

## Sprint Comments and Concerns
* We're unsure if we need the ability to edit or add shows in a front end interface since it will probably be just us doing that (I'm guessing we do, but we focused on designs for other aspects of the site for now)
* Question: Do we need all aspects of the site protected by login? This may affect the flow of our site.
* The APIs we were given are lacking some basic functionality. We are in talks with these groups to work out a solution.

---

# Beta Sprint 1 (Week 7 - November 10 - November 16)
https://couchmouse.vercel.app

This week: integrate Credentials API, create movie/tv detail and list pages using mock data. Transfer tv show database to Supabase.

## Contributions
Group contributions:

Mathew, Preston, and Sean collaborated together during our weekly meetings to become familiar with the template.

Additional individual contributions:
* Mathew: Created mock data and list pages
* Preston: integrated credentials api and updated login forms
* Sean: Created detail pages
* Abdul: No contribution.

## Meetings
2025-11-10 (~1 hour)

Weekly scrum, reviewed assignments and requirements.

2025-11-13 (~2 hours)

Template and credentials API integration analysis, discuss mock data, discuss plans for each deliverable page.

2025-11-14 (~2 hours)

Finalize work still needed and discuss solutions to roadblocks encountered. Switched tv show database to Supabase to extend its life.

## Sprint Comments and Concerns
Starting to run a little behind and the kanban backlog is growing faster than development is going. We aren't hearing back from other groups about questions we have or functionality requests.
