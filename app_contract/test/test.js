const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Task", function () {
    it("Should return new task", async function () {
        const [owner] = await hre.ethers.getSigners();

        const Task = await ethers.getContractFactory("CreateTask");
        // const task = await Task.deploy(20220430, "Hello, world!");
        const task = await Task.deploy();
        // await Task.deployed();

        const createTaskTx = await task.createTask(owner.address, 20220430, "Doing Homework", 100);
        const viewTaskTx = await task.viewTask(0);
        const allTaskTx = await task.getAllTasks();

        // wait until the transaction is mined
        await createTaskTx.wait();

        // 返り値の確認
        console.log(viewTaskTx)
        console.log(allTaskTx)
    });
});