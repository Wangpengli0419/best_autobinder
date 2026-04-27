"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unload = exports.load = exports.methods = void 0;
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const Const_1 = __importDefault(require("./Const"));
function getCocosConfigPath() {
    return path.join(__dirname, '..', 'cocos_uibinder.json');
}
function getAliasConfigPath() {
    return path.join(__dirname, '..', 'alias_uibinder.json');
}
function loadSeparatorMap() {
    try {
        const configPath = getCocosConfigPath();
        const data = fs.readFileSync(configPath, 'utf-8');
        return JSON.parse(data);
    }
    catch (e) {
        console.error('加载 cocos_uibinder.json 失败:', e);
        return {};
    }
}
function loadAliasMap() {
    try {
        const configPath = getAliasConfigPath();
        const data = fs.readFileSync(configPath, 'utf-8');
        return JSON.parse(data);
    }
    catch (e) {
        console.error('加载 alias_uibinder.json 失败:', e);
        return {};
    }
}
exports.methods = {
    open_panel() {
        console.log('open settings');
        Editor.Panel.open('uibinder');
    },
    bind(...args) {
        const selectedIds = args.length > 0 && Array.isArray(args[0]) ? args[0] : [];
        const options = {
            name: 'best_autobinder',
            method: 'bind',
            args: selectedIds
        };
        Editor.Message.request('scene', 'execute-scene-script', options);
    },
    openSettings() {
        console.log('open settings panel');
        Editor.Panel.open('best_autobinder.settings');
    },
    // 获取内置映射 (cocos_uibinder.json - 只读)
    getSeparatorMap() {
        return loadSeparatorMap();
    },
    // 获取自定义别名映射 (alias_uibinder.json - 用户自定义)
    getAliasMap() {
        return loadAliasMap();
    },
    // 保存自定义别名到 alias_uibinder.json
    saveAliasMap(map) {
        console.log('[UIBinder] 保存自定义别名:', JSON.stringify(map, null, 2));
        try {
            const configPath = getAliasConfigPath();
            console.log('[UIBinder] 保存路径:', configPath);
            fs.writeFileSync(configPath, JSON.stringify(map, null, 4), 'utf-8');
            // 重新加载别名映射
            Const_1.default.reloadSeparatorMap();
            console.log('[UIBinder] 已保存到 alias_uibinder.json');
        }
        catch (e) {
            console.error('[UIBinder] 保存失败:', e);
        }
    }
};
/**
 * @en Hooks triggered after extension loading is complete
 * @zh 扩展加载完成后触发的钩子
 */
const load = function () { };
exports.load = load;
/**
 * @en Hooks triggered after extension uninstallation is complete
 * @zh 扩展卸载完成后触发的钩子
 */
const unload = function () { };
exports.unload = unload;
