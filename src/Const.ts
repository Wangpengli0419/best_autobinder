import * as path from 'path';
import * as fs from 'fs';

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

function loadMergedMap(): Record<string, string> {
    const separatorMap = loadSeparatorMap();
    const aliasMap = loadAliasMap();

    // 合并自定义别名到 SeparatorMap
    // aliasMap 的 key 是引擎类型 (如 cc.Node)，value 是自定义别名 (如 MyNode)
    for (const engineType in aliasMap) {
        const customAlias = aliasMap[engineType];
        if (customAlias && customAlias.trim()) {
            // 添加自定义别名映射
            separatorMap[customAlias.trim()] = engineType;
        }
    }

    // 添加 autoNode 映射
    if (separatorMap["Node"] && !separatorMap["autoNode"]) {
        separatorMap["autoNode"] = separatorMap["Node"];
    }

    return separatorMap;
}

export default class Const {
    /** 规范符号 */
    static STANDARD_Separator = '@';                        // 分隔符
    static STANDARD_End = '#';                              // 绑定后缀, 结点命名添加此后缀后, 不会查询其子节点
    /**
     * 规范符号映射表，规则为key-vlue形式，key为节点前缀别名，value为Cocos Creator引擎内置类型
     * 举例1：
     * ToggleGroup@tgc ，它对应的引擎内置类型为cc.ToggleContainer
     * 引擎内置类型按.进行分割，parts[0]为cc, parts[1]为内置类型名 则为ToggleContainer
     * 生成引入代码 import {ToggleContainer} from 'cc';
     * 如需生成`@property`变量代码则为 @property(ToggleContainer) tgc!: ToggleContainer;
     * 举例2：
     * TiledTile@tile ，它对应的引擎内置类型为cc.TiledTile
     * 引擎内置类型按.进行分割，parts[0]为cc, parts[1]为内置类型名 TiledTile
     * 生成引入代码 import {TiledTile} from 'cc';
     * 如需生成`@property`变量代码则为 @property(TiledTile) tile!: TiledTile;
     * 举例3：
     * Skeleton@spineani ，它对应的引擎内置类型为cc.sp.Skeleton
     * 引擎内置类型按.进行分割，parts[0]为cc, parts[1]为sp, parts[2]为Skeleton
     * 生成引入代码 import {sp} from 'cc';
     * 如需生成`@property`变量代码则为 @property(sp.Skeleton) spineani!: sp.Skeleton;
     * 举例4：
     * DragonBones@dbani ，它对应的引擎内置类型为cc.dragonBones.ArmatureDisplay
     * 引擎内置类型按.进行分割，parts[0]为cc, parts[1]为dragonBones, parts[2]为ArmatureDisplay
     * 生成引入代码 import {dragonBones} from 'cc';
     * 如需生成`@property`变量代码则为 @property(dragonBones.ArmatureDisplay) dbani!: dragonBones.ArmatureDisplay;
     * 总结如下：
     * 引擎内置类型按.进行分割，parts[0]固定为cc
     * 生成引入代码 import {parts[1]} from 'cc';
     * parts[2]存在的话 @property`变量代码则为@property(parts[1].parts[2]) alias!: parts[1].parts[2];
     * parts[2]不存在的话`@property`变量代码则为 @property(parts[1]) alias!: parts[1];
     */
    static SeparatorMap: Record<string, string> = loadMergedMap();

    /** 重新加载 SeparatorMap (包括自定义别名) */
    static reloadSeparatorMap() {
        Const.SeparatorMap = loadMergedMap();
    }
}
