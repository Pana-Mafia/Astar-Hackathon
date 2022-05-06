const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Task", function () {
    it("Should return new task", async function () {
        const [owner] = await hre.ethers.getSigners();

        const Task = await ethers.getContractFactory("CreateTask");
        // const task = await Task.deploy(20220430, "Hello, world!");
        const task = await Task.deploy();
        // await Task.deployed();

        const createTaskTx = await task.createTask(owner.address, 20220430, "Doing Homework");
        const viewTaskTx = await task.viewTask(0);
        const allTaskTx = await task.getAllTasks();

        // wait until the transaction is mined
        await createTaskTx.wait();

        // 返り値の確認
        console.log(viewTaskTx)
        console.log(allTaskTx)
    });
});

describe("Done", function () {
    it("Should return bounty to user", async function () {
        const [owner] = await hre.ethers.getSigners();

        const Task = await ethers.getContractFactory("CreateTask");
        const task = await Task.deploy();
        // await Task.deployed();

        // let contractBalance = await hre.ethers.provider.getBalance(
        //     waveContract.address→変更
        // );
        // console.log(
        //     "Contract balance:",
        //     hre.ethers.utils.formatEther(contractBalance)
        // );

        const createTaskTx = await task.createTask(owner.address, 20220430, "Doing Homework");
        const viewTaskTx = await task.viewTask(0);
        const allTaskTx = await task.getAllTasks();
        const doneTaskTx = await task.sendRiward(0, "0x2B953E5eA9a210e22f52A9081c5Bcc2d4c22fca1");

        // wait until the transaction is mined
        await createTaskTx.wait();
        await doneTaskTx.wait();

        // 返り値の確認
        console.log(viewTaskTx)
        console.log(allTaskTx)
        console.log(owner.address.balance)
        // console.log(
        //     "Contract balance:",
        //     ethers.utils.formatEther(Task.contractBalance)
        // );
    });
});