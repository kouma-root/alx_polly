"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Plus, Trash2, Save, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { EditPollData, EditPollOption, Poll } from "@/lib/types"
import { updatePoll } from "@/lib/actions/poll-actions"

const formSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  isActive: z.boolean(),
})

type FormData = z.infer<typeof formSchema>

interface EditPollFormProps {
  poll: Poll
}

export function EditPollForm({ poll }: EditPollFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [options, setOptions] = React.useState<EditPollOption[]>(
    poll.options.map(opt => ({
      id: opt.id,
      text: opt.text,
      pollId: opt.pollId,
      isNew: false,
      isDeleted: false
    }))
  )

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: poll.title,
      description: poll.description,
      isActive: poll.isActive,
    },
  })

  async function onSubmit(values: FormData) {
    setIsLoading(true)
    
    try {
      // Filter out deleted options and prepare the data
      const validOptions = options
        .filter(option => !option.isDeleted)
        .map(option => ({
          id: option.id,
          text: option.text.trim(),
          pollId: option.pollId,
          isNew: option.isNew || false,
          isDeleted: false
        }))

      if (validOptions.length < 2) {
        throw new Error("You must have at least 2 valid options")
      }

      const editData: EditPollData = {
        id: poll.id,
        title: values.title.trim(),
        description: values.description.trim(),
        options: validOptions,
        isActive: values.isActive
      }

      // Use the server action to update the poll
      const result = await updatePoll(editData)
      
      if (result.success) {
        toast.success("Poll updated successfully!")
        router.push(`/polls/${poll.id}`)
      } else {
        throw new Error("Failed to update poll")
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to update poll. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const addOption = () => {
    if (options.filter(opt => !opt.isDeleted).length < 10) {
      setOptions([...options, {
        text: "",
        isNew: true,
        isDeleted: false
      }])
    }
  }

  const removeOption = (index: number) => {
    const newOptions = [...options]
    if (newOptions[index].id) {
      // Mark existing option as deleted
      newOptions[index].isDeleted = true
    } else {
      // Remove new option completely
      newOptions.splice(index, 1)
    }
    setOptions(newOptions)
  }

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index].text = value
    setOptions(newOptions)
  }

  const restoreOption = (index: number) => {
    const newOptions = [...options]
    newOptions[index].isDeleted = false
    setOptions(newOptions)
  }

  const activeOptions = options.filter(opt => !opt.isDeleted)

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Edit Poll Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Poll Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter poll title"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe what this poll is about"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Poll Status</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      {field.value ? "Active - Users can vote on this poll" : "Inactive - Users cannot vote on this poll"}
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isLoading}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Poll Options</CardTitle>
            <CardDescription>
              {activeOptions.length} of {options.length} options
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {options.map((option, index) => (
              <div key={index} className={`flex gap-2 ${option.isDeleted ? 'opacity-50' : ''}`}>
                <div className="flex-1">
                  <Input
                    placeholder={`Option ${index + 1}`}
                    disabled={isLoading || option.isDeleted}
                    value={option.text}
                    onChange={(e) => updateOption(index, e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  {option.isDeleted ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => restoreOption(index)}
                      disabled={isLoading}
                      title="Restore option"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeOption(index)}
                      disabled={isLoading || activeOptions.length <= 2}
                      title="Remove option"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
            
            {activeOptions.length < 10 && (
              <Button
                type="button"
                variant="outline"
                onClick={addOption}
                disabled={isLoading}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Option
              </Button>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Poll"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
