import {GithubUser} from "./GithubUser.js"

/*
*Classe que vai conter a lógica dos dados.
* Como os dados vão ser estruturados
* */

export class Favorites {
    constructor(root) {
        this.root = document.querySelector(root)
        this.load()
        // GithubUser.search('VitorThorvi').then(user => console.log(user))
    }

    load() {
        this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
        // console.log((typeof this.entries) + (this.entries))
    }

    save () {
        localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
    }

    async add(username) {
        try {

            const userExists = this.entries.find(entry => entry.login === username)

            if(userExists) {
                throw new Error('Usuário já cadastrado')
            }

            const user = await GithubUser.search(username)
            console.log(user)
            if (user.login === undefined) {
                throw new Error('Usuário não foi encontrado')
            }
            this.entries = [user, ...this.entries]
            this.update()
            this.save()

        } catch (error) {
            alert(error.message)
        }
    }

    delete(user) {
        //Higher-order functions (map, filter, find, reduce)
        const filteredEntries = this.entries
            .filter(entry => entry.login !== user.login)
        this.entries = filteredEntries
        this.update()
        this.save()
    }
}


/*
* Clase que vai criar a visualização
* e eventos do HTML
* */

export class FavoritesView extends Favorites {
    constructor(root) {
        super(root)

        this.tbody = this.root.querySelector('table tbody')

        this.update()
        this.onAdd()
    }

    onAdd() {
        const addButton = this.root.querySelector('.search button')
        addButton.onclick = () => {
            const {value} = this.root.querySelector('.search input')

            this.add(value)
        }
    }

    update() {
        this.removeAllTr()

        this.entries.forEach(user => {
            const row = this.createRow()
            row.querySelector('.user img').src = `https://github.com/${user.login}.png`
            row.querySelector('.user img').alt = `Imagem de ${user.name}`
            row.querySelector('.user a').href = `https://github.com/${user.login}`
            row.querySelector('.user p').textContent = user.name
            row.querySelector('.user span').textContent = user.login
            row.querySelector('.repositories').textContent = user.public_repos
            row.querySelector('.followers').textContent = user.followers
            row.querySelector('.remove').onclick = () => {
                const deleteConfirmed = confirm('Tem certeza de que deseja deletar essa linha?')
                if (deleteConfirmed) {
                    this.delete(user)
                }
            }


            this.tbody.append(row)
        })
    }

    createRow() {
        const tr = document.createElement('tr')

        tr.innerHTML = `
            <td class="user">
                <img src="" alt="">
                <a href="">
                    <p></p>
                    <span></span>
                </a>
            </td>
            <td class="repositories"></td>
            <td class="followers"></td>
            <td>
                <button class="remove">&times;</button>
            </td>
        `
        return tr
    }

    removeAllTr() {
        this.tbody.querySelectorAll('tr')
            .forEach((tr) => {
                tr.remove()
            })
    }

}
