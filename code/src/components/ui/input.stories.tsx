import type { Meta, StoryObj } from "@storybook/react"

import { Input } from "./input"

const meta: Meta<typeof Input> = {
  title: "UI/Input",
  component: Input,
  args: {
    placeholder: "输入内容…",
  },
  render: (args) => <Input className="w-[360px]" {...args} />,
}

export default meta
type Story = StoryObj<typeof Input>

export const Default: Story = {}

export const Disabled: Story = {
  args: {
    disabled: true,
    value: "Disabled",
  },
}

export const Invalid: Story = {
  args: {
    "aria-invalid": true,
    value: "Invalid",
  },
}
