
# Are there any sub-optimal choices( or short cuts taken due to limited time ) in your implementation?

* Creating a puppeteer browser per request is slow but was the simplest way for me to implement the system given the time

# Is any part of it over-designed? ( It is fine to over-design to showcase your skills as long as you are clear about it)

* The backend doesn't really require a routes folder/file as there arent many routes, but I included it for a cleaner backend

# If you have to scale your solution to 100 users/second traffic what changes would you make, if any?

* Rather than starting a new browser/puppeteer call every request, I would let the server scrape the sites on a repeating interval for as long as it's running, and fulfill requests by returning the most recent result that was scraped. This is also an improvement I would've worked towards if I had more time.

# What are some other enhancements you would have made, if you had more time to do this implementation

* I would add visual indicators to show when the prices change per site (probably via a highlight that slowly fades away)
* Improve the frontend styling a little more
* Change how the current prices are queried/delivered from the backend to how I described in the previous question
* Clean up how links are used in the backend for things like getBittrexDataFromUrls
