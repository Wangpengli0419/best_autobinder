"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNodeMenu = exports.onPanelMenu = void 0;
async function onPanelMenu(selectedNodes) {
    return [
        {
            label: 'i18n:best_autobinder.bind',
            accelerator: 'Alt+G',
            click: () => {
                // 触发绑定消息
                Editor.Message.request('scene', 'execute-scene-script', {
                    name: 'best_autobinder',
                    method: 'bind',
                    args: selectedNodes
                });
            }
        }
    ];
}
exports.onPanelMenu = onPanelMenu;
function getNodeMenu() {
    const selectedType = Editor.Selection.getLastSelectedType();
    const ids = Editor.Selection.getSelected('node') || [];
    const menu = [];
    if (selectedType === "node") {
        menu.push({
            label: 'i18n:best_autobinder.bind',
            accelerator: 'Alt+G',
            click: () => {
                // 触发绑定消息
                Editor.Message.request('scene', 'execute-scene-script', {
                    name: 'best_autobinder',
                    method: 'bind',
                    args: ids
                });
            }
        });
    }
    return menu;
}
exports.getNodeMenu = getNodeMenu;
