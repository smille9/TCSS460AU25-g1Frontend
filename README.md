# CouchMouse - TCSS460 Group 1 Front End project

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
* [About](#couchmouse-simple-film-and-television-discovery-for-the-lazy)
* [Alpha Sprint 1](#alpha-sprint-1-week-6---november-3---november-9)
* [Beta Sprint 1](#beta-sprint-1-week-7---november-10---november-16)
* [Beta Sprint 2](#beta-sprint-2-week-8-9-november-17---november-30)
* [Production Sprint](#production-sprint-week-10-december-1---december-7)

---
# CouchMouse: Simple Film and Television Discovery for the Lazy

Explore top films and TV shows by browsing through featured collections or using our simple but powerful search tool.

**Features**:
* Browse for featured films with lists of top grossing and recent releases
* Browse for featured TV shows based on rating
* Simple but powerful searching of TV shows and Movies based on a series of combinable search filters - Title, Genre, Director, Actor, Rating, Year, Parantal rating, and network
* Keep track of the content you love - save your favorite movies and TV shows to your very own watchlist! 
* Admins - Create and delete movies and TV shows for database maintenance (deletion not yet available)

*Get started today at: https://couchmouse.vercel.app*

**Developers**: Mathew Belmont, Preston Sia, Sean Miller

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

---

# Beta Sprint 2 (Week 8-9, November 17 - November 30)
https://couchmouse.vercel.app

This week: Plan out the interface a bit further, create and connect the search page, connect the change password form, connect views pages. Implement a watchlist as an extra feature

## Contributions
* Mathew: Connected the change password page and added watchlist functionality
* Preston: Worked on designing and building the search page and connecting the APIs for it
* Sean: Design the pages needed for creating and deleting a show
* Abdul: No contribution.

## Meetings
2025-11-17 (~1 hour online synchronous)

Reviewed some remaining tasks from the previous sprint, updated the projet board, reviewed deliverables for this week's scrum. We moved the assignment of some of the deliverables to help move things along.

2025-11-20 (~30 minutes in-person synchronous)

Discussed lecture topics (Formik and Yup), assigned remaining sprint deliverables. Discussed pending issues with other groups' APIs (group 3's so-called API key which is really a JWT token expired). Reviewed the API requests needed for our tasks and looked at Preston's Figma updates for consistent styling.

2025-11-21 (~1 hour online synchronous)

Discussed progress since the last meeting with hooking up the other groups APIs and progress on finishing other assigned tasks for the week (search pages, post/delete forms for shows and movies).

2025-11-24 (~1 hour online synchronous)

Determined that this would be the last synchronous sprint meeting for this week due to the holiday. Discussed each other's progress and determined how the watchlist was to be implemented (shared between Mathew and Sean). Preston continuing to work on the search page and getting things connected, though noting the he might not get to implementing the Figma style yet. Reviewed some code from each other.

## Sprint Comments and Concerns
All of our work, as of posting this, is in a series of PRs awaiting review. The Thanksgiving break has put a slight delay on reviewing these, but it'll be handled in Monday's meeting.

The API key that group key keeps giving us is really a JWT token set to expire in 2 weeks.

Preston spent more time than anticipated on the search page, hasn't implemented some of the other page design elements yet.

---

# Production Sprint (Week 10, December 1 - December 7)

https://couchmouse.vercel.app

This week - make final modifications and re-do the theming to make everything consistent.

## Contributions
* Mathew: Re-worked the search page after a group decision to modify the user experience.
* Preston: Re-worked the movies and shows listing page, bug fixes, advise group on styling.
* Sean: Adjusted the theming of the movies/shows details pages and the create/delete pages.
* Abdul: No contribution.

## Meetings

2025-12-01 (~1.5 hour synchronous online)

Merged in pull requests from the last sprint, deployed them to the "production" branch. We discused hot to clean up our site and make everything consistent, mainly basing the theme on the search page that Preston wrote. We also decided to reflow the search page to revamp the user experience.

2025-12-04 (~1 hour synchronous online)

We previewed the changes to the new "advanced" search tool with better, more complete search options (thanks Claude). We also looked at the new movies/shows listing page. Routing changes were discussed to make the naming of our routes more consistent. We also discussed the beginning stages of cutting out the template material and switching everything to our new layout, some of which we took care of during the meeting.

2025-12-05 (~2 hours synchronous online)

After making new pull requests for the features discussed at the last meeting asynchronously, we discussed making further minor adjustments to make the styling consistent. For the details page, we spent a while trying to get our poster fill up the whole left side of its container, but couldn't get it to work. We instead padded it to display in the middle. Afterwords we merged in those pull requests and discussed the need to test the experience of our site by trying to break it, and some remaining minor details with the create/delete pages.

Asynchronous weekend tasks - For the rest of the week we will be working on ironing out any remaining bugs and preparing our final submission.

## Sprint Comments and Concerns
* We have continued to run into issues with the other groups' APIs, mainly the movie API (group 2). We've submitted multiple bug reports, and luckily they worked to fix them. Most had to do with the formatting of their poster URL data, lacking critical features (such as getting a single movie by ID), and other inconsistencies. Their documentation continues to be inconsistent and their routes for filters, well, a bit nonsensical.
* The Movies API team (group 2) did not have a route to allow us to search for specific directors until late Friday night, so our app's create movie feature may be limited to allowing only a director ID (not ideal unless you know which ID belongs to which director already) to be used as input for the directors field if we can't figure out a front-end solution in time given the movie team's late change.
* The "API key" that the movies group (group 3) is not actually an API key, but a JWT token that they are using as an API key. It's set to expire sometime this week, so that will need to be resolved. Upon further questioning, it seems that group 3 (Devin) thinks that they have done something clever by using some "default" username and password and requiring us to use those credentials to generate new JWT tokens to use as API keys every 14 days using *their* auth API which we aren't even using (we're using group 4's auth API). I don't think they understand the essence of an API key, much less are the motivated to fix it.
* Due to the strange way that the movies group implemented their filters, our search options for movies don't always work properly (it may not return anything).
* We became aware of a major vulnerability through Vercel when it refused to deploy our code. We simply ran ```npm update``` and redeployed to fix this.
