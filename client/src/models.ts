export type Vote = 'UPVOTE' | 'DOWNVOTE' | null;

export interface Report {
  reporter: string;
  timestamp: string;
  open: boolean;
  upvotes: number;
  downvotes: number;
  myVote: Vote;
}
