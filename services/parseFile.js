const fs = require("fs");
const readline = require('readline');
const moment = require('moment');

module.exports = class ParseFile {
    constructor(file, params = {}) {
        this.file = file;
        this.timeSpecified = 1569461218000;
        this.limitTime = 0; //偏差时间.
        this.startTime = moment(params.startDate).format("x") - this.limitTime; //开始时间
        this.endTime = moment(params.endDate).format("x") - this.limitTime; //结束时间
        this.sidList = params.sids ? this.formatSids(params.sids.split(",")) : ""; //漏单单号
        /**
        * params 参数注释
        * @param {String} params.problemType [问题类型]
        * @param {String} params.startTime []
        */
        this.params = params;

        this.errorInfo = [{
            type: "miss",   //漏单
            keyword: [{
                text: "另一个程序正在使用此文件，进程无法访问。",
                returnMessage: "有其它程序占用打印驱动,关闭影响打印进程的程序,例如:拼多多打印控件等.",
            }, {
                text: "Failed to get data + templateURL or printXML",
                returnMessage: "获取模版失败.重装控件",
            }, {
                text: "无效的加密数据",
                returnMessage: `打印问题群@打印助手回复"无效的加密数据"`,
            }, {
                text: "打印渲染失败",
                returnMessage: `打印问题群@打印助手回复"打印渲染失败"`,
            }, {
                text: "Client disconnected",
                returnMessage: `打印问题群@打印助手回复"控件断开链接"`,
            }],
        }, {
            type: "repeat",   //重复打印
        }, {
            type: "outOfOrder",   //乱序
        }];
    }

    async getFileErrorMessage() {
        let dataList = await this.getPeriodTimeList();
        let returnMessage;
        switch (this.params.problemType) {
            case "miss":
                returnMessage = this.getMissErrorMessage(dataList);
                break;
            case "repeat":
                returnMessage = this.getMissErrorMessage(dataList);
                break;
            case "outOfOrder":
                returnMessage = this.getMissErrorMessage(dataList);
                break;
            default:
                returnMessage = this.getMissErrorMessage(dataList);
                break;
        }
        return {
            returnMessage,
            sidList: this.sidList,
        };
    }

    /**
     * 获取需要时间段的日志信息
     *
     * @returns {Array}
     */
    getPeriodTimeList() {
        return new Promise((resolve) => {
            let rd = readline.createInterface({
                input: fs.createReadStream(this.file.path),
                output: process.stdout,
                // console: false
            });

            let infoList = [];


            rd.on('line', (line) => {
                if(line.indexOf("773005867152827") > -1){
                    console.log("1");
                }

                if(line.indexOf("773005867213162") > -1){
                    console.log("1");
                }
                let time = Number(moment(line.match(/\d{4}-\d{1,2}-\d{1,2}\s\d{1,2}\:\d{1,2}\:\d{1,2}/)[0]).format('x')); //截取当前时间;
                if (Number(time) > this.startTime && Number(time) < this.endTime) {
                    let date = moment(Number(time)).format("YYYY-MM-DD HH:mm:ss");
                    infoList.push({
                        date: date,
                        text: line,
                    });
                };

                if (time > this.endTime) {
                    rd.close();
                }
            });

            rd.on("close", function () {
                // 结束程序
                resolve(infoList);
            });
        })
    }

    /**
     * 获取漏单问题错误信息
     * @param {Array} data [需要查找的日志]
     * @returns {Array}
     */
    getMissErrorMessage(data) {
        let { keyword } = this.errorInfo.find(obj => obj.type === "miss"); //获订单漏单取错误信息列表
        let errorInfoList = []; //有错误信息的行
        // let sidsList = this.sids;
        // let hadBeenFoundList = [];
        data.map(lineObj => {

            //获取到有json字符串那行.可以用来解析打印状态
            if (lineObj.text.indexOf("sent msg:") != -1) {
                let data = this.getSentLineData(lineObj.text);
                this.setSidState(data, lineObj);
            }

            keyword.map(item => {
                if (lineObj.text.indexOf(item.text) > -1) {
                    errorInfoList.push(`${lineObj.date}: ${item.returnMessage}`);
                };
            });
        });
        return errorInfoList;
    }

    // /**
    //  * 获取重复打印问题错误信息
    //  * @param {Array} data [需要查找的日志]
    //  * @returns {Array}
    //  */
    // getRepeatErrorMessage(data) {
    //     let { keyword } = this.errorInfo.find(obj => obj.type === "miss"); //获订单漏单取错误信息列表
    //     let errorInfoList = []; //有错误信息的行
    //     // let sidsList = this.sids;
    //     // let hadBeenFoundList = [];
    //     data.map(lineObj => {

    //         keyword.map(item => {
    //             //获取到有json字符串那行.可以用来解析打印状态
    //             if (lineObj.text.indexOf("sent msg:") != -1) {
    //                 let data = this.getSentLineData(lineObj.text);
    //                 this.setSidState(data, lineObj);
    //             }

    //             if (lineObj.text.indexOf(item.text) > -1) {
    //                 errorInfoList.push(`${lineObj.date}: ${item.returnMessage}`);
    //             };
    //         });
    //     });
    //     return errorInfoList;
    // }

    /**
     * 格式化sid列表
     *
     * @param {*} sids
     * @returns
     */
    formatSids(sids) {
        let data = sids.map((sid) => {
            return {
                sid,
                renderTime: null,
                printTime: null,
                failTime: null,
                isPrint: false,
                isSend: false,
                isRender: false,
                isFailed: false,
                isOutOfOrder: false,  //是否乱序 //todo 这里可以用send render printed 时间做区分
                printNum: 0,
            }
        });
        return data;
    }

    /**
     * 设置sid状态
     *
     * @param {string} data sid字符串
     * @returns
     */
    setSidState(taskObj, lineData) {
        //cmd === "print" 为打印指令 用来判断系统是否送打印机但是需要菜鸟的taskID 不太好精准获取todo;
        //cmd === "notifyPrintResult" 为菜鸟反馈的打印结果redner为正常渲染 printed为正常打印;
        let { taskStatus, cmd, printStatus } = taskObj;

        //是否为打印任务指令结果
        if (cmd != "notifyPrintResult") return false;

        printStatus.map(item => {
            let sidItem = this.sidList.find(sidData => sidData.sid === item.documentID);
            if (!sidItem) return;
            if (taskStatus === 'rendered' && !sidItem.isFailed) {
                sidItem.isSend = true;
                sidItem.isRender = true;
                sidItem.renderTime = lineData.date;
            };

            if (taskStatus === "printed" && !sidItem.isFailed) {
                sidItem.isPrint = true;
                sidItem.printNum++;
                sidItem.printTime = lineData.date;
            };

            if (taskStatus === "failed") {
                sidItem.isFailed = true;
                sidItem.failTime = lineData.date;
            }
        });
    }

    getSentLineData(str) {
        let taskObj = JSON.parse(JSON.parse(str.split("sent msg:")[1]));
        return taskObj;
    }
};