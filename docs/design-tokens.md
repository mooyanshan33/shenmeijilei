# 审美积累 App · Design Tokens（v1）

## 颜色（灰阶）

| Token | Value | 用途 |
| --- | --- | --- |
| `--c-white` | `#FFFFFF` | 画布/卡片底色 |
| `--c-gray-50` | `#F7F7F7` | Input 默认底色、弱分区底色 |
| `--c-gray-100` | `#F5F5F5` | Skeleton/Pressed 背景 |
| `--c-gray-200` | `#E5E5E5` | 1px 内描边（Card 等） |
| `--c-gray-300` | `#D1D5DB` | Focus 描边、弱分割线 |
| `--c-gray-400` | `#9CA3AF` | 占位/次要文字 |
| `--c-gray-500` | `#7C828C` | 次级信息/辅助文本 |
| `--c-gray-600` | `#6B7280` | 弱主文本/标签 |

Tailwind 映射：`grayWhite.*` → 对应上述变量。

## 字体

| Token | Value |
| --- | --- |
| `--font-sans` | `-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif` |

## 圆角

| Token | Value | Tailwind |
| --- | --- | --- |
| `--radius-sm` | `6px` | `rounded-sm` |
| `--radius-md` | `10px` | `rounded-md` |
| `--radius-lg` | `14px` | `rounded-lg` |

## 动效

| Token | Value |
| --- | --- |
| `--ease-out` | `cubic-bezier(0.25, 0.1, 0.25, 1)` |
| `--duration` | `220ms` |

统一建议：只使用 `opacity + translateY(4px→0px)`，避免渐变与重投影。
