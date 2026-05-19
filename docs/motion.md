# 动效使用说明（framer-motion）

## 预设

文件：`src/motion/fadeInUp.ts`

```ts
import { fadeInUp } from "@/motion/fadeInUp"
```

## 用法示例

```tsx
import { motion } from "framer-motion"
import { fadeInUp } from "@/motion/fadeInUp"

export function Example() {
  return (
    <motion.div variants={fadeInUp} initial="hidden" animate="show">
      内容
    </motion.div>
  )
}
```

约束：只使用 `opacity` 与 `y`（4px→0px），`duration` 固定 `220ms`，`ease` 统一 `ease-out`。
