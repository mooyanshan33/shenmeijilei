import type { Meta, StoryObj } from "@storybook/react"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card"
import { Button } from "./button"

const meta: Meta<typeof Card> = {
  title: "UI/Card",
  component: Card,
}

export default meta
type Story = StoryObj<typeof Card>

export const Basic: Story = {
  render: () => (
    <div className="w-[360px]">
      <Card>
        <CardHeader>
          <CardTitle>审美积累</CardTitle>
          <CardDescription>克制留白 + 灰阶层级 + 1px 内描边</CardDescription>
          <CardAction>
            <Button size="sm" variant="outline">
              Action
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="h-12 rounded-sm bg-grayWhite-50 border border-grayWhite-200" />
        </CardContent>
        <CardFooter>
          <Button className="w-full">确认</Button>
        </CardFooter>
      </Card>
    </div>
  ),
}
