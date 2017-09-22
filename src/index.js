import './index.sass'
import axios from 'axios'
import articlesTemplate from './articles.hbs'

class Articles {
    constructor(query, limit) {
        this.query = query;
        this.limit = limit;
        this.currentOffset = 0;
        this.articlesContainer = document.querySelector('.articles')
        this.addListners()
    }

    getList () {
        this.renderPreloader();

        let params = {
            "action": "query",
            "format": "json",
            "list": "search",
            "srnamespace": "0",
            "origin": "*",
            "srsearch": this.query,
            "sroffset": this.currentOffset,
            "srlimit": this.limit
        };

        axios.get('https://en.wikipedia.org/w/api.php', {
            params: params
        }).then((response) => {
            this.renderList(response.data.query.search);
        }).catch(function (error) {
            console.log(error);
        });
    };

    renderPreloader() {
        this.articlesContainer.innerHTML = '<div class="articles__preloader">Loading...</div>';
    }

    renderList(data) {
        this.articlesContainer.innerHTML = articlesTemplate({ articles: data });
    }

    addListners() {
        document.querySelector('.articles__btn--next').addEventListener('click', () => this.next(), false);
        document.querySelector('.articles__btn--prev').addEventListener('click', () => this.prev(), false);
    }

    next() {
        this.currentOffset += this.limit;
        this.getList();
    }

    prev() {
        if (this.currentOffset !== 0) {
            this.currentOffset -= this.limit;
            this.getList();
        } else {
            return false
        }
    }
}

document.addEventListener("DOMContentLoaded", function() {
    let art = new Articles('JavaScript', 5);
    art.getList()
});
