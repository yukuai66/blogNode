const fs = require("fs");
const readline = require('readline');
const moment = require('moment');
const path = require('path');
const asyncPool = require('./asyncPool.js');
const { resolve } = require("path");

module.exports = class ParseFile {
    constructor(file, params = {}) {
        this.file = file;
        this.timeSpecified = 1569461218000;
        this.limitTime = 0; //偏差时间.
        this.splitFilePathList = []; //分割后的文件列表
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

    async main() {
        //先将文件切割.64kb一份(笑)
        await this.fileSplit(this.file.path, 1024 * 64, "public/logFile/", '');

        //格式化每个文件的属性
        this.splitFilePathList = await this.formatFileAttribute();
        let dataList = await this.getPeriodTimeList();
        let returnMessage = this.getErrorMessage(dataList);

        //结束后删除所有文件
        this.deleteAllFile();
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
            let fileArr = this.splitFilePathList.filter((item, index) => {
                let fileStartTime = item.timeStampStart;
                let endData = this.splitFilePathList[index + 1], fileEndTime;
                if (endData) {
                    fileEndTime = endData.timeStampStart
                };

                if ((item.timeStampStart >= this.startTime) || (item.fileEndTime >= this.endTime)) {
                    return item.path;
                };

                //特殊情况. 如果文件小于64kb情况 只会有1个文件 干脆把这个文件送去解析了...不过应该很少出现;
                if (this.splitFilePathList.length === 1) {
                    return item.path;
                }
            });
            this.fileMerge(fileArr).then(newPath => {
                let rd = readline.createInterface({
                    input: fs.createReadStream(newPath),
                    output: process.stdout,
                    // console: false
                });

                let infoList = [];

                rd.on('line', (line) => {
                    let content = line.match(/\d{4}-\d{1,2}-\d{1,2}\s\d{1,2}\:\d{1,2}\:\d{1,2}/);
                    if (!content) {
                        return;
                    }

                    let time = Number(moment(content[0]).format('x')); //截取当前时间;a

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
            });

        });
    }

    /**
     * 获取错误信息
     * @param {Array} data [需要查找的日志]
     * @returns {Array}
     */
    getErrorMessage(data) {
        let { keyword } = this.errorInfo.find(obj => obj.type === "miss"); //获订单漏单取错误信息列表
        let errorInfoList = []; //有错误信息的行
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

    /**
     * 分割文件
     *
     * @param {string} inputFile 需要拆分文件路径
     * @param {number} splitSize 需要拆分的文件大小
     * @param {string} outPath  输出文件路径
     * @param {string} ext  文件格式(可选)
     * @returns
     */
    fileSplit(inputFile, splitSize, outPath, ext) {
        let i = 0;
        let fileName = this.file.filename;
        let copy = (start, end, size) => {
            return new Promise((resolve, reject) => {
                if (start >= size) {
                    resolve()
                } else {
                    if (end > size - 1) { end = size - 1 }
                    const readStream = fs.createReadStream(inputFile, { start, end })
                    let data = Buffer.from([])
                    readStream.on('data', chunk => {
                        data = Buffer.concat([data, chunk])
                    })
                    readStream.on('end', async () => {
                        this.splitFilePathList.push(`${fileName}${i + 1}${ext}`);
                        fs.writeFile(path.join(outPath, `${fileName}${i + 1}${ext}`), data, async err => {
                            if (err) { reject(err) }
                            i++
                            start = end + 1
                            end = end + splitSize
                            await copy(start, end, size)
                            resolve()
                        })
                    })
                    readStream.on('err', err => {
                        reject(err)
                    })
                }
            })
        }
        return new Promise((resolve, reject) => {
            return fs.stat(inputFile, async (err, stat) => {
                if (err) { return reject(err) }

                const size = stat.size
                await copy(0, splitSize - 1, size)
                resolve(i)
            })
        })
    }

    /**
     * 合并文件
     *
     */
    fileMerge(filePathList) {
        return new Promise((resolve) => {
            let promiseList = filePathList.map(data => {
                return new Promise((resolveContent) => {
                    fs.readFile(data.path, 'utf-8', (err, data) => {
                        resolveContent(data);
                    })
                })
            });

            Promise.all(promiseList).then(result => {
                let content = result.join("");
                let newFilePath = `${this.file.path}Merge`;
                fs.writeFile(newFilePath, content, () => {
                    resolve(newFilePath);
                });
            })
        })
    }

    /**
     * 格式化拆分后的文件属性
     *
     */
    formatFileAttribute() {
        return new Promise((resolve) => {
            let filePromiseList = [];
            this.splitFilePathList.map((fileName, index) => {
                filePromiseList.push(new Promise((fileResolve) => {
                    let splitFilePath = this.file.path + (index + 1);
                    let fileAttr = {};
                    let rd = readline.createInterface({
                        input: fs.createReadStream(splitFilePath),
                        output: process.stdout,
                    });

                    rd.on('line', (line) => {
                        let timeString = line.match(/\d{4}-\d{1,2}-\d{1,2}\s\d{1,2}\:\d{1,2}\:\d{1,2}/);
                        let timeStamp;
                        if (timeString) {
                            timeStamp = Number(moment(timeString[0]).format('x'));
                            fileAttr = {
                                path: splitFilePath,
                                timeStart: timeString[0],
                                timeStampStart: timeStamp,
                            }
                            rd.close();
                        }
                    });

                    rd.on("close", function () {
                        // 结束程序
                        fileResolve(fileAttr);
                    });
                }))
            })
            new asyncPool(
                filePromiseList,
                {
                    max: 2,
                    callback: (data, allData) => {
                        if (allData.length === this.splitFilePathList.length) {
                            resolve(allData);
                        }
                    }
                }
            );
        })

    }

    deleteAllFile() {
        fs.unlink(this.file.path, (err) => {
            if (err) throw err;
            console.log('success');
        });

        fs.unlink(`${this.file.path}Merge`, (err) => {
            if (err) throw err;
            console.log('success');
        });

        this.splitFilePathList.map(item => {
            fs.unlink(item.path, (err) => {
                if (err) throw err;
                console.log('success');
            });
        });

        
    }
};