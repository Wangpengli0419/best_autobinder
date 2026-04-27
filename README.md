# Best AutoBinder —— Auto Binding Plugin for Cocos Creator 3.x

Say goodbye to tedious manual drag-and-drop UI binding. With properly named nodes, you can generate `@property` declarations and bind nodes to scripts **in one click**.

## Core Features

- **Easy to Use**: Simple and intuitive, ready to use
- **High Efficiency**: One-click auto-generate property declarations and bind nodes
- **Non-intrusive**: Based on AST parsing, preserves original code structure
- **Full Component Support**: Supports all common built-in Cocos Creator components + custom components

---

## Usage Notes

1. **Version Limit**: Only supports **Cocos Creator 3.x** (tested on 3.8.3, theoretically compatible with all 3.x versions)
2. **Language Limit**: Only supports **TypeScript** scripts
3. **Custom Components**: Script name must match component name exactly
4. **Data Type**: Does **not** support array types (e.g. `@property([Node])`)
5. **Node Renaming**: If a node is renamed after export, a new variable will be created; old variables remain and bindings stay valid

---

## Quick Start

1. Enable the plugin in the **Extension** menu of Cocos Creator
2. Name scene nodes using the rule: `[ComponentType]@[PropertyName]`
3. Select node, press `Alt+G` or right-click and choose **Bind**

---

## Node Naming Convention

### Format

`[ComponentType]@[PropertyName]`  
Example:

```
Label@score      → @property(Label) score!: Label
Button@confirm   → @property(Button) confirm!: Button
Sprite@icon      → @property(Sprite) icon!: Sprite
```

### Suffix Rule

Nodes ending with `#` are marked as **already bound** and will **not** recursively scan children:

- `Button@startBtn#` - Bound button
- `PlayerName@playerName#` - Bound prefab

### Name Conversion

`-` in names is automatically converted to `_` (invalid in TS variable names):

- `Label@score-001` → `@property(Label) score_001!: Label`

---

## Supported Component Types

| Prefix | Component Type | Example |
|--------|----------------|---------|
| Node | cc.Node | Node@root |
| Sprite | cc.Sprite | Sprite@icon |
| Label | cc.Label | Label@score |
| Button | cc.Button | Button@confirm |
| Toggle | cc.Toggle | Toggle@option |
| ToggleGroup | cc.ToggleContainer | ToggleGroup@tgc |
| EditBox | cc.EditBox | EditBox@input |
| ScrollView | cc.ScrollView | ScrollView@area |
| ProgressBar | cc.ProgressBar | ProgressBar@hp |
| Slider | cc.Slider | Slider@vol |
| Layout | cc.Layout | Layout@box |
| RichText | cc.RichText | RichText@msg |
| PageView | cc.PageView | PageView@pages |
| Mask | cc.Mask | Mask@area |
| Graphics | cc.Graphics | Graphics@draw |
| Skeleton | cc.sp.Skeleton | Skeleton@spine |
| DragonBones | cc.dragonBones.ArmatureDisplay | DragonBones@db |
| Animation | cc.Animation | Animation@anim |
| Camera | cc.Camera | Camera@main |
| Widget | cc.Widget | Widget@root |
| MeshRenderer | cc.MeshRenderer | MeshRenderer@model |

---

## Custom Alias

### Settings Panel

Open via Extension menu → Settings:

1. **Cocos Component Type**: Full built-in type (e.g. `cc.Label`)
2. **Built-in Alias**: Short alias (e.g. `Label`)
3. **Custom Alias**: User-defined alias

### Using Aliases

After setting an alias:

1. Set `cc.Label` → `MyLabel`
2. Name node: `MyLabel@playerName`
3. Generated code:
```typescript
import { Label } from 'cc';
@property(Label) playerName!: Label;
```

---

## Custom Component Support

Name nodes as `[ComponentName]@[PropertyName]`:

- `PlayerName@playerName` – node has `PlayerName` component attached
- Generated code:
```typescript
import { PlayerName } from 'db://assets/Script/Component/PlayerName';
@property(PlayerName) playerName!: PlayerName;
```

## Contact Author

- WeChat: shaopianwola (remark: autobinder)

## Purchase Notice

- This is a paid digital product. **No refunds** after purchase. Please confirm before payment.