export function formatPosts(posts, {
    filterOutFuturePosts = true,
    sortByDate = true,
} = {}) {

    const filteredPosts = posts.reduce((acc, post) => {
        const { pubDate } = post.frontmatter.pubDate;

        // filterOutFuturePosts if true
        if (filterOutFuturePosts && new Date(pubDate) > new Date()) {
            return acc;
        }
        // add post to acc
        acc.push(post)
        return acc;
    }, [])

    // sortByDate or randomize
    if (sortByDate) {
        filteredPosts.sort((a, b) => new Date(b.frontmatter.pubDate) - new Date(a.frontmatter.pubDate))
    } else {
        filteredPosts.sort(() => Math.random() - 0.5)
    }
    return filteredPosts;
}

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
