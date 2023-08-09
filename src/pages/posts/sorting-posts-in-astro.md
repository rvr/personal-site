---
layout: ../../layouts/PostLayout.astro
title: 'Sorting my posts in Astro'
pubDate: 2023-08-01
blurb: "I struggled for quite a while to get posts to sort on this site. Hopefully this can save you some time and frustration."
draft: true
---

When creating this site, and setting up the [posts section](/posts/), I found very few clear and easily understood resources on how to sort my posts by date. I have a frontmatter value for `pubDate` on all my posts, but getting it into a Date array and successfully sorting it was confusing. Obviously, this is because I really don't know JavaScript, and relay primarily on copy/past and mucking around until something works. But that's learning! And with the assumption that there are others out there who will be attempting the same thing, I'm sharing what worked for me.

A few requirements type things:
- Sorting using the `pubDate` frontmatter attribute, rather than the file modified date or anything else
- The default sort is reverse chronoligical (newest posts first)
- The option of sorting in straight chronological order (oldest to newest)

As you'll see, I'm using the `Astro.glob` function, rather than a content collection. I might switch that at some point, but globs don't require a schema to be defined, and so are a little more "just-works". My priority here was to get things working and learn the basics.

I should also mention that the [Astro tutorial on creating a blog](https://docs.astro.build/en/tutorial/0-introduction/) was very helpful as a starting point to make sure I was doing the simple things correctly. Curiously, though, it does not address sorting the posts in the step where you create a post archive. I get that things like sorting and filtering in JS are a little more advanced, but the fact that Astro doesn't have a more automatic way to to that, combined with the fact that this is a longstanding convention on blogs, is a bit of a head-scratcher.

Ok, here's the structure:

**The sorting function for posts is in `/src/js/utils.js`:**

```js
export function sortPosts(posts, {
        sortByDateForward = false,
        sortByDateRandom = false,
    } = {}) {
        const filteredPosts = posts.reduce((acc, post) => {
            // add post to acc
            acc.push(post)
            return acc;
    }, [])

    // sortByDate sort options
    // Forward is ascending - old to new
    if (sortByDateForward) {
        filteredPosts.sort((a, b) => new Date(a.frontmatter.pubDate) - new Date(b.frontmatter.pubDate))
    // Random is just what you'd expect
    } else if (sortByDateRandom) {
        filteredPosts.sort(() => Math.random() - 0.5)
    // Default is descending - new to old
    } else {
        filteredPosts.sort((b, a) => new Date(a.frontmatter.pubDate) - new Date(b.frontmatter.pubDate))
    }
    return filteredPosts;
}
```

**The posts page (`pages/posts.astro`) imports the function and uses it to sort the posts glob:**

```html
---
import DefaultLayout from '../layouts/DefaultLayout.astro';
import PostCard from '../components/PostCard.astro';
import { sortPosts } from "@js/utils";
const allPosts = await Astro.glob('./posts/*.md');
const sortedPosts = sortPosts(allPosts);
const pageTitle = "Things I've written."
---

<DefaultLayout pageTitle={pageTitle}>

    <section>
      <ul class="posts-list">
        {
          sortedPosts.length !== 0 &&
          sortedPosts
            .map((post) => (
              <PostCard
                date={post.frontmatter.pubDate}
                title={post.frontmatter.title}
                blurb={post.frontmatter.blurb}
                href={post.url}
              />
            ))
        }
      </ul>
    </section>
    
</DefaultLayout>
```

As you can see, I have a `PostCard` component that handles the layout of each post in the list. The key elements for sorting are:

1. The JS function for sorting in `/src/js/utils.js`. Your file structure and naming may differ, but you need a place to define the function.
2. Importing the function in your page: `import { sortPosts } from "@js/utils";`. Sidenote: my path for that is `import { sortPosts } from "@js/utils";`, rather than `../js/utils.js`. This is handled by a path alias in `/tsconfig.json`. [Reference documentation here](https://docs.astro.build/en/guides/aliases/).
3. Defining your glob for the posts array: `const allPosts = await Astro.glob('./posts/*.md');`. This gets everything in the posts folder that is a Markdown file. 
4. Your posts should each have a frontmatter value for the date you're using. Mine is called `pubDate`, and I have all my dates in `YYYY-MM-DD` format.
5. Define the sorted posts array by calling the function and feeding it `allPosts`: `const sortedPosts = sortPosts(allPosts);`.
6. In your HTML for the page layout, don't call `allPosts.map`, but rather us `sortedPosts.map`.
7. If you want a different sort, my function provides the option of using: `const sortedPosts = sortPosts(allPosts, { sortByDateForward: true });`, which will give you the ascending (oldest first) order; or `const sortedPosts = sortPosts(allPosts, { sortByDateRandom:true });`, which gives you a randomized list of posts (obvs).

That's it! Once I had the correct function and everything wired up properly I got exactly what I wanted. And on my home page, I show the most recent three posts, which is as simple as adding a `.slice` method to the array, like so:

```js
sortedPosts.length !== 0 &&
sortedPosts
    .slice(0, 3)
    .map((post) => (
```

Everything else is the same, and you can just change the `3` in the `.slice` method to any number you want to display.

If you've come across this post, I hope it's what you needed to get it working the way you want!