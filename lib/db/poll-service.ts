import { Poll, CreatePollData, PollOption, User } from "@/lib/types"
import { createClient } from "@/lib/supabase/server"

export class PollService {
  private static instance: PollService

  static getInstance(): PollService {
    if (!PollService.instance) {
      PollService.instance = new PollService()
    }
    return PollService.instance
  }

  async createPoll(data: CreatePollData, authorId: string): Promise<Poll> {
    const supabase = await createClient()
    
    // Start a transaction by creating the poll first
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .insert({
        title: data.title,
        description: data.description,
        author_id: authorId,
        is_active: true
      })
      .select()
      .single()

    if (pollError || !poll) {
      throw new Error(pollError?.message || 'Failed to create poll')
    }

    // Create poll options
    const pollOptions = data.options.map(text => ({
      text: text.trim(),
      poll_id: poll.id
    }))

    const { data: options, error: optionsError } = await supabase
      .from('poll_options')
      .insert(pollOptions)
      .select()

    if (optionsError || !options) {
      // If options creation fails, delete the poll to maintain consistency
      await supabase.from('polls').delete().eq('id', poll.id)
      throw new Error(optionsError?.message || 'Failed to create poll options')
    }

    // Get the author profile
    const { data: authorProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authorId)
      .single()

    const author: User = {
      id: authorId,
      name: authorProfile?.name || 'Unknown User',
      email: '', // We don't expose email in profiles
      createdAt: authorProfile?.created_at || new Date().toISOString(),
      updatedAt: authorProfile?.updated_at || new Date().toISOString(),
    }

    // Transform the data to match our Poll interface
    const createdPoll: Poll = {
      id: poll.id,
      title: poll.title,
      description: poll.description || '',
      options: options.map(opt => ({
        id: opt.id,
        text: opt.text,
        votes: 0,
        pollId: opt.poll_id
      })),
      totalVotes: 0,
      isActive: poll.is_active,
      createdAt: poll.created_at,
      updatedAt: poll.updated_at,
      authorId: poll.author_id,
      author
    }

    return createdPoll
  }

  async getPolls(): Promise<Poll[]> {
    const supabase = await createClient()
    
    const { data: polls, error } = await supabase
      .from('polls')
      .select(`
        *,
        poll_options (*),
        profiles!polls_author_id_fkey (
          id,
          name,
          created_at,
          updated_at
        )
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(error.message)
    }

    return polls.map(poll => ({
      id: poll.id,
      title: poll.title,
      description: poll.description || '',
      options: poll.poll_options.map((opt: any) => ({
        id: opt.id,
        text: opt.text,
        votes: 0, // We'll calculate this separately
        pollId: opt.poll_id
      })),
      totalVotes: 0, // We'll calculate this separately
      isActive: poll.is_active,
      createdAt: poll.created_at,
      updatedAt: poll.updated_at,
      authorId: poll.author_id,
      author: {
        id: poll.profiles.id,
        name: poll.profiles.name,
        email: '',
        createdAt: poll.profiles.created_at,
        updatedAt: poll.profiles.updated_at,
      }
    }))
  }

  async getPollById(id: string): Promise<Poll | null> {
    const supabase = await createClient()
    
    const { data: poll, error } = await supabase
      .from('polls')
      .select(`
        *,
        poll_options (*),
        profiles!polls_author_id_fkey (
          id,
          name,
          created_at,
          updated_at
        )
      `)
      .eq('id', id)
      .eq('is_active', true)
      .single()

    if (error || !poll) {
      return null
    }

    // Get vote counts for each option
    const { data: voteCounts } = await supabase
      .from('votes')
      .select('option_id, count')
      .eq('poll_id', id)
      .select('option_id')
      .select('count')

    // Create a map of option_id to vote count
    const voteMap = new Map()
    if (voteCounts) {
      for (const vote of voteCounts) {
        voteMap.set(vote.option_id, (voteMap.get(vote.option_id) || 0) + 1)
      }
    }

    return {
      id: poll.id,
      title: poll.title,
      description: poll.description || '',
      options: poll.poll_options.map((opt: any) => ({
        id: opt.id,
        text: opt.text,
        votes: voteMap.get(opt.id) || 0,
        pollId: opt.poll_id
      })),
      totalVotes: Array.from(voteMap.values()).reduce((sum, count) => sum + count, 0),
      isActive: poll.is_active,
      createdAt: poll.created_at,
      updatedAt: poll.updated_at,
      authorId: poll.author_id,
      author: {
        id: poll.profiles.id,
        name: poll.profiles.name,
        email: '',
        createdAt: poll.profiles.created_at,
        updatedAt: poll.profiles.updated_at,
      }
    }
  }

  async vote(pollId: string, optionId: string, userId: string): Promise<void> {
    const supabase = await createClient()
    
    // Check if user already voted on this poll
    const { data: existingVote } = await supabase
      .from('votes')
      .select('id')
      .eq('poll_id', pollId)
      .eq('user_id', userId)
      .single()

    if (existingVote) {
      // Update existing vote
      const { error } = await supabase
        .from('votes')
        .update({ option_id: optionId })
        .eq('id', existingVote.id)
      
      if (error) {
        throw new Error(error.message)
      }
    } else {
      // Create new vote
      const { error } = await supabase
        .from('votes')
        .insert({
          poll_id: pollId,
          option_id: optionId,
          user_id: userId
        })
      
      if (error) {
        throw new Error(error.message)
      }
    }
  }

  async getUserPolls(userId: string): Promise<Poll[]> {
    const supabase = await createClient()
    
    const { data: polls, error } = await supabase
      .from('polls')
      .select(`
        *,
        poll_options (*),
        profiles!polls_author_id_fkey (
          id,
          name,
          created_at,
          updated_at
        )
      `)
      .eq('author_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(error.message)
    }

    return polls.map(poll => ({
      id: poll.id,
      title: poll.title,
      description: poll.description || '',
      options: poll.poll_options.map((opt: any) => ({
        id: opt.id,
        text: opt.text,
        votes: 0, // We'll calculate this separately
        pollId: opt.poll_id
      })),
      totalVotes: 0, // We'll calculate this separately
      isActive: poll.is_active,
      createdAt: poll.created_at,
      updatedAt: poll.updated_at,
      authorId: poll.author_id,
      author: {
        id: poll.profiles.id,
        name: poll.profiles.name,
        email: '',
        createdAt: poll.profiles.created_at,
        updatedAt: poll.profiles.updated_at,
      }
    }))
  }
}

export const pollService = PollService.getInstance()
