export class GithubUser {
    static search(username) {
        const endpoit = `https://api.github.com/users/${username}`

        return fetch(endpoit)
            .then(data => data.json())
            .then(({login, name, public_repos, followers}) => ({
                login,
                name,
                public_repos,
                followers
            }))
    }
}
