"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { pollService } from "@/lib/db/poll-service"
import { CreatePollData } from "@/lib/types"

export async function createPoll(data: CreatePollData) {
  const supabase = await createClient()
  
  // Get the current user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    throw new Error("You must be logged in to create a poll")
  }

  // Validate the data
  if (!data.title || !data.description || !data.options || data.options.length < 2) {
    throw new Error("Title, description, and at least 2 options are required")
  }

  // Filter out empty options
  const validOptions = data.options.filter(option => option.trim() !== "")
  
  if (validOptions.length < 2) {
    throw new Error("You must have at least 2 valid options")
  }

  try {
    // Create the poll using the service
    const poll = await pollService.createPoll({
      title: data.title.trim(),
      description: data.description.trim(),
      options: validOptions
    }, user.id)

    // Revalidate the polls page and dashboard
    revalidatePath("/polls")
    revalidatePath("/dashboard")
    
    return { success: true, data: poll }
  } catch (error) {
    console.error("Error creating poll:", error)
    throw new Error(error instanceof Error ? error.message : "Failed to create poll")
  }
}

export async function voteOnPoll(pollId: string, optionId: string) {
  const supabase = await createClient()
  
  // Get the current user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    throw new Error("You must be logged in to vote")
  }

  try {
    await pollService.vote(pollId, optionId, user.id)
    
    // Revalidate the poll page and polls list
    revalidatePath(`/polls/${pollId}`)
    revalidatePath("/polls")
    
    return { success: true }
  } catch (error) {
    console.error("Error voting on poll:", error)
    throw new Error(error instanceof Error ? error.message : "Failed to vote on poll")
  }
}

export async function deletePoll(pollId: string) {
  const supabase = await createClient()
  
  // Get the current user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    throw new Error("You must be logged in to delete a poll")
  }

  try {
    // Check if the user owns this poll
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .select('author_id')
      .eq('id', pollId)
      .single()

    if (pollError || !poll) {
      throw new Error("Poll not found")
    }

    if (poll.author_id !== user.id) {
      throw new Error("You can only delete your own polls")
    }

    // Delete the poll (cascade will handle options and votes)
    const { error: deleteError } = await supabase
      .from('polls')
      .delete()
      .eq('id', pollId)

    if (deleteError) {
      throw new Error(deleteError.message)
    }

    // Revalidate the polls page and dashboard
    revalidatePath("/polls")
    revalidatePath("/dashboard")
    
    return { success: true }
  } catch (error) {
    console.error("Error deleting poll:", error)
    throw new Error(error instanceof Error ? error.message : "Failed to delete poll")
  }
}

export async function togglePollStatus(pollId: string) {
  const supabase = await createClient()
  
  // Get the current user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    throw new Error("You must be logged in to modify a poll")
  }

  try {
    // Check if the user owns this poll
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .select('author_id, is_active')
      .eq('id', pollId)
      .single()

    if (pollError || !poll) {
      throw new Error("Poll not found")
    }

    if (poll.author_id !== user.id) {
      throw new Error("You can only modify your own polls")
    }

    // Toggle the poll status
    const { error: updateError } = await supabase
      .from('polls')
      .update({ is_active: !poll.is_active })
      .eq('id', pollId)

    if (updateError) {
      throw new Error(updateError.message)
    }

    // Revalidate the polls page and dashboard
    revalidatePath("/polls")
    revalidatePath("/dashboard")
    revalidatePath(`/polls/${pollId}`)
    
    return { success: true, isActive: !poll.is_active }
  } catch (error) {
    console.error("Error toggling poll status:", error)
    throw new Error(error instanceof Error ? error.message : "Failed to toggle poll status")
  }
}
