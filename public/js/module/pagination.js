class Pagination {
    constructor(options) {
        this.options = options || {};
        this.state = {
            ...{
                page: 1,
                total: 0,
                pageSize: 10,
                totalPage: 0,
            }, ...options.pageConfig,
        };
        this.$elContainer = options.container;

        this.initial();
        this.render();
        this.bindEvent();
    }

    initial = () => {
        this.$paginationContainer = this.getDom();
    }

    bindEvent = () => {
        this.$paginationContainer.on("click", ".click-page", (event) => {
            this.togglePage(event);
        });
    }

    togglePage = (event) => {
        let pageNo = $(event.currentTarget).attr("data-pageNo");
        this.state.page = pageNo;
        $(".click-page").removeClass("active")
        $(".click-page").eq(pageNo).addClass("active");
        this.options.togglePage(pageNo);
    }

    getDom = () => {
        let html = `
            <nav aria-label="Page navigation" class="pagination-container-nav">
                <ul class="pagination">
                    <li data-pageNo="1" class="click-page first-page-btn">
                        <a href="#" aria-label="Previous">
                            <span aria-hidden="true">&laquo;</span>
                        </a>
                    </li>
                    ${this.renderPageList()}
                    <li data-pageNo="${this.state.totalPage}" class="click-page last-page-btn">
                        <a href="#" aria-label="Next">
                            <span aria-hidden="true">&raquo;</span>
                        </a>
                    </li>
                </ul>
            </nav>`

        return $(html);

        // this.elContainer.html(html)
    }

    renderPageList = () => {
        let arr = [];
        for (let i = 0; i < this.state.totalPage; i++) {
            let pageNo = i + 1;
            let className = this.state.page === pageNo ? "click-page active" : "click-page";

            arr.push(`<li class="${className}" data-pageNo="${pageNo}"><a href="javascript:void(0)">${pageNo}</a></li>`);
        }
        let html = arr.join("");
        return html;
    }

    render = () => {
        this.$elContainer.html(this.$paginationContainer)
    }
}