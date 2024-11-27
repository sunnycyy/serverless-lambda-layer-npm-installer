import Serverless from "serverless";
import Plugin, {Hooks, Logging} from "serverless/classes/Plugin";
import {SpawnOptionsWithoutStdio} from "node:child_process";

const {spawn} = require("node:child_process");
const path = require("node:path");

class ServerlessLambdaLayerNpmInstaller implements Plugin {
    serverless: Serverless;
    hooks: Hooks;
    log: Logging["log"];

    constructor(serverless: Serverless, options: Serverless.Options, logging: Logging) {
        this.serverless = serverless;
        this.hooks = {
            "before:package:initialize": () => this.runNpmInstall(),
            "before:deploy:deploy": () => this.runNpmInstall(),
            "before:deploy:function:initialize": () => this.runNpmInstall(),
        };
        this.log = logging.log;
    }

    async runNpmInstall(): Promise<void> {
        const layers = this.serverless.service.layers;
        if (!layers) return;

        const entries = Object.entries(layers);
        if (entries.length <= 0) return;

        const currentDirectory = process.cwd();
        let command: string;
        const args = ["install"];
        const options: SpawnOptionsWithoutStdio = {};
        if (process.platform === "win32") {
            command = "npm.cmd";
            options.shell = true;
        } else {
            command = "npm";
        }
        for (const [name, layer] of entries) {
            this.log.notice(`Start running npm install on Lambda layer: ${name}`);
            const layerPath = layer.path as string;
            if (!layerPath) {
                throw new this.serverless.classes.Error(`Missing path: ${name}`);
            }

            options.cwd = path.join(currentDirectory, layerPath);
            await this.runCommand(command, args, options);
            this.log.notice(`NPM install success on Lambda layer: ${name}`);
        }
    }

    async runCommand(command: string, args: string[], options: SpawnOptionsWithoutStdio): Promise<number | null> {
        return new Promise((resolve, reject) => {
            const npm = spawn(command, args, options);
            npm.stdout.on("data", (data: Buffer) => this.log.info(data.toString()));
            npm.stderr.on("data", (data: Buffer) => this.log.error(data.toString()));
            npm.on("error", reject);
            npm.on("exit", resolve);
        });
    }
}

module.exports = ServerlessLambdaLayerNpmInstaller;
