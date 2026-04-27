
export async function onPanelMenu(selectedNodes: string[]) {
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
export function getNodeMenu(): any[] {
    const selectedType = Editor.Selection.getLastSelectedType();
    const ids = Editor.Selection.getSelected('node') || [];
    const menu: any[] = [];
    if (selectedType === "node") {
        menu.push(
            {
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
            })
    }
    return menu;
}