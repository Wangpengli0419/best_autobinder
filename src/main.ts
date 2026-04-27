
import * as path from 'path';
import * as fs from 'fs';
import Const from './Const';

function getCocosConfigPath(): string {
    return path.join(__dirname, '..', 'cocos_uibinder.json');
}

function getAliasConfigPath(): string {
    return path.join(__dirname, '..', 'alias_uibinder.json');
}

function loadSeparatorMap(): Record<string, string> {
    try {
        const configPath = getCocosConfigPath();
        const data = fs.readFileSync(configPath, 'utf-8');
        return JSON.parse(data);
    } catch (e) {
        console.error('加载 cocos_uibinder.json 失败:', e);
        return {};
    }
}

function loadAliasMap(): Record<string, string> {
    try {
        const configPath = getAliasConfigPath();
        const data = fs.readFileSync(configPath, 'utf-8');
        return JSON.parse(data);
    } catch (e) {
        console.error('加载 alias_uibinder.json 失败:', e);
        return {};
    }
}

export const methods: { [key: string]: (...any: any) => any } = {
    open_panel() {
        console.log('open settings');

        Editor.Panel.open('uibinder');
    },
    bind(...args: any[]) {
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
    saveAliasMap(map: Record<string, string>) {
        console.log('[UIBinder] 保存自定义别名:', JSON.stringify(map, null, 2));
        try {
            const configPath = getAliasConfigPath();
            console.log('[UIBinder] 保存路径:', configPath);
            fs.writeFileSync(configPath, JSON.stringify(map, null, 4), 'utf-8');
            // 重新加载别名映射
            Const.reloadSeparatorMap();
            console.log('[UIBinder] 已保存到 alias_uibinder.json');
        } catch (e) {
            console.error('[UIBinder] 保存失败:', e);
        }
    }
};

/**
 * @en Hooks triggered after extension loading is complete
 * @zh 扩展加载完成后触发的钩子
 */
export const load = function () { };

/**
 * @en Hooks triggered after extension uninstallation is complete
 * @zh 扩展卸载完成后触发的钩子
 */
export const unload = function () { };
