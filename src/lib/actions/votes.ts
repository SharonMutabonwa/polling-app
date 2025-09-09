'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const voteSchema = z.object({
  pollId: z.string().min(1),
  optionId: z.string().min(1),
});

export async function submitVote(formData: FormData) {
  const supabase = await createClient();
  
  try {
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('Auth error:', userError);
      throw new Error('Authentication failed. Please try logging in again.');
    }
    
    if (!user) {
      throw new Error('You must be logged in to vote. Please sign in and try again.');
    }

    // Validate form data
    const validatedFields = voteSchema.safeParse({
      pollId: formData.get('pollId'),
      optionId: formData.get('optionId'),
    });

    if (!validatedFields.success) {
      console.error('Validation error:', validatedFields.error);
      throw new Error('Invalid vote data. Please refresh the page and try again.');
    }

    const { pollId, optionId } = validatedFields.data;

    // Verify poll exists and option belongs to poll
    const { data: pollOption, error: optionError } = await supabase
      .from('poll_options')
      .select('id, poll_id')
      .eq('id', optionId)
      .eq('poll_id', pollId)
      .single();

    if (optionError) {
      console.error('Option verification error:', optionError);
      if (optionError.code === 'PGRST116') {
        throw new Error('Invalid poll option. This option may have been removed.');
      }
      throw new Error('Failed to verify poll option. Please try again.');
    }

    // Check if user has already voted on this poll
    const { data: existingVote, error: checkError } = await supabase
      .from('votes')
      .select('id')
      .eq('user_id', user.id)
      .eq('poll_id', pollId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Vote check error:', checkError);
      throw new Error('Failed to verify voting eligibility. Please try again.');
    }

    if (existingVote) {
      throw new Error('You have already voted on this poll. Each user can only vote once.');
    }

    // Submit the vote
    const { error: voteError } = await supabase
      .from('votes')
      .insert({
        user_id: user.id,
        poll_id: parseInt(pollId),
        option_id: parseInt(optionId),
      });

    if (voteError) {
      console.error('Vote submission error:', voteError);
      if (voteError.code === '23505') {
        throw new Error('You have already voted on this poll.');
      }
      throw new Error('Failed to submit your vote. Please try again.');
    }

    // Revalidate the poll page to show updated results
    revalidatePath(`/polls/${pollId}`);
    
  } catch (error) {
    // Re-throw known errors, wrap unknown errors
    if (error instanceof Error) {
      throw error;
    }
    console.error('Unexpected error in submitVote:', error);
    throw new Error('An unexpected error occurred while submitting your vote.');
  }
}

export async function getPollWithVotes(pollId: string) {
  const supabase = await createClient();
  
  try {
    // Get poll data with options
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .select(`
        id,
        question,
        created_at,
        user_id,
        poll_options (
          id,
          text
        )
      `)
      .eq('id', pollId)
      .single();

    if (pollError) {
      throw new Error('Poll not found');
    }

    // Get vote counts for each option
    const { data: voteCounts, error: voteError } = await supabase
      .from('votes')
      .select('option_id')
      .eq('poll_id', pollId);

    if (voteError) {
      throw new Error('Failed to fetch vote counts');
    }

    // Calculate vote counts per option
    const voteCountMap = voteCounts.reduce((acc, vote) => {
      acc[vote.option_id] = (acc[vote.option_id] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    // Get user's vote if authenticated
    const { data: { user } } = await supabase.auth.getUser();
    let userVote = null;
    
    if (user) {
      const { data: vote } = await supabase
        .from('votes')
        .select('option_id')
        .eq('user_id', user.id)
        .eq('poll_id', pollId)
        .single();
      
      userVote = vote?.option_id || null;
    }

    // Get creator info
    const { data: creator } = await supabase
      .from('profiles')
      .select('full_name, email')
      .eq('id', poll.user_id)
      .single();

    // Format the response
    const options = poll.poll_options.map(option => ({
      id: option.id.toString(),
      text: option.text,
      votes: voteCountMap[option.id] || 0,
    }));

    const totalVotes = Object.values(voteCountMap).reduce((sum, count) => sum + count, 0);

    return {
      id: poll.id.toString(),
      title: poll.question,
      options,
      createdBy: creator?.full_name || creator?.email || 'Unknown',
      createdAt: poll.created_at,
      totalVotes,
      hasVoted: userVote !== null,
      userVote: userVote?.toString() || null,
    };
    
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch poll data');
  }
}

export async function checkUserVote(pollId: string) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return null;
  }

  const { data: vote } = await supabase
    .from('votes')
    .select('option_id')
    .eq('user_id', user.id)
    .eq('poll_id', pollId)
    .single();

  return vote?.option_id?.toString() || null;
}