module.exports = class asyncPool {
    constructor(
        /* requestList 为请求参数对象的数组 
        {
            url: "/trade/print/merchantCode/data",
            type: "post",
        }
        */
        requestList = [],
        options = {
            max: 1, //并发数量
            callback: null, //每次请求结束后回调
        }
    ) {
        this.options = options;
        this.requestList = requestList;
        this.nowTask = 0;
        this.data = [];
        this.createTask();
    };

    createTask() {
        return new Promise(() => {
            let nowPromiseList = [];
            for (let i = 0; i < this.options.max; i++) {
                let promiseData = this.requestList[this.nowTask];

                if (promiseData) {
                    nowPromiseList.push(promiseData);
                }

                this.nowTask++
            }

            Promise.all(nowPromiseList).then((result) => {
                this.data = this.data.concat(result);

                if (this.options.callback) {
                    this.options.callback(result, this.data)
                }

                if (this.nowTask >= this.requestList.length) {
                    return;
                }
                this.createTask();
            })
        })

    }

    getPromiseTask(params) {
        return new Promise((resolve) => {
            API.send_call_to_server(params, (resp) => {
                resolve(resp);
            })
        });
    }
}

// let ajaxList = [{
//     url: "/trade/print/merchantCode/data",
//     type: "post",
// }, {
//     url: "/trade/print/merchantCode/data",
//     type: "post",
// }, {
//     url: "/trade/print/merchantCode/data",
//     type: "post",
// }]
// new asyncPool(
//     ajaxList,
//     {
//         max: 2,
//         callback: (data, allData) => {
//             console.log(data);
//             console.log(allData);
//         }
//     }
// );

