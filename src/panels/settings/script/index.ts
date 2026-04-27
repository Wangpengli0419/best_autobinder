import { createApp, ref } from 'vue';

interface SeparatorMapItem {
    key: string;
    value: string;
    customAlias: string;
}

let items: SeparatorMapItem[] = [];

// 构建表格 HTML
function buildTableHTML(items: SeparatorMapItem[]): string {
    let rows = '';
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        rows += `<tr data-index="${i}">
            <td>${item.value}</td>
            <td>${item.key}</td>
            <td><input type="text" class="custom-alias" data-index="${i}" value="${item.customAlias}" placeholder="仅限英文字母" maxlength="20"></td>
        </tr>`;
    }
    return rows;
}

module.exports = Editor.Panel.define({
    template: `
        <div class="settings-container">
            <div class="header">
                <h2>SeparatorMap 设置</h2>
                <p class="desc">1.节点命名规则</p>
                <p class="desc">   (1)自定义别名@变量名，例如：MyLabel@labTest</p>
                <p class="desc">   (2)内置别名@变量名，例如：Label@labName</p>
                <p class="desc">   (3)节点名称没有@符号或者以下划线_开始则不导出，例如：_Label@labName、NodetestNode</p>
                <p class="desc">2.自定义别名仅允许使用大小写英文字母</p>
            </div>
            <div class="toolbar">
                <button class="btn-save" id="btn-save">保存自定义别名</button>
            </div>
            <div class="table-wrapper">
                <table class="mapping-table">
                    <thead>
                        <tr>
                            <th class="col-type">Cocos组件类型</th>
                            <th class="col-builtin">UIBinder内置别名</th>
                            <th class="col-custom">自定义别名</th>
                        </tr>
                    </thead>
                    <tbody id="table-body"></tbody>
                </table>
            </div>
        </div>
    `,
    style: `
        .settings-container {
            padding: 20px;
            height: 100%;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
        }
        .header {
            margin-bottom: 16px;
        }
        .header h2 {
            margin: 0 0 8px 0;
            font-size: 16px;
            font-weight: 600;
        }
        .header .desc {
            margin: 0;
            font-size: 12px;
            color: #888;
        }
        .toolbar {
            margin-bottom: 12px;
        }
        .btn-save {
            padding: 6px 16px;
            border: none;
            border-radius: 4px;
            background: #2d8c4e;
            color: #fff;
            cursor: pointer;
            font-size: 13px;
        }
        .table-wrapper {
            flex: 1;
            overflow: auto;
            border: 1px solid #3a3a3a;
            border-radius: 4px;
        }
        .mapping-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 13px;
        }
        .mapping-table thead {
            background: #2d2d2d;
            position: sticky;
            top: 0;
        }
        .mapping-table th {
            text-align: left;
            padding: 10px 8px;
            font-weight: 500;
            color: #aaa;
            border-bottom: 1px solid #3a3a3a;
        }
        .mapping-table td {
            padding: 8px;
            border-bottom: 1px solid #333;
            color: #ccc;
        }
        .col-type { width: 40%; }
        .col-builtin { width: 30%; }
        .col-custom { width: 30%; }
        .custom-alias {
            width: 100%;
            padding: 4px 8px;
            border: 1px solid #444;
            border-radius: 3px;
            background: #2a2a2a;
            color: #fff;
            font-size: 12px;
            box-sizing: border-box;
        }
        .custom-alias:focus {
            outline: none;
            border-color: #3071db;
        }
        .custom-alias.invalid {
            border-color: #c74b4b;
        }
    `,
    $: {
        tableBody: '#table-body',
        saveBtn: '#btn-save',
    },
    methods: {
        renderTable() {
            console.log('[Settings] renderTable called, items:', items.length);
            if (this.$ && this.$.tableBody) {
                this.$.tableBody.innerHTML = buildTableHTML(items);
                // 绑定输入事件，限制只能输入英文字母
                const inputs = this.$.tableBody.querySelectorAll('.custom-alias') as NodeListOf<HTMLInputElement>;
                inputs.forEach((input) => {
                    input.addEventListener('input', (e) => {
                        const target = e.target as HTMLInputElement;
                        const value = target.value;
                        const index = parseInt(target.getAttribute('data-index') || '0');

                        // 过滤非英文字母
                        const filtered = value.replace(/[^a-zA-Z]/g, '');
                        if (value !== filtered) {
                            target.value = filtered;
                            target.classList.add('invalid');
                            setTimeout(() => target.classList.remove('invalid'), 300);
                        }

                        // 更新数据
                        if (items[index]) {
                            items[index].customAlias = filtered;
                        }
                    });
                });
            }
        },
        saveData() {
            console.log('[Settings] saveData called');
            // 构建自定义别名映射 (key=引擎类型, value=自定义别名)
            const aliasMap: Record<string, string> = {};
            for (const item of items) {
                if (item.customAlias.trim()) {
                    aliasMap[item.value] = item.customAlias.trim();
                }
            }
            console.log('[Settings] 保存自定义别名:', JSON.stringify(aliasMap, null, 2));
            Editor.Message.send('best_autobinder', 'save-alias-map', aliasMap);
            console.log('[Settings] 发送消息完成');
        },
    },
    ready() {
        console.log('[Settings] Panel ready');

        // 同时加载内置映射和自定义别名
        Promise.all([
            Editor.Message.request('best_autobinder', 'get-separator-map'),
            Editor.Message.request('best_autobinder', 'get-alias-map')
        ]).then(([separatorMap, aliasMap]) => {
            console.log('[Settings] 数据加载完成, separatorMap keys:', Object.keys(separatorMap).length);
            items = [];
            for (const key in separatorMap) {
                const value = separatorMap[key];
                // 自定义别名优先使用 aliasMap 中对应引擎类型的值
                const customAlias = (aliasMap as Record<string, string>)[value] || '';
                items.push({ key, value, customAlias });
            }
            this.renderTable();
        });

        // 绑定保存按钮事件 - 使用 $ 选择器
        if (this.$ && this.$.saveBtn) {
            (this.$.saveBtn as HTMLButtonElement).addEventListener('click', () => {
                this.saveData();
            });
        } else {
            console.log('[Settings] 保存按钮未找到');
        }
    },
});