const fs = require("fs");
const readline = require('readline');
const moment = require('moment');

module.exports = class ParseFile {
    constructor(file, params = {}) {
        this.file = file;
        this.timeSpecified = 1569461218000;
        this.limitTime = 180000; //指定需要的时间段 毫秒
        this.startTime = this.timeSpecified - this.limitTime; //开始时间
        this.endTime = this.timeSpecified + this.limitTime; //结束时间

        this.params = params;

        this.errorInfo = [{
            type: "miss",   //漏单
            keyword: [{
                text: "另一个程序正在使用此文件，进程无法访问。",
                returnMessage: "有其它程序占用打印驱动,请关闭影响打印进程的程序",
            }],
        }, {
            type: "repeat",   //重复打印
            keyword: [{
                // text: "另一个程序正在使用此文件，进程无法访问。",
                returnMessage: "未找到重复订单请排查打印机",
            }],
        },{
            type: "outOfOrder",   //乱序
            keyword: [{
                returnMessage: "",
            }]
        }];
    }

    async getFileErrorMessage() {
        let data = await this.getErrorList();
        return data;
    }

    getErrorList() {
        return new Promise((resolve) => {
            let rd = readline.createInterface({
                input: fs.createReadStream(this.file.path),
                output: process.stdout,
                // console: false
            });

            let errorInfoList = [];
    
            let { keyword } = this.errorInfo.find(obj => obj.type === this.params.problemType); //获取错误信息列表
            rd.on('line', (line) => {
                let time = moment(line.match(/\d{4}-\d{1,2}-\d{1,2}\s\d{1,2}\:\d{1,2}\:\d{1,2}/)[0]).format('x'); //截取时间的正则
                if (time > this.startTime && time < this.endTime) {
                    keyword.map(item => {
                        if(line.indexOf(item.text) > -1){
                            let date = moment(Number(time)).format("YYYY-MM-DD HH:mm:ss");
                            errorInfoList.push(`${date}: ${item.returnMessage}`);
                        };
                    });
                };
    
                if(time > this.endTime) {
                    rd.close();
                    resolve(errorInfoList)
                }
            });
        })
    }

    formatLogData(text) {
        return text;
    }
};