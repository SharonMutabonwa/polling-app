'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const createPollSchema = z.object({
  question: z.string().min(5, 'Question must be at least 5 characters').max(100, 'Question must not exceed 100 characters'),
  options: z.array(
    z.string().min(1, 'Option text is required')
  ).min(2, 'At least 2 options are required').max(10, 'Maximum 10 options allowed'),
});

export async function createPoll(formData: FormData) {
  const supabase = createClient();
  
  try {
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('Auth error in createPoll:', userError);
      throw new Error('Authentication failed. Please try logging in again.');
    }
    
    if (!user) {
      throw new Error('You must be logged in to create a poll. Please sign in and try again.');
    }

    // Extract and validate form data
    const question = formData.get('question') as string;
    const optionsData = formData.getAll('options') as string[];
    
    // Filter out empty options
    const options = optionsData.filter(option => option.trim() !== '');
    
    const validatedData = createPollSchema.parse({
      question: question?.trim(),
      options,
    });

    // Check for duplicate options
    const uniqueOptions = [...new Set(validatedData.options.map(opt => opt.toLowerCase()))];
    if (uniqueOptions.length !== validatedData.options.length) {
      throw new Error('Poll options must be unique. Please remove duplicate options.');
    }

    // Insert the poll
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .insert({ 
        question: validatedData.question, 
        user_id: user.id,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (pollError) {
      console.error('Poll creation error:', pollError);
      if (pollError.code === '23505') {
        throw new Error('A poll with this question already exists.');
      }
      throw new Error('Failed to create poll. Please try again.');
    }

    // Insert the poll options
    const optionsToInsert = validatedData.options.map(option => ({
      text: option.trim(),
      poll_id: poll.id,
    }));

    const { error: optionsError } = await supabase
      .from('poll_options')
      .insert(optionsToInsert);

    if (optionsError) {
      console.error('Poll options creation error:', optionsError);
      // Try to clean up the poll if options failed
      await supabase.from('polls').delete().eq('id', poll.id);
      throw new Error('Failed to create poll options. Please try again.');
    }

    // Revalidate the polls page to show the new poll
    revalidatePath('/polls');
    
    // Redirect to the new poll
    redirect(`/polls/${poll.id}`);
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Poll validation error:', error);
      const errors = error.errors.map(e => e.message).join(', ');
      throw new Error(`Invalid poll data: ${errors}`);
    }
    // Re-throw known errors, wrap unknown errors
    if (error instanceof Error) {
      throw error;
    }
    console.error('Unexpected error in createPoll:', error);
    throw new Error('An unexpected error occurred while creating the poll.');
  }
}

export async function getPollById(id: string) {
  const supabase = createClient();
  
  const { data: poll, error } = await supabase
    .from('polls')
    .select(`
      *,
      poll_options (*),
      votes (*)
    `)
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(`Failed to fetch poll: ${error.message}`);
  }

  return poll;
}

export async function getPolls() {
  const supabase = createClient();
  
  const { data: polls, error } = await supabase
    .from('polls')
    .select(`
      *,
      poll_options (*),
      votes (*)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch polls: ${error.message}`);
  }

  return polls;
}